import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  // eslint-disable-next-line no-var
  var __prisma_local_client: PrismaClient | undefined;
}

// On Workers, a client must not be shared between requests: promises created
// in one request can't settle in another. Cache one client per request,
// keyed by that request's ExecutionContext.
const d1ClientsByRequest = new WeakMap<object, PrismaClient>();

function getActivePrismaClient(): PrismaClient {
  // In development mode without explicit USE_D1 flag, always use local SQLite database (prisma/dev.db)
  const preferLocalSqlite = process.env.NODE_ENV === "development" && process.env.USE_D1 !== "true";

  if (!preferLocalSqlite) {
    // 1. Try to obtain Cloudflare D1 database from runtime context (Workers / Preview / Production)
    try {
      const cf = getCloudflareContext();
      const d1Database = (cf?.env as Record<string, unknown> | undefined)?.DB as any;
      if (d1Database) {
        const requestKey = cf.ctx as object | undefined;
        let client = requestKey ? d1ClientsByRequest.get(requestKey) : undefined;
        if (!client) {
          client = new PrismaClient({ adapter: new PrismaD1(d1Database) });
          if (requestKey) d1ClientsByRequest.set(requestKey, client);
        }
        return client;
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
    let client = getActivePrismaClient();

    // If a model is accessed in development that wasn't loaded in the cached instance, refresh it
    if (
      process.env.NODE_ENV === "development" &&
      typeof prop === "string" &&
      !prop.startsWith("$") &&
      !prop.startsWith("_") &&
      !(prop in client)
    ) {
      globalThis.__prisma_local_client = new PrismaClient({
        log: ["error", "warn"],
      });
      client = globalThis.__prisma_local_client;
    }

    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export function databaseFallback<T>(where: string, value: T) {
  return (error: unknown): T => {
    const tolerate =
      process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV !== "production";
    console.error(`${where}: database unavailable.`, error);
    if (!tolerate) throw error;
    return value;
  };
}

export const orEmpty = (where: string) => databaseFallback(where, [] as never[]);
export const orNull = (where: string) => databaseFallback(where, null);

