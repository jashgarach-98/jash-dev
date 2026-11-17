import type { Metadata } from "next";
import { getAllVideos } from "@/lib/youtube";
import RedirectToMyContent from "@/components/youtube/RedirectToMyContent";

export const metadata: Metadata = {
  title: "My Content | JASH GARACH",
  description:
    "Explore videos on Artificial Intelligence, mobile apps (Android & Flutter), gadgets, coding tutorials, and travel road trips by Jash Garach.",
};

export default function MyContentHyphenPage() {
  const videos = getAllVideos();
  return <RedirectToMyContent videos={videos} />;
}
