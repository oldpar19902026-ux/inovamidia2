export interface Video {
  id: number;
  title: string;
  description?: string | null;
  url: string;
  storageKey?: string | null;
  order: number;
  isActive: number;
  duration?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Reexporta o tipo do roteador do servidor para uso no cliente
export type { AppRouter } from "../server/routers";