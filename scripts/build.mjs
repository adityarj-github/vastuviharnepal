// `npm run build` entry point.
//
// On Cloudflare Workers Builds (WORKERS_CI is set), the deploy step runs
// `wrangler deploy`, which needs the OpenNext bundle in `.open-next/`.
// So there we build with OpenNext (which runs `next build` itself).
// Everywhere else this is a plain `next build`.
//
// Set OPENNEXT_BUILD=1 to force the OpenNext build in another environment.
import { execSync } from "node:child_process";

const env = { ...process.env };

// Pages are prerendered at build time, when the D1 binding isn't available.
// Point Prisma at the committed SQLite snapshot so prerendering has data.
env.DATABASE_URL ??= "file:./dev.db";

const useOpenNext = Boolean(env.WORKERS_CI || env.OPENNEXT_BUILD);
const command = useOpenNext ? "npx opennextjs-cloudflare build" : "npx next build";

console.log(`> ${command}`);
execSync(command, { stdio: "inherit", env });
