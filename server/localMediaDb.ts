import fs from "fs";
import path from "path";

export interface LocalVideoMeta {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration: number | null;
  order: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_PATH = path.resolve(process.cwd(), "local-media", "videos.json");

function readVideos(): LocalVideoMeta[] {
  try {
    if (!fs.existsSync(STORAGE_PATH)) return [];
    const raw = fs.readFileSync(STORAGE_PATH, "utf-8");
    return JSON.parse(raw) as LocalVideoMeta[];
  } catch {
    return [];
  }
}

function writeVideos(videos: LocalVideoMeta[]) {
  const dir = path.dirname(STORAGE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(videos, null, 2), "utf-8");
}

export async function getLocalVideos(): Promise<LocalVideoMeta[]> {
  const videos = readVideos();
  return videos.filter(v => v.isActive === 1).sort((a, b) => a.order - b.order);
}

export async function getAllLocalVideos(): Promise<LocalVideoMeta[]> {
  const videos = readVideos();
  return videos.sort((a, b) => a.order - b.order);
}

export async function getLocalVideoById(id: number): Promise<LocalVideoMeta | undefined> {
  const videos = readVideos();
  return videos.find(v => v.id === id);
}

export async function createLocalVideo(data: {
  title: string;
  description?: string | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration?: number | null;
  order: number;
}): Promise<LocalVideoMeta> {
  const videos = readVideos();
  const newId = videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1;
  const now = new Date().toISOString();
  const newVideo: LocalVideoMeta = {
    id: newId,
    title: data.title,
    description: data.description ?? null,
    filename: data.filename,
    originalName: data.originalName,
    mimeType: data.mimeType,
    size: data.size,
    duration: data.duration ?? null,
    order: data.order,
    isActive: 1,
    createdAt: now,
    updatedAt: now,
  };
  videos.push(newVideo);
  writeVideos(videos);
  return newVideo;
}

export async function updateLocalVideo(
  id: number,
  data: Partial<Pick<LocalVideoMeta, "title" | "description" | "isActive" | "duration" | "order">>
): Promise<void> {
  const videos = readVideos();
  const idx = videos.findIndex(v => v.id === id);
  if (idx === -1) throw new Error("Vídeo não encontrado");
  const updated = { ...videos[idx], ...data, updatedAt: new Date().toISOString() };
  videos[idx] = updated;
  writeVideos(videos);
}

export async function deleteLocalVideo(id: number): Promise<void> {
  const videos = readVideos();
  const filtered = videos.filter(v => v.id !== id);
  writeVideos(filtered);
}

export async function reorderLocalVideos(videoIds: number[]): Promise<void> {
  const videos = readVideos();
  for (let i = 0; i < videoIds.length; i++) {
    const video = videos.find(v => v.id === videoIds[i]);
    if (video) {
      video.order = i;
      video.updatedAt = new Date().toISOString();
    }
  }
  writeVideos(videos);
}