// Cloudflare environment type definitions without polluting global DOM Body.json() types

export interface D1Database {
  prepare(query: string): any;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: any[]): Promise<any[]>;
  exec(query: string): Promise<any>;
}

declare global {
  namespace Cloudflare {
    interface Env {
      DB: D1Database;
      /** R2 bucket for uploaded files (see src/lib/storage.ts) */
      UPLOADS?: any;
      JWT_SECRET?: string;
      ASSETS?: any;
      WORKER_SELF_REFERENCE?: any;
    }
  }
}

export {};
