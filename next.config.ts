import type { NextConfig } from "next";

// basePath is only needed when deploying to a subpath like GitHub Pages (/jash-dev).
// On Vercel, localhost, or custom domains, basePath should be empty ("") so the site works at root domain.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubActions ? "/jash-dev" : "");

const nextConfig: NextConfig = {
  output: "export",        // Generates a static /out folder (works on Vercel & GitHub Pages)
  trailingSlash: true,     // Required for static routing
  basePath: basePath,      // Only prefix when deploying to GitHub Pages subpath
  images: {
    unoptimized: true,     // Required for static export (no image server)
  },
};

export default nextConfig;
