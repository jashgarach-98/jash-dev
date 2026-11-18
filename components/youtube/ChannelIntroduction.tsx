"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Smartphone,
  Compass,
  Car,
  Sparkles,
} from "lucide-react";
import {
  YOUTUBE_CHANNEL,
  type VideoCategory,
  getCategoryColor,
} from "@/lib/youtube";

interface ChannelIntroductionProps {
  onSelectCategory?: (category: VideoCategory) => void;
}

const CATEGORY_ITEMS: {
  title: string;
  filterCategory: VideoCategory;
  description: string;
  icon: any;
}[] = [
  {
    title: "Artificial Intelligence & Tech",
    filterCategory: "AI & Tech",
    description: "Claude Fable, agentic AI workflows, LLM benchmarks & technology discoveries.",
    icon: Bot,
  },
  {
    title: "Mobile Apps & Coding",
    filterCategory: "Mobile & Coding",
    description: "Android, Flutter, Figma-to-code conversions & developer productivity guides.",
    icon: Smartphone,
  },
  {
    title: "Road Trips & Travel Vlogs",
    filterCategory: "Road Trips & Travel",
    description: "Statue of Unity, Saputara mountain ghats, coastal escapes & scenic drives.",
    icon: Compass,
  },
  {
    title: "Cars & Automotive",
    filterCategory: "Cars & Automotive",
    description: "Kia Seltos road trips, airline interior setups, highway drives & car milestones.",
    icon: Car,
  },
  {
    title: "Lifestyle & Events",
    filterCategory: "Lifestyle & Events",
    description: "Festivals, Diwali decorations, live music concerts & memorable life stories.",
    icon: Sparkles,
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

        {/* 5 Distinct Topic Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const color = getCategoryColor(item.filterCategory);

            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => onSelectCategory?.(item.filterCategory)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCategory?.(item.filterCategory);
                  }
                }}
                role={onSelectCategory ? "button" : undefined}
                tabIndex={onSelectCategory ? 0 : undefined}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-surface/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:bg-surface/80 hover:shadow-lg cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    border: `1px solid ${color}35`,
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
