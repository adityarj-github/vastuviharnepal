import type { NextConfig } from "next";

// Only initialize Wrangler proxy during development mode (not during production build)
if (process.env.NODE_ENV !== "production") {
  process.env.WRANGLER_HOME = process.env.WRANGLER_HOME || "/tmp/.wrangler";
  process.env.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME || "/tmp/.config";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  } catch {
    // Ignored if OpenNext dev proxy is not required
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
