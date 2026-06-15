import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@shared/types";

export const trpc = createTRPCReact<AppRouter>();

function getAuthToken(): string | undefined {
  const stored = localStorage.getItem("auth_token");
  return stored || undefined;
}

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        const token = getAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include", // ainda envia cookies como backup
        });
      },
    }),
  ],
});