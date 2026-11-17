import type { Metadata } from "next";
import { getAllVideos } from "@/lib/youtube";
import YouTubePageContent from "@/components/youtube/YouTubePageContent";

export const metadata: Metadata = {
  title: "My Content | JASH GARACH",
  description:
    "Explore videos on Artificial Intelligence, mobile apps (Android & Flutter), gadgets, coding tutorials, and travel road trips by Jash Garach.",
  openGraph: {
    type: "website",
    title: "My Content | JASH GARACH",
    description:
      "Explore videos on Artificial Intelligence, mobile apps (Android & Flutter), gadgets, coding tutorials, and travel road trips by Jash Garach.",
    url: "https://www.youtube.com/@JASHGARACH",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Content | JASH GARACH",
    description:
      "Explore videos on Artificial Intelligence, mobile apps (Android & Flutter), gadgets, coding tutorials, and travel road trips by Jash Garach.",
  },
};

export default function MyContentPage() {
  const videos = getAllVideos();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <YouTubePageContent initialVideos={videos} />
    </div>
  );
}
