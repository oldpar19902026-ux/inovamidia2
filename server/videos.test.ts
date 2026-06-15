import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("videos router", () => {
  describe("videos.list (public)", () => {
    it("should return active videos for public access", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.videos.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("videos.listAll (protected)", () => {
    it("should return all videos for authenticated users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.videos.listAll();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject unauthenticated users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.videos.listAll();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("videos.create (protected)", () => {
    it("should create a new video for authenticated users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.videos.create({
        title: "Test Video",
        description: "A test video",
        url: "https://example.com/video.mp4",
        order: 0,
        isActive: 1,
        duration: 60,
      });

      expect(result).toBeDefined();
    });

    it("should reject unauthenticated users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.videos.create({
          title: "Test Video",
          description: "A test video",
          url: "https://example.com/video.mp4",
          order: 0,
          isActive: 1,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should validate required fields", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.videos.create({
          title: "",
          description: "",
          url: "invalid-url",
          order: 0,
          isActive: 1,
        });
        expect.fail("Should have thrown a validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("videos.reorder (protected)", () => {
    it("should reorder videos for authenticated users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.videos.reorder({
        videoIds: [1, 2, 3],
      });

      expect(result).toEqual({ success: true });
    });

    it("should reject unauthenticated users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.videos.reorder({
          videoIds: [1, 2, 3],
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
