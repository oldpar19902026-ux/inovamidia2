import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { SignJWT } from "jose";
import { sendCommand } from "./wsServer";
import fs from "fs";
import path from "path";
import {
  getLocalVideos,
  getAllLocalVideos,
  getLocalVideoById,
  createLocalVideo,
  updateLocalVideo,
  deleteLocalVideo,
  reorderLocalVideos,
} from "./localMediaDb";
import { getUserByEmail, verifyPassword, seedAdminIfEmpty } from "./userStore";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

const LOCAL_MEDIA_DIR = path.resolve(process.cwd(), "local-media");

// Garantir que o admin exista (executado uma vez ao carregar o módulo)
seedAdminIfEmpty().catch(console.error);

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => {
      console.log("[auth.me] user:", opts.ctx.user);
      return opts.ctx.user;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
      // Limpa o cookie definindo Max-Age=0
      ctx.res.clearCookie(COOKIE_NAME, { path: "/" });
      return { success: true } as const;
    }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou senha inválidos",
          });
        }

        const valid = await verifyPassword(user, input.password);
        if (!valid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou senha inválidos",
          });
        }

        const payload = {
          email: user.email,
          name: user.name,
          role: user.role,
        };

        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .sign(JWT_SECRET);

        // Define o cookie (para compatibilidade com navegadores que aceitam)
        ctx.res.cookie(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
        });

        // ✅ Retorna o token no corpo da resposta para uso via localStorage
        return { success: true, token };
      }),
  }),

  // ----- Vídeos Locais (PC do admin) -----
  localVideos: router({
    list: publicProcedure.query(async () => {
      return await getLocalVideos();
    }),

    listAll: protectedProcedure.query(async () => {
      return await getAllLocalVideos();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        return await getLocalVideoById(input.id);
      }),

    saveInfo: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          filename: z.string(),
          originalName: z.string(),
          mimeType: z.string(),
          size: z.number(),
          duration: z.number().positive().optional(),
          order: z.number().int().nonnegative(),
        })
      )
      .mutation(async ({ input }) => {
        const video = await createLocalVideo({
          title: input.title,
          description: input.description || null,
          filename: input.filename,
          originalName: input.originalName,
          mimeType: input.mimeType,
          size: input.size,
          duration: input.duration || null,
          order: input.order,
        });
        return { success: true, video };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          isActive: z.number().int().min(0).max(1).optional(),
          duration: z.number().positive().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateLocalVideo(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const video = await getLocalVideoById(input.id);
        if (video) {
          const filePath = path.join(LOCAL_MEDIA_DIR, video.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await deleteLocalVideo(input.id);
        return { success: true };
      }),

    reorder: protectedProcedure
      .input(z.object({ videoIds: z.array(z.number().int().positive()) }))
      .mutation(async ({ input }) => {
        await reorderLocalVideos(input.videoIds);
        return { success: true };
      }),

    // Comandos WebSocket para espelhamento
    loadVideo: protectedProcedure
      .input(
        z.object({
          url: z.string(),
          videoId: z.number().int().positive(),
        })
      )
      .mutation(async ({ input }) => {
        sendCommand("load", { videoUrl: input.url, videoId: input.videoId });
        return { success: true };
      }),

    controlPlay: protectedProcedure
      .input(z.object({ currentTime: z.number().min(0) }))
      .mutation(async ({ input }) => {
        sendCommand("play", { currentTime: input.currentTime });
        return { success: true };
      }),

    controlPause: protectedProcedure
      .input(z.object({ currentTime: z.number().min(0) }))
      .mutation(async ({ input }) => {
        sendCommand("pause", { currentTime: input.currentTime });
        return { success: true };
      }),

    controlSeek: protectedProcedure
      .input(z.object({ currentTime: z.number().min(0) }))
      .mutation(async ({ input }) => {
        sendCommand("seek", { currentTime: input.currentTime });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
export const createCaller = appRouter.createCaller;