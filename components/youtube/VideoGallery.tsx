"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, RefreshCw, VideoOff, ChevronDown, X } from "lucide-react";
import {
  type YouTubeVideo,
  type VideoCategory,
  filterVideos,
  getCategoryCounts,
  YOUTUBE_CHANNEL,
} from "@/lib/youtube";
import VideoCard from "./VideoCard";
import CategoryFilter from "./CategoryFilter";

interface VideoGalleryProps {
  initialVideos: YouTubeVideo[];
  selectedCategory: VideoCategory;
  onSelectCategory: (cat: VideoCategory) => void;
}

const PAGE_SIZE = 9;

export default function VideoGallery({
  initialVideos,
  selectedCategory,
  onSelectCategory,
}: VideoGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination whenever category or search query changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, searchQuery]);

  // Compute category counts based on all videos
  const categoryCounts = useMemo(() => {
    return getCategoryCounts(initialVideos);
  }, [initialVideos]);

  // Filter videos based on active category and search query
  const filteredVideos = useMemo(() => {
    return filterVideos(initialVideos, selectedCategory, searchQuery);
  }, [initialVideos, selectedCategory, searchQuery]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleResetFilters = () => {
    onSelectCategory("All Videos");
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  const scrollToTop = () => {
    const el = document.getElementById("video-gallery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="video-gallery"
      className="relative scroll-mt-20 md:scroll-mt-24 py-14 md:py-20"
      aria-label="Video Gallery"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <span className="section-tag">Video Collection</span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
            {YOUTUBE_CHANNEL.galleryHeading}
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-foreground/70 leading-relaxed">
            {YOUTUBE_CHANNEL.galleryDescription}
          </p>
        </div>

        {/* Category Filters & Search */}
        <div className="mb-10">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            categoryCounts={categoryCounts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredCount={filteredVideos.length}
            totalVideosCount={initialVideos.length}
          />
        </div>

        {/* Video Grid or Empty State */}
        {filteredVideos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/30 p-12 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-foreground/40 mb-4">
              <VideoOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No videos found</h3>
            <p className="mt-1 text-sm text-foreground/60 max-w-md">
              {searchQuery ? (
                <>
                  No videos matched &quot;{searchQuery}&quot;
                  {selectedCategory !== "All Videos" && (
                    <> in category &quot;{selectedCategory}&quot;</>
                  )}
                  . Try clearing the search or switching filters.
                </>
              ) : (
                <>
                  No videos found for category &quot;{selectedCategory}&quot;.
                </>
              )}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Search
                </button>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors shadow-sm shadow-red-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {displayedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    activeCategory={selectedCategory}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom Actions: Load More & Back to Top */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/60">
              <div className="text-xs text-foreground/50 font-mono">
                Showing {displayedVideos.length} of {filteredVideos.length} videos
              </div>

              <div className="flex items-center gap-3">
                {hasMore && (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-surface/80 hover:border-foreground/20 transition-all shadow-sm group"
                  >
                    <span>Load More Videos</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-surface transition-colors"
                  aria-label="Back to top of video gallery"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to Top</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
