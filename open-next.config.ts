import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // Run Next.js directly. `npm run build` delegates to OpenNext on Cloudflare
  // builders (see scripts/build.mjs), so calling it here would loop forever.
  buildCommand: "npx next build",
};
