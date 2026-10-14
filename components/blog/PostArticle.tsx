"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Quote,
} from "lucide-react";
import type { Post, PostBlock } from "@/lib/posts";
import { getAssetPath } from "@/lib/posts";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-[15px] md:text-base leading-relaxed text-foreground/70">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2 className="pt-4 text-xl md:text-2xl font-bold tracking-tight text-balance">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[15px] md:text-base leading-relaxed text-foreground/70"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--accent)" }}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="relative rounded-2xl border border-border bg-surface/40 p-5 md:p-6">
          <Quote
            size={18}
            className="mb-2 text-accent"
            aria-hidden="true"
          />
          <p className="text-base md:text-lg font-medium leading-relaxed text-foreground/90">
            {block.text}
          </p>
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-2xl border border-border bg-surface/60 p-4 md:p-5 text-sm leading-relaxed">
          <code className="font-mono text-foreground/85">{block.code}</code>
        </pre>
      );
    case "image":
      return (
        <figure className="my-6 space-y-2.5">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-md transition-all duration-300 hover:border-accent/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getAssetPath(block.src)}
              alt={block.alt}
              className="w-full h-auto object-cover max-h-[520px]"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-xs md:text-sm text-foreground/50 font-mono">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

export default function PostArticle({ post }: { post: Post }) {
  return (
    <article className="relative overflow-hidden px-4 py-14 md:px-8 md:py-20 lg:py-24">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full blur-[120px] opacity-[0.08]"
        style={{ background: post.accent }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            All posts
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 mb-8 md:mb-10"
        >
          <span className="section-tag">{post.category}</span>
          <h1 className="mt-3 text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-tight text-balance">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/50 font-mono">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} />
              {post.publishedLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {post.readingTime}
            </span>
          </div>
        </motion.header>

        {/* Cover image */}
        {post.coverImage && (
          <motion.figure
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="mb-10 md:mb-12 space-y-2.5"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/50 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getAssetPath(post.coverImage.src)}
                alt={post.coverImage.alt}
                className="w-full h-auto object-cover max-h-[460px]"
              />
            </div>
            {post.coverImage.caption && (
              <figcaption className="text-center text-xs md:text-sm text-foreground/50 font-mono">
                {post.coverImage.caption}
              </figcaption>
            )}
          </motion.figure>
        )}

        {/* Body */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="space-y-5 md:space-y-6"
        >
          {post.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </motion.div>

        {/* References */}
        {post.references && post.references.length > 0 && (
          <motion.footer
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="mt-10 border-t border-border pt-6"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-foreground/40 font-mono">
              Further reading
            </p>
            <ul className="space-y-2">
              {post.references.map((ref) => (
                <li key={ref.href}>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors duration-300"
                  >
                    {ref.label}
                    <ArrowUpRight size={14} className="text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.footer>
        )}
      </div>
    </article>
  );
}
