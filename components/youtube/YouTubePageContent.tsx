"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type YouTubeVideo,
  type VideoCategory,
  CATEGORIES,
} from "@/lib/youtube";
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

  // Sync initial category from URL query parameters (e.g. ?category=Technology)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        const matched = CATEGORIES.find(
          (c) => c.toLowerCase() === catParam.toLowerCase()
        );
        if (matched) {
          setSelectedCategory(matched);
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Update URL search param when category changes without full navigation
  const updateUrlCategory = useCallback((category: VideoCategory) => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      if (category === "All Videos") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", category);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {
      // Ignore state replacement errors
    }
  }, []);

  const handleCategorySelectFromIntro = (category: VideoCategory) => {
    setSelectedCategory(category);
    updateUrlCategory(category);
    const el = document.getElementById("video-gallery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryChange = (category: VideoCategory) => {
    setSelectedCategory(category);
    updateUrlCategory(category);
  };

  return (
    <>
      <YouTubeHero />
      <ChannelIntroduction onSelectCategory={handleCategorySelectFromIntro} />
      <VideoGallery
        initialVideos={initialVideos}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      <SubscribeBanner />
    </>
  );
}
