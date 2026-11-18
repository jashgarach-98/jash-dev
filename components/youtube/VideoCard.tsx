"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Play, Eye } from "lucide-react";
import {
  type YouTubeVideo,
  type VideoCategory,
  getCategoryColor,
} from "@/lib/youtube";
import VideoDescription from "./VideoDescription";
import { YouTubeIcon } from "./YouTubeIcons";

interface VideoCardProps {
  video: YouTubeVideo;
  activeCategory?: VideoCategory;
}

export default function VideoCard({ video, activeCategory }: VideoCardProps) {
  const [imgSrc, setImgSrc] = useState(video.thumbnailUrl);
  const [isHovered, setIsHovered] = useState(false);

  // If a specific category filter is active and this video matches it, highlight that category
  const matchingCategory =
    activeCategory &&
    activeCategory !== "All Videos" &&
    video.categories.some(
      (c) => c.toLowerCase() === activeCategory.toLowerCase()
    )
      ? activeCategory
      : video.primaryCategory;

  const accentColor = getCategoryColor(matchingCategory);

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/5"
    >
      {/* Top accent line on hover */}
      <motion.div
        animate={{ scaleX: isHovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-red-600 via-accent to-red-500 z-20"
      />

      {/* Thumbnail Container (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={video.title}
          loading="lazy"
          onError={() => {
            if (imgSrc !== video.fallbackThumbnailUrl) {
              setImgSrc(video.fallbackThumbnailUrl);
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Play Button Overlay */}
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center focus:outline-none"
          aria-label={`Play video: ${video.title} on YouTube`}
        >
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg shadow-black/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600 group-hover:shadow-red-600/40">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white translate-x-0.5" />
          </div>
        </a>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium backdrop-blur-md shadow-sm transition-colors duration-300"
            style={{
              backgroundColor: "rgba(0,0,0,0.72)",
              color: accentColor,
              border: `1px solid ${accentColor}60`,
            }}
          >
            {matchingCategory}
          </span>

          {video.isShort && (
            <span className="inline-flex items-center rounded-full bg-red-600/95 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
              Short
            </span>
          )}
        </div>

        {/* Bottom Metadata bar on thumbnail */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/80 pointer-events-none">
          <span className="flex items-center gap-1 drop-shadow-sm">
            <Calendar className="w-3 h-3 text-white/70" />
            {video.publishedLabel}
          </span>
          {video.viewCount && parseInt(video.viewCount, 10) > 0 && (
            <span className="flex items-center gap-1 drop-shadow-sm">
              <Eye className="w-3 h-3 text-white/70" />
              {parseInt(video.viewCount, 10).toLocaleString()} views
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* All applicable Categories Chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {video.categories.map((cat) => {
            const isSelected =
              activeCategory !== "All Videos" &&
              cat.toLowerCase() === activeCategory?.toLowerCase();
            const chipColor = getCategoryColor(cat);

            return (
              <span
                key={cat}
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono transition-all duration-200 ${
                  isSelected
                    ? "font-semibold shadow-sm"
                    : "text-foreground/60 bg-surface/80 border border-border"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${chipColor}18`,
                        color: chipColor,
                        border: `1px solid ${chipColor}50`,
                      }
                    : undefined
                }
              >
                {cat}
              </span>
            );
          })}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200 line-clamp-2 mb-2.5">
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none"
          >
            {video.title}
          </a>
        </h3>

        {/* Video Description with Read More / Show Less */}
        <div className="mb-4 flex-1">
          <VideoDescription description={video.description} charLimit={130} />
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
            {video.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-mono text-foreground/50 border border-border"
              >
                #{tag.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        )}

        {/* Action Button: Watch on YouTube */}
        <div className="pt-2">
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-surface hover:bg-red-600 hover:text-white border border-border hover:border-red-600/50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all duration-300 shadow-sm group/btn"
          >
            <YouTubeIcon
              className="w-4 h-4 text-red-500 group-hover/btn:text-white transition-colors"
              fill="currentColor"
            />
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100 transition-opacity ml-auto" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
