"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Bot,
  Smartphone,
  Layers,
  GraduationCap,
  Compass,
} from "lucide-react";
import { YOUTUBE_CHANNEL, type VideoCategory } from "@/lib/youtube";

interface ChannelIntroductionProps {
  onSelectCategory?: (category: VideoCategory) => void;
}

const CATEGORY_ITEMS = [
  {
    title: "Technology & Innovation",
    filterCategory: "Technology" as VideoCategory,
    description: "Breakthrough tech trends, modern architecture & forward-looking industry shifts.",
    icon: Cpu,
    color: "#00F0FF",
  },
  {
    title: "Artificial Intelligence & AI Tools",
    filterCategory: "AI & Tools" as VideoCategory,
    description: "Claude Fable, agentic coding, LLMs & AI workflows for modern engineers.",
    icon: Bot,
    color: "#E1FF00",
  },
  {
    title: "Gadgets & Smartphones",
    filterCategory: "Gadgets" as VideoCategory,
    description: "Automotive tech, smart devices, everyday hardware & automotive experiences.",
    icon: Smartphone,
    color: "#FF007A",
  },
  {
    title: "Apps & Software",
    filterCategory: "Apps & Software" as VideoCategory,
    description: "Flutter, Android, Jetpack Compose, design tools & developer utilities.",
    icon: Layers,
    color: "#7928CA",
  },
  {
    title: "Tutorials & Reviews",
    filterCategory: "Tutorials & Reviews" as VideoCategory,
    description: "Hands-on UI conversions, AI benchmark tests & practical developer guides.",
    icon: GraduationCap,
    color: "#FF8A00",
  },
  {
    title: "Travel & Lifestyle",
    filterCategory: "Travel & Lifestyle" as VideoCategory,
    description: "Scenic monsoon road trips, Gujarat landmarks, ghat drives & festivals.",
    icon: Compass,
    color: "#00DF72",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ChannelIntroduction({ onSelectCategory }: ChannelIntroductionProps) {
  return (
    <section className="relative py-12 md:py-16 border-t border-border/60 bg-surface/20" aria-label="Channel Topics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
        >
          <span className="section-tag">Channel Focus</span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {YOUTUBE_CHANNEL.aboutTitle}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-foreground/70 leading-relaxed text-pretty">
            {YOUTUBE_CHANNEL.aboutDescription}
          </p>
        </motion.div>

        {/* 6 Category Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => onSelectCategory?.(item.filterCategory)}
                role={onSelectCategory ? "button" : undefined}
                tabIndex={onSelectCategory ? 0 : undefined}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-surface/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:bg-surface/80 hover:shadow-lg cursor-pointer text-left"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
