import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  // eslint-disable-next-line no-var
  var __prisma_local_client: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __prisma_d1_client: PrismaClient | undefined;
}

function getActivePrismaClient(): PrismaClient {
  // In development mode without explicit USE_D1 flag, always use local SQLite database (prisma/dev.db)
  const preferLocalSqlite = process.env.NODE_ENV === "development" && process.env.USE_D1 !== "true";

  if (!preferLocalSqlite) {
    // 1. Try to obtain Cloudflare D1 database from runtime context (Workers / Preview / Production)
    try {
      const cf = getCloudflareContext();
      const d1Database = (cf?.env as Record<string, unknown> | undefined)?.DB as any;
      if (d1Database) {
        if (!globalThis.__prisma_d1_client) {
          const adapter = new PrismaD1(d1Database);
          globalThis.__prisma_d1_client = new PrismaClient({ adapter });
        }
        return globalThis.__prisma_d1_client;
      }
    } catch {
      // Cloudflare context is not active in this environment (e.g. pure Node dev or CLI)
    }
  }

  // 2. Fall back to local SQLite file database
  if (!globalThis.__prisma_local_client) {
    globalThis.__prisma_local_client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return globalThis.__prisma_local_client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getActivePrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
