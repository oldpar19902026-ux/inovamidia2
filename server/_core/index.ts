import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { setupWebSocket } from "../wsServer";
import multer from "multer";
import path from "path";
import fs from "fs";

// ----------------------------------------------------------------
// Configuração de armazenamento local de vídeos
// ----------------------------------------------------------------
const LOCAL_MEDIA_DIR = path.resolve(process.cwd(), "local-media");
if (!fs.existsSync(LOCAL_MEDIA_DIR)) {
  fs.mkdirSync(LOCAL_MEDIA_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, LOCAL_MEDIA_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  fileFilter: (_req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de vídeo não suportado"));
    }
  },
});

// ----------------------------------------------------------------
// Inicialização do servidor
// ----------------------------------------------------------------
async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware para ler cookies
  app.use(cookieParser());

  // Middleware de diagnóstico: loga todos os headers definidos
  app.use((req, res, next) => {
    const originalSetHeader = res.setHeader;
    res.setHeader = function (name: string, value: any) {
      console.log(`[SetHeader] ${name}: ${value}`);
      return originalSetHeader.call(this, name, value);
    };
    next();
  });

  // Body parser com limite maior para uploads via tRPC
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Servir arquivos de mídia local com cabeçalhos úteis para streaming
  app.use(
    "/local-media",
    (req, res, next) => {
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=3600");
      next();
    },
    express.static(LOCAL_MEDIA_DIR)
  );

  // Rota de upload local
  app.post("/api/local-upload", upload.single("video"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }
    const videoUrl = `/local-media/${req.file.filename}`;
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      url: videoUrl,
    });
  });

  // Proxies e OAuth
  registerStorageProxy(app);

  // Rota de diagnóstico – testa envio de cookie
  app.get("/api/test-cookie", (req, res) => {
    console.log("[Test-Cookie] Cookies recebidos:", req.cookies);
    res.cookie("test_cookie", "123", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ cookies: req.cookies });
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Ambiente de desenvolvimento: Vite + WebSocket
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Configura o WebSocket para espelhamento de vídeos
  setupWebSocket(server);

  // ⚡ Sempre usar a porta 3000 em desenvolvimento; em produção usar a variável de ambiente
  const PORT = process.env.NODE_ENV === "production" 
    ? parseInt(process.env.PORT || "3000") 
    : 3000;

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ A porta ${PORT} já está em uso.`);
      console.error("   Feche o outro processo ou execute: npx kill-port 3000");
      process.exit(1);
    }
    throw err;
  });
}

startServer().catch(console.error);