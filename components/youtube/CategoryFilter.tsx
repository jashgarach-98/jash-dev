"use client";

import { motion } from "framer-motion";
import {
  Film,
  Cpu,
  Bot,
  Smartphone,
  Layers,
  GraduationCap,
  Compass,
  Search,
  X,
} from "lucide-react";
import { CATEGORIES, type VideoCategory } from "@/lib/youtube";

interface CategoryFilterProps {
  selectedCategory: VideoCategory;
  onSelectCategory: (cat: VideoCategory) => void;
  categoryCounts: Record<VideoCategory, number>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORY_ICON_MAP: Record<VideoCategory, any> = {
  "All Videos": Film,
  Technology: Cpu,
  "AI & Tools": Bot,
  Gadgets: Smartphone,
  "Apps & Software": Layers,
  "Tutorials & Reviews": GraduationCap,
  "Travel & Lifestyle": Compass,
};

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  searchQuery,
  onSearchChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search videos by title, topic, or keyword..."
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            aria-label="Search videos"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-foreground/50 font-mono self-end sm:self-center">
          Showing {categoryCounts[selectedCategory] || 0} {categoryCounts[selectedCategory] === 1 ? "video" : "videos"}
        </div>
      </div>

      {/* Horizontally scrollable chip filter */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar snap-x">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICON_MAP[category] || Film;
            const isActive = selectedCategory === category;
            const count = categoryCounts[category] ?? 0;

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`group relative shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer snap-start ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-foreground/60 hover:text-foreground hover:bg-surface/60"
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeYouTubeFilterTab"
                    className="absolute inset-0 rounded-full border border-red-500/40 bg-red-500/10 backdrop-blur-sm dark:bg-red-500/15"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    size={14}
                    className={
                      isActive
                        ? "text-red-500 dark:text-red-400"
                        : "text-foreground/40 group-hover:text-foreground/70"
                    }
                  />
                  <span>{category}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-mono transition-colors ${
                      isActive
                        ? "bg-red-500/20 text-red-600 dark:text-red-300 font-semibold"
                        : "bg-surface/80 text-foreground/50 border border-border"
                    }`}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
