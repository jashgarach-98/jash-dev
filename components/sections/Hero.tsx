"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

// Animate each word in the headline
const headline = ["Crafting", "digital", "experiences."];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
};

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const subVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 },
  },
};

const actionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 },
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax for the blobs — move slower than scroll
  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const blobYSpring = useSpring(blobY, { stiffness: 80, damping: 25 });

  // Slight upward parallax for headline on scroll
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16 md:px-8 md:pb-24"
      aria-label="Hero section"
    >
      {/* ── Blurred gradient blobs (parallax background) ── */}
      <motion.div
        style={{ y: blobYSpring }}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {/* Primary blob */}
        <div
          className="gradient-blob absolute left-[10%] top-[15%] h-[450px] w-[450px] bg-accent opacity-20"
          style={{ animationDelay: "0s" }}
        />
        {/* Secondary blob */}
        <div
          className="gradient-blob absolute right-[10%] bottom-[15%] h-[350px] w-[350px] opacity-15"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
            animationDelay: "-4s",
          }}
        />
        {/* Subtle center glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.04] blur-[120px]" />
      </motion.div>

      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* ── Main Content ── */}
      <motion.div
        style={{ y: headlineY, opacity: headlineOpacity }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        {/* Sub headline */}
        <motion.p
          variants={subVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-accent font-mono"
        >
          Hello, I am Jash Garach
        </motion.p>

        {/* Main headline — staggered word reveal */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 overflow-hidden text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[1.0] tracking-tight text-balance"
        >
          {headline.map((word, i) => (
            <span
              key={i}
              className="relative mr-[0.25em] inline-block overflow-hidden last:mr-0"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block ${i === 2 ? "text-accent" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Lead text */}
        <motion.p
          variants={subVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mb-10 max-w-2xl text-[1.125rem] leading-relaxed text-foreground/60 text-balance"
          style={{ transitionDelay: "0.1s" }}
        >
          Android depth. Flutter momentum. Product thinking. Building mobile
          products that stay fast, clear, and dependable in the real world.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={actionVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <MagneticButton
            as="a"
            href="#projects"
            className="flex h-12 items-center rounded-full bg-accent px-7 text-sm font-bold text-background transition-opacity hover:opacity-90"
            strength={25}
          >
            Explore Projects
          </MagneticButton>

          <MagneticButton
            as="a"
            href="mailto:garach.jash1@gmail.com"
            className="flex h-12 items-center rounded-full border border-border px-7 text-sm font-medium text-foreground/70 transition-all duration-300 hover:border-accent hover:text-accent"
            strength={20}
          >
            Start a Conversation
          </MagneticButton>

          <MagneticButton
            as="a"
            href="https://www.linkedin.com/in/jash-garach-086759131"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center rounded-full px-6 text-sm font-medium text-foreground/50 transition-colors duration-300 hover:text-foreground"
            strength={15}
          >
            LinkedIn ↗
          </MagneticButton>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {[
            { value: "5+", label: "Years Experience" },
            { value: "8", label: "Published Products" },
            { value: "2", label: "Platforms" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-border bg-surface/50 px-6 py-3 backdrop-blur-sm transition-colors duration-500"
            >
              <span className="text-2xl font-bold text-accent leading-none">
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-foreground/50 font-mono">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Current role badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex justify-center"
        >
          <div className="flex items-center gap-3 rounded-full border border-border bg-surface/60 px-5 py-2.5 backdrop-blur-sm">
            {/* Pulsing green dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-foreground/50 font-mono uppercase tracking-widest">
              Currently
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="text-sm font-semibold text-foreground">
              Android / Flutter Developer
            </span>
            <span className="text-xs text-foreground/40">
              @ Fin Infocom × Grafterr
            </span>
          </div>
        </motion.div>
      </motion.div>


      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-foreground/30"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono">
            Scroll
          </span>
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
