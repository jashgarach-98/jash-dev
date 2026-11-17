"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import YouTubePageContent from "./YouTubePageContent";
import type { YouTubeVideo } from "@/lib/youtube";

export default function RedirectToMyContent({
  videos,
}: {
  videos: YouTubeVideo[];
}) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mycontent");
  }, [router]);

  return <YouTubePageContent initialVideos={videos} />;
}
