import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, "../data/youtube-videos.json");

const CHANNEL_HANDLE = "@JASHGARACH";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: HEADERS }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchText(res.headers.location).then(resolve, reject);
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function formatDate(isoStr) {
  if (!isoStr) return "Recent";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr.slice(0, 10);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoStr.slice(0, 10);
  }
}

function classifyVideo(title, description, tags = []) {
  const text = `${title} ${description} ${tags.join(" ")}`.toLowerCase();
  const categories = [];

  const isAI =
    text.includes("claude") ||
    text.includes("ai ") ||
    text.includes("artificial intelligence") ||
    text.includes("model") ||
    text.includes("fable") ||
    text.includes("anthropic");

  const isTutorial =
    text.includes("convert") ||
    text.includes("workflow") ||
    text.includes("how to") ||
    text.includes("tutorial") ||
    text.includes("skills every") ||
    text.includes("replace mobile developers") ||
    text.includes("test");

  const isAppSoftware =
    text.includes("flutter") ||
    text.includes("android") ||
    text.includes("figma") ||
    text.includes("app") ||
    text.includes("software") ||
    text.includes("coding");

  const isGadget =
    text.includes("car") ||
    text.includes("seltos") ||
    text.includes("kia") ||
    text.includes("phone") ||
    text.includes("smartphone") ||
    text.includes("gadget") ||
    text.includes("device");

  const isTravel =
    text.includes("travel") ||
    text.includes("road trip") ||
    text.includes("statue of unity") ||
    text.includes("saputara") ||
    text.includes("daman") ||
    text.includes("monsoon") ||
    text.includes("waterfall") ||
    text.includes("beach") ||
    text.includes("mumbai") ||
    text.includes("hills") ||
    text.includes("bhavnagar") ||
    text.includes("surat") ||
    text.includes("sunidhi") ||
    text.includes("diwali") ||
    text.includes("vibe");

  if (isAI) categories.push("AI & Tools");
  if (isAppSoftware) categories.push("Apps & Software");
  if (isTutorial) categories.push("Tutorials & Reviews");
  if (isGadget) categories.push("Gadgets");
  if (isTravel) categories.push("Travel & Lifestyle");

  if (text.includes("technology") || text.includes("tech") || text.includes("innovation") || isAI) {
    if (!categories.includes("Technology")) categories.unshift("Technology");
  }

  if (categories.length === 0) {
    categories.push("Technology");
  }

  return categories;
}

async function main() {
  console.log(`[fetch-youtube] Querying channel ${CHANNEL_HANDLE}...`);

  // Load existing data if available
  let existingVideos = [];
  if (fs.existsSync(dataFile)) {
    try {
      existingVideos = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch {
      existingVideos = [];
    }
  }

  const existingMap = new Map(existingVideos.map((v) => [v.id, v]));

  // Scrape video and short IDs from YouTube channel pages
  const videoIds = new Set();
  for (const tab of ["shorts", "videos"]) {
    try {
      const html = await fetchText(`https://www.youtube.com/${CHANNEL_HANDLE}/${tab}`);
      const matches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
      for (const m of matches) {
        videoIds.add(m[1]);
      }
    } catch (err) {
      console.warn(`[fetch-youtube] Warning checking ${tab}: ${err.message}`);
    }
  }

  console.log(`[fetch-youtube] Discovered ${videoIds.size} videos from channel.`);

  const updatedVideos = [];
  for (const vid of videoIds) {
    try {
      console.log(`[fetch-youtube] Fetching video details for ${vid}...`);
      const html = await fetchText(`https://www.youtube.com/watch?v=${vid}`);
      const m = html.match(/var ytInitialPlayerResponse = ({.*?});(?:var|<\/script>)/s);
      if (!m) {
        if (existingMap.has(vid)) {
          updatedVideos.push(existingMap.get(vid));
        }
        continue;
      }

      const playerResponse = JSON.parse(m[1]);
      const vd = playerResponse.videoDetails || {};
      const mf = playerResponse.microformat?.playerMicroformatRenderer || {};

      const title = vd.title || existingMap.get(vid)?.title || "";
      const description = vd.shortDescription || existingMap.get(vid)?.description || "";
      const publishDate = mf.publishDate || mf.uploadDate || existingMap.get(vid)?.publishedDate || "";
      const lengthSeconds = vd.lengthSeconds || existingMap.get(vid)?.lengthSeconds || "0";
      const viewCount = vd.viewCount || existingMap.get(vid)?.viewCount || "0";

      const rawKeywords = vd.keywords || [];
      const tags = [];
      for (const k of rawKeywords) {
        for (const part of k.split(",")) {
          const t = part.trim();
          if (t && !tags.includes(t) && !t.startsWith("http") && t.length < 30) {
            tags.push(t);
          }
        }
      }

      const categories = classifyVideo(title, description, tags);

      updatedVideos.push({
        id: vid,
        title,
        description,
        publishedDate: publishDate,
        publishedLabel: formatDate(publishDate),
        categories,
        primaryCategory: categories[0] || "Technology",
        thumbnailUrl: `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`,
        fallbackThumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${vid}`,
        tags: tags.slice(0, 5),
        viewCount,
        lengthSeconds,
        isShort: parseInt(lengthSeconds, 10) <= 60,
      });
    } catch (err) {
      console.error(`[fetch-youtube] Error fetching ${vid}: ${err.message}`);
      if (existingMap.has(vid)) {
        updatedVideos.push(existingMap.get(vid));
      }
    }
  }

  // Preserve any manually registered videos that might not be in latest channel scrape
  for (const existing of existingVideos) {
    if (!updatedVideos.some((v) => v.id === existing.id)) {
      updatedVideos.push(existing);
    }
  }

  // Sort descending by publishDate
  updatedVideos.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  fs.writeFileSync(dataFile, JSON.stringify(updatedVideos, null, 2), "utf8");
  console.log(`[fetch-youtube] Successfully saved ${updatedVideos.length} videos to data/youtube-videos.json`);
}

main().catch(console.error);
