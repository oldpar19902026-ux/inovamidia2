// server/wsServer.ts
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";

const clients = new Set<WebSocket>();

let currentState = {
  videoUrl: "",
  isPlaying: false,
  currentTime: 0,
  timestamp: Date.now(),
};

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    console.log(`[WebSocket] Cliente conectado. Total: ${clients.size}`);

    ws.send(JSON.stringify({ type: "state", ...currentState }));

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "play":
            currentState = {
              ...currentState,
              isPlaying: true,
              currentTime: message.currentTime || currentState.currentTime,
              timestamp: Date.now(),
            };
            break;
          case "pause":
            currentState = {
              ...currentState,
              isPlaying: false,
              currentTime: message.currentTime || currentState.currentTime,
              timestamp: Date.now(),
            };
            break;
          case "seek":
            currentState = {
              ...currentState,
              currentTime: message.currentTime,
              timestamp: Date.now(),
            };
            break;
          case "load":
            currentState = {
              videoUrl: message.videoUrl,
              isPlaying: false,
              currentTime: 0,
              timestamp: Date.now(),
            };
            break;
          case "ping":
            ws.send(JSON.stringify({ type: "pong" }));
            return;
        }

        broadcast(message, ws);
      } catch (err) {
        console.error("[WebSocket] Mensagem inválida:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`[WebSocket] Cliente desconectado. Total: ${clients.size}`);
    });

    ws.on("error", (err) => {
      console.error("[WebSocket] Erro:", err);
      clients.delete(ws);
    });
  });

  console.log("[WebSocket] Servidor iniciado em /ws");
}

function broadcast(message: object, sender?: WebSocket) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export function sendCommand(type: string, payload: object = {}) {
  const message = JSON.stringify({ type, ...payload });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}