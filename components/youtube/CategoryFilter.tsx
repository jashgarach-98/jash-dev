"use client";

import { motion } from "framer-motion";
import {
  Film,
  Bot,
  Smartphone,
  Compass,
  Car,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  type VideoCategory,
  getCategoryColor,
} from "@/lib/youtube";

interface CategoryFilterProps {
  selectedCategory: VideoCategory;
  onSelectCategory: (cat: VideoCategory) => void;
  categoryCounts: Record<VideoCategory, number>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredCount: number;
  totalVideosCount: number;
}

const CATEGORY_ICON_MAP: Record<VideoCategory, any> = {
  "All Videos": Film,
  "AI & Tech": Bot,
  "Mobile & Coding": Smartphone,
  "Road Trips & Travel": Compass,
  "Cars & Automotive": Car,
  "Lifestyle & Events": Sparkles,
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  searchQuery,
  onSearchChange,
  filteredCount,
  totalVideosCount,
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      {/* Top Bar: Search Input + Live Match Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search videos by title, topic, or keyword..."
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            aria-label="Search videos"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Filter Counter */}
        <div className="text-xs text-foreground/60 font-mono self-end sm:self-center">
          {searchQuery ? (
            <span>
              Found <span className="font-semibold text-foreground">{filteredCount}</span>{" "}
              {filteredCount === 1 ? "video" : "videos"}
            </span>
          ) : selectedCategory !== "All Videos" ? (
            <span>
              Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
              {totalVideosCount} videos
            </span>
          ) : (
            <span>
              Showing all <span className="font-semibold text-foreground">{totalVideosCount}</span> videos
            </span>
          )}
        </div>
      </div>

      {/* Clean Category Chips (wrapped, no ugly horizontal scrollbar) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICON_MAP[category] || Film;
          const isActive = selectedCategory === category;
          const count = categoryCounts[category] ?? 0;
          const accent = getCategoryColor(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-foreground font-semibold shadow-xs"
                  : "text-foreground/60 hover:text-foreground hover:bg-surface/80 border border-border/80"
              }`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeYouTubeFilterTab"
                  className="absolute inset-0 rounded-full backdrop-blur-sm"
                  style={{
                    backgroundColor: `${accent}15`,
                    border: `1.5px solid ${accent}60`,
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon
                  size={14}
                  style={isActive ? { color: accent } : undefined}
                  className={
                    isActive
                      ? ""
                      : "text-foreground/40 group-hover:text-foreground/70 transition-colors"
                  }
                />
                <span>{category}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-mono transition-colors ${
                    isActive
                      ? "font-semibold shadow-xs"
                      : "bg-surface text-foreground/50 border border-border"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${accent}25`,
                          color: accent,
                        }
                      : undefined
                  }
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
