/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",         // Generates a static /out folder
  trailingSlash: true,      // Required for GitHub Pages routing
  basePath: "/jash-dev",    // Must match your GitHub repo name
  images: {
    unoptimized: true,      // next/image optimization needs a server; disabled for static export
  },
};

export default nextConfig;
