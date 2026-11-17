import rawVideos from "@/data/youtube-videos.json";

export type VideoCategory =
  | "All Videos"
  | "Technology"
  | "AI & Tools"
  | "Gadgets"
  | "Apps & Software"
  | "Tutorials & Reviews"
  | "Travel & Lifestyle";

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
    "Welcome to my video space! Explore the latest in Technology, AI, Gadgets, Apps, Software, Tutorials, and Travel. I share interesting discoveries, experiences, and innovations to keep you inspired and updated.",
  aboutTitle: "What You'll Find Here",
  aboutDescription:
    "From exploring the latest AI innovations and technology trends to discovering useful applications, gadgets, software, and travel experiences, this channel brings together my passion for technology, creativity, and exploration.",
  galleryHeading: "All My Videos",
  galleryDescription:
    "Explore my collection of videos, from technology discoveries and AI experiments to gadgets, useful apps, and travel experiences.",
  subscribeHeading: "Enjoying My Content?",
  subscribeDescription:
    "If you enjoy technology, AI, gadgets, apps, and interesting discoveries, subscribe to my YouTube channel and join the journey!",
};

export const CATEGORIES: VideoCategory[] = [
  "All Videos",
  "Technology",
  "AI & Tools",
  "Gadgets",
  "Apps & Software",
  "Tutorials & Reviews",
  "Travel & Lifestyle",
];

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

  if (category !== "All Videos") {
    result = result.filter((v) =>
      v.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }

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

export function getCategoryCounts(videoList: YouTubeVideo[]): Record<VideoCategory, number> {
  const counts: Record<VideoCategory, number> = {
    "All Videos": videoList.length,
    Technology: 0,
    "AI & Tools": 0,
    Gadgets: 0,
    "Apps & Software": 0,
    "Tutorials & Reviews": 0,
    "Travel & Lifestyle": 0,
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
