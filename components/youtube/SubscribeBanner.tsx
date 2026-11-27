"use client";

import { motion } from "framer-motion";
import { YOUTUBE_CHANNEL } from "@/lib/youtube";
import { YouTubeIcon, InstagramIcon } from "./YouTubeIcons";

export default function SubscribeBanner() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden" aria-label="Subscribe Banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-surface/90 via-surface/60 to-surface/90 p-8 sm:p-12 md:p-16 text-center backdrop-blur-xl shadow-2xl"
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-red-600/15 blur-[120px]" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-[250px] w-[250px] rounded-full bg-accent/10 blur-[90px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Tag */}
            <span className="inline-block rounded-full bg-red-500/10 border border-red-500/20 px-3.5 py-1 text-xs font-mono font-medium text-red-500 dark:text-red-400 mb-4">
              JOIN THE COMMUNITY
            </span>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              {YOUTUBE_CHANNEL.subscribeHeading}
            </h2>

            {/* Description */}
            <p className="mt-4 text-base sm:text-lg text-foreground/70 leading-relaxed text-pretty">
              {YOUTUBE_CHANNEL.subscribeDescription}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#FF0000] px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-red-600/25 transition-all duration-300 hover:bg-[#E60000] hover:shadow-xl hover:shadow-red-600/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Subscribe to Jash Garach on YouTube (opens in new tab)"
              >
                <YouTubeIcon className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" />
                <span>Subscribe to YouTube</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={YOUTUBE_CHANNEL.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-surface/80 backdrop-blur-md px-6 py-3.5 text-sm sm:text-base font-semibold text-foreground transition-all duration-300 hover:border-pink-500/50 hover:text-pink-500 dark:hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="Follow Jash Garach on Instagram (opens in new tab)"
              >
                <InstagramIcon className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" />
                <span>Follow on Instagram</span>
              </motion.a>
            </div>

            {/* Channel handle info */}
            <div className="mt-8 text-xs font-mono text-foreground/40">
              @JASHGARACH on YouTube • @jashgarach.ai on Instagram
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
