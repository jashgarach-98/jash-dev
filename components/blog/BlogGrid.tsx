"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  type LucideIcon,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Search,
  X,
  BookOpen,
  Smartphone,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  Radio,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import type { Post } from "@/lib/posts";
import { getAssetPath } from "@/lib/posts";

export type BlogTopic =
  | "All Posts"
  | "Android"
  | "Flutter"
  | "Architecture"
  | "Performance"
  | "Testing & CI/CD"
  | "Hardware & POS";

interface TopicOption {
  id: BlogTopic;
  label: string;
  icon: LucideIcon;
}

const TOPICS: TopicOption[] = [
  { id: "All Posts", label: "All Posts", icon: BookOpen },
  { id: "Android", label: "Android", icon: Smartphone },
  { id: "Flutter", label: "Flutter", icon: Layers },
  { id: "Architecture", label: "Architecture", icon: Cpu },
  { id: "Performance", label: "Performance", icon: Zap },
  { id: "Testing & CI/CD", label: "Testing & CI/CD", icon: CheckCircle2 },
  { id: "Hardware & POS", label: "Hardware & POS", icon: Radio },
];

function matchesTopic(post: Post, topic: BlogTopic): boolean {
  if (topic === "All Posts") return true;
  const str = `${post.category} ${post.tags.join(" ")} ${post.title} ${post.description}`.toLowerCase();
  switch (topic) {
    case "Android":
      return str.includes("android") || str.includes("kotlin") || str.includes("compose");
    case "Flutter":
      return str.includes("flutter") || str.includes("dart");
    case "Architecture":
      return (
        str.includes("architecture") ||
        str.includes("modular") ||
        str.includes("clean")
      );
    case "Performance":
      return (
        str.includes("performance") ||
        str.includes("profiling") ||
        str.includes("leak") ||
        str.includes("memory") ||
        str.includes("drops")
      );
    case "Testing & CI/CD":
      return (
        str.includes("testing") ||
        str.includes("ci/cd") ||
        str.includes("maestro") ||
        str.includes("regression")
      );
    case "Hardware & POS":
      return (
        str.includes("pos") ||
        str.includes("hardware") ||
        str.includes("kiosk") ||
        str.includes("thermal") ||
        str.includes("bluetooth") ||
        str.includes("ble")
      );
    default:
      return true;
  }
}

function filterPosts(posts: Post[], topic: BlogTopic, query: string): Post[] {
  let result = posts;
  if (topic !== "All Posts") {
    result = result.filter((p) => matchesTopic(p, topic));
  }
  const q = query.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return result;
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface/40 backdrop-blur-sm transition-colors duration-500 hover:border-[var(--post-color)]"
      style={{ "--post-color": post.accent } as React.CSSProperties}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 z-10"
        style={{ background: post.accent }}
      />

      {post.coverImage && (
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-surface/80 border-b border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAssetPath(post.coverImage.src)}
            alt={post.coverImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-1 flex-col p-5 md:p-6 lg:p-7"
        aria-label={`Read: ${post.title}`}
      >
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.15em] text-foreground/40 font-mono">
              {post.category}
            </p>
            <h3 className="text-lg font-bold leading-tight md:text-xl lg:text-2xl">
              {post.title}
            </h3>
          </div>

          <div className="mt-1 shrink-0 text-foreground/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Excerpt */}
        <p className="mb-4 flex-1 text-xs md:text-sm leading-relaxed text-foreground/60 line-clamp-3">
          {post.description}
        </p>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground/40 font-mono">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            {post.publishedLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {post.readingTime}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 border-t border-border pt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium border border-border text-foreground/50 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}

const PAGE_SIZE = 10;

export default function BlogGrid({ posts }: { posts: Post[] }) {
  const [selectedTopic, setSelectedTopic] = useState<BlogTopic>("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedTopic, searchQuery]);

  // Topic counts calculation
  const topicCounts = useMemo(() => {
    const counts: Record<BlogTopic, number> = {
      "All Posts": posts.length,
      Android: 0,
      Flutter: 0,
      Architecture: 0,
      Performance: 0,
      "Testing & CI/CD": 0,
      "Hardware & POS": 0,
    };
    for (const post of posts) {
      for (const t of TOPICS) {
        if (t.id !== "All Posts" && matchesTopic(post, t.id)) {
          counts[t.id]++;
        }
      }
    }
    return counts;
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return filterPosts(posts, selectedTopic, searchQuery);
  }, [posts, selectedTopic, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleResetFilters = () => {
    setSelectedTopic("All Posts");
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  if (posts.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No posts yet — check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar & Category Filter */}
      <div className="space-y-4">
        {/* Search row with live count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title, tag, or topic..."
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              aria-label="Search blog posts"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-foreground/60 font-mono self-end sm:self-center">
            {searchQuery ? (
              <span>
                Found{" "}
                <span className="font-semibold text-foreground">
                  {filteredPosts.length}
                </span>{" "}
                {filteredPosts.length === 1 ? "post" : "posts"}
              </span>
            ) : selectedTopic !== "All Posts" ? (
              <span>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredPosts.length}
                </span>{" "}
                of {posts.length} posts
              </span>
            ) : (
              <span>
                Showing all{" "}
                <span className="font-semibold text-foreground">
                  {posts.length}
                </span>{" "}
                posts
              </span>
            )}
          </div>
        </div>

        {/* Topic filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isActive = selectedTopic === topic.id;
            const count = topicCounts[topic.id];

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-accent/15 text-accent border border-accent/40 shadow-sm"
                    : "bg-surface/50 text-foreground/60 hover:text-foreground hover:bg-surface border border-border"
                }`}
              >
                <Icon
                  size={13}
                  className={
                    isActive
                      ? "text-accent"
                      : "text-foreground/40 group-hover:text-foreground/70"
                  }
                />
                <span>{topic.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-accent/20 text-accent font-semibold"
                      : "bg-foreground/5 text-foreground/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts Grid or Empty State */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/30 p-12 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-foreground/40 mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No articles found
          </h3>
          <p className="mt-1 text-sm text-foreground/60 max-w-md">
            {searchQuery ? (
              <>
                No posts matched &quot;{searchQuery}&quot;
                {selectedTopic !== "All Posts" && (
                  <> in &quot;{selectedTopic}&quot;</>
                )}
                . Try checking your keywords or reset filters.
              </>
            ) : (
              <>No posts found for category &quot;{selectedTopic}&quot;.</>
            )}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {displayedPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex flex-col items-center justify-center pt-6">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/70 px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:bg-surface hover:text-accent transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>
                  Load More Posts ({filteredPosts.length - visibleCount} remaining)
                </span>
                <ChevronDown className="w-4 h-4 text-foreground/50 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-accent" />
              </button>
              <p className="mt-2 text-xs text-foreground/40 font-mono">
                Showing {displayedPosts.length} of {filteredPosts.length} posts
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
