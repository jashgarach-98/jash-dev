"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const techStack = [
  "Kotlin",
  "Flutter",
  "Dart",
  "Jetpack Compose",
  "Android SDK",
  "Java",
  "Coroutines & Flow",
  "MVVM & MVI",
  "Clean Architecture",
  "Dagger 2 & Hilt",
  "Koin",
  "Bloc & Provider",
  "Room Database",
  "SQLite",
  "Hive",
  "Realm",
  "WorkManager",
  "Foreground Services",
  "Jetpack Navigation",
  "Retrofit & REST APIs",
  "GraphQL",
  "Firebase Suite",
  "Kiosk & POS Integrations",
  "Payment Gateways",
  "Bluetooth & Thermal Printers",
  "JUnit & Mockito",
  "CI/CD Pipelines",
  "Git & GitHub",
  "Jira & Agile",
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const strengths = ["Punctual", "Accountable", "Honest", "Self-confident", "Collaborative"];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Image parallax — scales slightly and drifts up as section scrolls
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.97]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const imageYSpring = useSpring(imageY, { stiffness: 80, damping: 25 });

  // Background blob parallax
  const blobY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32"
      aria-label="About Jash Garach"
    >
      {/* Background blob */}
      <motion.div
        style={{ y: blobY }}
        className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-accent opacity-[0.06] blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16 md:mb-24"
        >
          <motion.span variants={fadeUpVariants} className="section-tag">
            About me
          </motion.span>
          <motion.h2
            variants={fadeUpVariants}
            className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance"
          >
            Calm execution, practical architecture, and thoughtful mobile
            experiences.
          </motion.h2>
        </motion.div>

        {/* Split layout */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-20 lg:gap-28 items-start">
          {/* Left — Image with parallax */}
          <motion.div
            ref={imageRef}
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="relative"
          >
            <motion.div
              style={{ scale: imageScale, y: imageYSpring }}
              className="relative aspect-[3/4] overflow-hidden rounded-3xl"
            >
              {/* Decorative accent corner */}
              <div className="absolute -left-3 -top-3 h-24 w-24 rounded-2xl border-2 border-accent opacity-40 z-10" />
              <div className="absolute -right-3 -bottom-3 h-16 w-16 rounded-xl bg-accent opacity-20 z-10" />

              <Image
                src="/assets/profile.jpg"
                alt="Portrait of Jash Garach — Android & Flutter Developer"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 90vw, 45vw"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md">
                <p className="text-xs text-foreground/50 uppercase tracking-widest font-mono mb-1">
                  Currently
                </p>
                <p className="font-semibold text-sm">
                  Android / Flutter Developer
                </p>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Fin Infocom × Grafterr, Hyderabad
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Bio */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-8"
          >
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <h3 className="text-2xl font-bold">
                I enjoy turning complexity into clarity.
              </h3>
              <p className="text-foreground/60 leading-relaxed">
                From messaging and custom keyboard products to restaurant
                operations and self-checkout flows, I build mobile experiences
                where performance, reliability, and intuitive UX matter just as
                much as shipping features.
              </p>
              <p className="text-foreground/60 leading-relaxed">
                My strongest work lives at the intersection of engineering
                discipline and user empathy: designing maintainable app
                structures, debugging edge cases, improving flow under pressure,
                and helping teams deliver with confidence.
              </p>
            </motion.div>

            {/* Working style */}
            <motion.div variants={fadeUpVariants}>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-foreground/40 font-mono">
                Working style
              </p>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-3 py-1 text-sm text-foreground/70 transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur-sm"
            >
              {[
                { label: "Years of experience", value: "5+" },
                { label: "Published products", value: "8" },
                { label: "Education", value: "B.Tech CE" },
                { label: "Platforms", value: "Android + Flutter" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-lg font-bold text-accent">{item.value}</p>
                  <p className="text-xs text-foreground/50">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Interactive Tech Stack Slider ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 md:mt-32"
        >
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 font-mono">
                Tech Stack & Ecosystem
              </p>
              <p className="text-sm text-foreground/60 mt-1">
                Scroll or swipe horizontally to explore specialized skills
              </p>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSlider("left")}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/50 text-foreground/70 transition-all hover:border-accent hover:text-accent hover:bg-accent/10 active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider("right")}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/50 text-foreground/70 transition-all hover:border-accent hover:text-accent hover:bg-accent/10 active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Fade masks for edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

            {/* Scrollable Container */}
            <div
              ref={sliderRef}
              className="flex gap-3 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing touch-pan-x"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {techStack.map((tech, i) => (
                <div
                  key={`${tech}-${i}`}
                  className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-surface/40 px-5 py-3.5 text-sm font-medium text-foreground/70 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-foreground hover:bg-surface/70 hover:scale-[1.02] shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-accent/80 shadow-[0_0_8px_var(--accent)]" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
