import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "../out");

if (!fs.existsSync(outDir)) {
  console.log(`[post-build] No ${outDir} directory found. Skipping.`);
  process.exit(0);
}

console.log("[post-build] Synchronizing static export for GitHub Pages...");

// Clean up any bogus folders that might have been created from previous runs
for (const bogus of ["__next.__PAGE__", "__next._full", "__next._tree"]) {
  const p = path.join(outDir, bogus);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

// 1. Ensure .nojekyll exists
const nojekyllPath = path.join(outDir, ".nojekyll");
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, "# Disable Jekyll processing\n");
  console.log("[post-build] Created out/.nojekyll");
}

// 2. Ensure root 404.html exists
const root404 = path.join(outDir, "404.html");
const candidates404 = [
  path.join(outDir, "_not-found", "index.html"),
  path.join(outDir, "_not-found.html"),
  path.join(outDir, "not-found", "index.html"),
  path.join(outDir, "not-found.html"),
  path.join(outDir, "404", "index.html"),
];

for (const candidate of candidates404) {
  if (fs.existsSync(candidate)) {
    fs.copyFileSync(candidate, root404);
    console.log(`[post-build] Created root 404.html from ${path.relative(outDir, candidate)}`);
    break;
  }
}

// 3. Dual-route mirroring: ensure both /path/index.html AND /path.html exist
function syncDirectory(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      // Ignore Next.js internals and assets
      if (entry.name === "_next" || entry.name === "assets" || entry.name.startsWith(".")) {
        continue;
      }

      // If directory has index.html, create corresponding dir.html
      const indexPath = path.join(fullPath, "index.html");
      const flatHtmlPath = `${fullPath}.html`;
      if (fs.existsSync(indexPath) && !fs.existsSync(flatHtmlPath)) {
        fs.copyFileSync(indexPath, flatHtmlPath);
        console.log(`[post-build] Mirrored: ${path.relative(outDir, indexPath)} -> ${path.relative(outDir, flatHtmlPath)}`);
      }

      // If directory has index.txt (RSC data), create dir.txt
      const indexTxtPath = path.join(fullPath, "index.txt");
      const flatTxtPath = `${fullPath}.txt`;
      if (fs.existsSync(indexTxtPath) && !fs.existsSync(flatTxtPath)) {
        fs.copyFileSync(indexTxtPath, flatTxtPath);
        console.log(`[post-build] Mirrored: ${path.relative(outDir, indexTxtPath)} -> ${path.relative(outDir, flatTxtPath)}`);
      }

      syncDirectory(fullPath);
    } else if (entry.isFile()) {
      // If flat file exists (e.g. blog.html), ensure blog/index.html exists
      if (entry.name.endsWith(".html") && entry.name !== "index.html" && entry.name !== "404.html" && !entry.name.startsWith("_")) {
        const baseName = entry.name.slice(0, -5);
        const targetDir = path.join(currentDir, baseName);
        const targetIndex = path.join(targetDir, "index.html");

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        if (!fs.existsSync(targetIndex)) {
          fs.copyFileSync(fullPath, targetIndex);
          console.log(`[post-build] Mirrored: ${path.relative(outDir, fullPath)} -> ${path.relative(outDir, targetIndex)}`);
        }
      }

      // If flat .txt exists (e.g. blog.txt), ensure blog/index.txt exists
      if (entry.name.endsWith(".txt") && entry.name !== "index.txt" && !entry.name.startsWith("__next") && !entry.name.startsWith("_")) {
        const baseName = entry.name.slice(0, -4);
        const targetDir = path.join(currentDir, baseName);
        const targetTxt = path.join(targetDir, "index.txt");

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        if (!fs.existsSync(targetTxt)) {
          fs.copyFileSync(fullPath, targetTxt);
          console.log(`[post-build] Mirrored: ${path.relative(outDir, fullPath)} -> ${path.relative(outDir, targetTxt)}`);
        }
      }
    }
  }
}

syncDirectory(outDir);
console.log("[post-build] GitHub Pages static sync completed successfully.");
