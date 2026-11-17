"use client";

import { useState } from "react";
import type { YouTubeVideo, VideoCategory } from "@/lib/youtube";
import YouTubeHero from "./YouTubeHero";
import ChannelIntroduction from "./ChannelIntroduction";
import VideoGallery from "./VideoGallery";
import SubscribeBanner from "./SubscribeBanner";

interface YouTubePageContentProps {
  initialVideos: YouTubeVideo[];
}

export default function YouTubePageContent({
  initialVideos,
}: YouTubePageContentProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<VideoCategory>("All Videos");

  const handleSelectCategory = (category: VideoCategory) => {
    setSelectedCategory(category);
    const el = document.getElementById("video-gallery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <YouTubeHero />
      <ChannelIntroduction onSelectCategory={handleSelectCategory} />
      <VideoGallery
        initialVideos={initialVideos}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <SubscribeBanner />
    </>
  );
}
