import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { AppUser } from "../userStore";
import { COOKIE_NAME } from "@shared/const";
import { jwtVerify } from "jose";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AppUser | null;
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: AppUser | null = null;

  // 1. Tenta obter o token do cookie (httpOnly)
  let token = opts.req.cookies?.[COOKIE_NAME];

  // 2. Fallback: obtém do header Authorization (Bearer)
  if (!token) {
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = {
        email: payload.email as string,
        name: payload.name as string,
        passwordHash: "",
        role: payload.role as "user" | "admin",
      };
    } catch { /* token inválido */ }
  }

  return { req: opts.req, res: opts.res, user };
}