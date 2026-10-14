"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { Post } from "@/lib/posts";
import { getAssetPath } from "@/lib/posts";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function PostCard({ post }: { post: Post }) {
  return (
    <motion.article
      variants={cardVariants}
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
        <p className="mb-4 flex-1 text-xs md:text-sm leading-relaxed text-foreground/60">
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

export default function BlogGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No posts yet — check back soon.
      </p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2"
    >
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </motion.div>
  );
}
