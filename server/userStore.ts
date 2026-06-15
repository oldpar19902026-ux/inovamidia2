import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

export interface UserRecord {
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "user";
}

export type AppUser = UserRecord;

// Caminho absoluto para a pasta local-media (raiz do projeto)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const STORAGE_PATH = path.join(ROOT_DIR, "local-media", "users.json");

function readUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(STORAGE_PATH)) return [];
    const raw = fs.readFileSync(STORAGE_PATH, "utf-8");
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

function writeUsers(users: UserRecord[]) {
  const dir = path.dirname(STORAGE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const users = readUsers();
  return users.find((u) => u.email === email);
}

export async function createUser(user: UserRecord): Promise<void> {
  const users = readUsers();
  if (users.find((u) => u.email === user.email)) {
    throw new Error("Usuário já existe");
  }
  users.push(user);
  writeUsers(users);
}

export async function verifyPassword(user: UserRecord, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function seedAdminIfEmpty() {
  const users = readUsers();
  console.log(`[UserStore] Caminho do users.json: ${STORAGE_PATH}`);
  console.log(`[UserStore] Usuários existentes: ${users.length}`);

  if (users.length === 0) {
    // Gera um novo hash para a senha desejada (evita problemas com hash fixo)
    const password = "SRA@1965*#*";
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(`[UserStore] Hash gerado: ${passwordHash}`);

    await createUser({
      email: "admin@gmail.com",
      name: "Administrador",
      passwordHash,
      role: "admin",
    });

    console.log("[UserStore] Admin criado com sucesso.");
  } else {
    console.log("[UserStore] Usuários já existem, seed ignorada.");
  }
}