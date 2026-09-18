import type { NextConfig } from "next";

// basePath is only needed on GitHub Pages (production).
// Locally, we run without it so localhost:3000 works normally.
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",        // Generates a static /out folder for GitHub Pages
  trailingSlash: true,     // Required for GitHub Pages routing
  basePath: isProd ? "/jash-dev" : "",   // Only prefix on production
  images: {
    unoptimized: true,     // Required for static export (no image server)
  },
};

export default nextConfig;
