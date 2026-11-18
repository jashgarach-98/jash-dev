import rawVideos from "@/data/youtube-videos.json";

export type VideoCategory =
  | "All Videos"
  | "AI & Tech"
  | "Mobile & Coding"
  | "Road Trips & Travel"
  | "Cars & Automotive"
  | "Lifestyle & Events";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  publishedLabel: string;
  categories: string[];
  primaryCategory: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
  videoUrl: string;
  tags: string[];
  viewCount?: string;
  lengthSeconds?: string;
  isShort?: boolean;
}

export const YOUTUBE_CHANNEL = {
  name: "JASH GARACH",
  handle: "@JASHGARACH",
  url: "https://www.youtube.com/@JASHGARACH",
  instagramUrl: "https://www.instagram.com/jashgarach.tech/",
  heroHeading: "My Content",
  heroDescription:
    "Welcome to my video space! Explore the latest in AI, Mobile Apps (Android & Flutter), Road Trips, Automotive, and Lifestyle. I share real experiences, code workflows, and discoveries to keep you inspired and updated.",
  aboutTitle: "What You'll Find Here",
  aboutDescription:
    "From exploring bleeding-edge AI models and Flutter app development to scenic monsoon road trips, car modifications, and lifestyle moments, this channel brings together my passions.",
  galleryHeading: "All My Videos",
  galleryDescription:
    "Explore my collection of videos, organized by topic. Filter by AI, mobile development, road trips, automotive, and lifestyle.",
  subscribeHeading: "Enjoying My Content?",
  subscribeDescription:
    "If you enjoy AI, mobile apps, automotive, road trips, and interesting discoveries, subscribe to my YouTube channel and join the journey!",
};

export const CATEGORIES: VideoCategory[] = [
  "All Videos",
  "AI & Tech",
  "Mobile & Coding",
  "Road Trips & Travel",
  "Cars & Automotive",
  "Lifestyle & Events",
];

export const CATEGORY_COLORS: Record<string, string> = {
  "AI & Tech": "#E1FF00",
  "Mobile & Coding": "#00F0FF",
  "Road Trips & Travel": "#00DF72",
  "Cars & Automotive": "#FF007A",
  "Lifestyle & Events": "#FF8A00",
  "All Videos": "#FF0000",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || "#00F0FF";
}

export const videos: YouTubeVideo[] = rawVideos as YouTubeVideo[];

export function getAllVideos(): YouTubeVideo[] {
  return [...videos].sort((a, b) => {
    const timeA = new Date(a.publishedDate).getTime() || 0;
    const timeB = new Date(b.publishedDate).getTime() || 0;
    return timeB - timeA;
  });
}

export function getVideoById(id: string): YouTubeVideo | undefined {
  return videos.find((v) => v.id === id);
}

export function getVideosByCategory(category: VideoCategory): YouTubeVideo[] {
  if (category === "All Videos") {
    return getAllVideos();
  }
  return getAllVideos().filter((v) =>
    v.categories.some((c) => c.toLowerCase() === category.toLowerCase())
  );
}

export function filterVideos(
  videoList: YouTubeVideo[],
  category: VideoCategory,
  searchQuery: string = ""
): YouTubeVideo[] {
  let result = videoList;

  // Filter by Category
  if (category !== "All Videos") {
    result = result.filter((v) =>
      v.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }

  // Filter by Search Query
  const query = searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (v) =>
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.tags.some((t) => t.toLowerCase().includes(query)) ||
        v.categories.some((c) => c.toLowerCase().includes(query))
    );
  }

  return result;
}

export function getCategoryCounts(
  videoList: YouTubeVideo[]
): Record<VideoCategory, number> {
  const counts: Record<VideoCategory, number> = {
    "All Videos": videoList.length,
    "AI & Tech": 0,
    "Mobile & Coding": 0,
    "Road Trips & Travel": 0,
    "Cars & Automotive": 0,
    "Lifestyle & Events": 0,
  };

  for (const v of videoList) {
    for (const cat of v.categories) {
      if (cat in counts && cat !== "All Videos") {
        counts[cat as VideoCategory]++;
      }
    }
  }

  return counts;
}
