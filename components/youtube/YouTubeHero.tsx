"use client";

import { motion } from "framer-motion";
import { Sparkles, Play, Video } from "lucide-react";
import { YOUTUBE_CHANNEL } from "@/lib/youtube";
import { YouTubeIcon, InstagramIcon } from "./YouTubeIcons";

export default function YouTubeHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-16">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[500px] w-[800px] rounded-full bg-red-600/10 dark:bg-red-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute right-10 top-1/2 h-[350px] w-[350px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Tag / Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-medium text-red-500 dark:text-red-400 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px]">YouTube Creator Space</span>
            <span className="text-foreground/30">•</span>
            <span className="font-mono text-[11px] text-foreground/70">{YOUTUBE_CHANNEL.handle}</span>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-[clamp(2.25rem,6vw,4.25rem)] font-bold tracking-tight text-foreground leading-[1.08] text-balance">
            {YOUTUBE_CHANNEL.heroHeading}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-foreground/70 leading-relaxed text-pretty">
            {YOUTUBE_CHANNEL.heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            {/* Subscribe on YouTube */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 rounded-xl bg-[#FF0000] px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-300 hover:bg-[#E60000] hover:shadow-xl hover:shadow-red-600/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Subscribe to Jash Garach on YouTube (opens in new tab)"
            >
              <YouTubeIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" />
              <span>Subscribe on YouTube</span>
            </motion.a>

            {/* Follow on Instagram */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={YOUTUBE_CHANNEL.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface/80 backdrop-blur-md px-6 py-3.5 text-sm sm:text-base font-semibold text-foreground transition-all duration-300 hover:border-pink-500/50 hover:bg-surface hover:text-pink-500 dark:hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              aria-label="Follow Jash Garach on Instagram (opens in new tab)"
            >
              <InstagramIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" />
              <span>Follow on Instagram</span>
            </motion.a>
          </div>

          {/* Highlights ticker/badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-8 border-t border-border/60 text-xs sm:text-sm font-mono text-foreground/50">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-accent" />
              <span>25+ Public Videos & Shorts</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>AI, Flutter & Mobile Tech</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-accent" />
              <span>Road Trips & Scenic Vlogs</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
