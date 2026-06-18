import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Self-hosting on Plesk/Passenger: emit a minimal, self-contained
  // server at .next/standalone (server.js + pruned node_modules) that
  // Passenger runs directly. No `next start` needed.
  output: "standalone",
  // Pin file-tracing to THIS project so the standalone bundle is built
  // from the right root (avoids picking up an unrelated parent lockfile,
  // e.g. one in a home directory, which would bloat or break tracing).
  outputFileTracingRoot: __dirname,
};

export default withNextIntl(nextConfig);
