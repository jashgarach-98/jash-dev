"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";

interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  badge?: string;
  isCurrent?: boolean;
  points: string[];
}

const experiences: ExperienceItem[] = [
  {
    period: "Jan 2026 – Present",
    role: "Android / Flutter Developer",
    company: "Fin Infocom × Grafterr",
    location: "Hyderabad",
    badge: "Current Role",
    isCurrent: true,
    points: [
      "Develop and maintain Android and Flutter applications with a focus on performance and quality.",
      "Collaborate across teams to design, test, debug, and deliver new mobile features confidently.",
    ],
  },
  {
    period: "Sep 2024 – Dec 2025",
    role: "Android Developer",
    company: "Fin Infocom × Grafterr",
    location: "Hyderabad",
    points: [
      "Built and maintained Android applications following best practices for structure and reliability.",
      "Worked with cross-functional teams to ship features and strengthen app functionality through debugging.",
    ],
  },
  {
    period: "Jun 2023 – Jul 2024",
    role: "Android Developer (Team Lead)",
    company: "Grow Solutions",
    location: "Surat",
    badge: "Leadership",
    points: [
      "Led Android delivery while mentoring junior developers and keeping work aligned with timelines.",
      "Supported problem solving, feature planning, and day-to-day team execution for mobile releases.",
    ],
  },
  {
    period: "Jun 2021 – May 2023",
    role: "Android Developer",
    company: "Grow Solutions",
    location: "Surat",
    points: [
      "Built Android applications using coding standards, debugging discipline, and ongoing performance improvements.",
      "Collaborated with designers and developers to create intuitive interfaces and adopt new technologies effectively.",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden px-4 py-14 md:px-8 md:py-20 lg:py-24"
      aria-label="Work experience"
    >
      {/* Background blob */}
      <motion.div
        style={{ y: blobY }}
        className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent opacity-[0.05] blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <span className="section-tag">Experience</span>
          <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
            A steady progression from Android implementation to product
            ownership and Flutter delivery.
          </h2>
          <p className="mt-3.5 max-w-2xl text-sm md:text-base text-foreground/60 leading-relaxed">
            5+ years expanding from core Android delivery into team leadership
            and cross-platform Flutter work.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border md:left-6" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-0"
          >
            {experiences.map((exp, index) => (
              <motion.article
                key={index}
                variants={itemVariants}
                className="relative pl-7 pb-6 md:pl-16 md:pb-8 last:pb-0"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-[6.5px] top-1.5 h-3 w-3 rounded-full border-2 md:left-[18.5px] transition-colors duration-500 ${
                    exp.isCurrent
                      ? "border-accent bg-accent"
                      : "border-border bg-background"
                  }`}
                >
                  {/* Pulsing ring for current role */}
                  {exp.isCurrent && (
                    <span className="absolute -inset-1 animate-ping rounded-full bg-accent opacity-30" />
                  )}
                </div>

                {/* Card */}
                <div
                  className={`group rounded-2xl border p-4 sm:p-5 md:p-6 transition-all duration-300 hover:border-accent/40 hover:bg-accent/[0.03] ${
                    exp.isCurrent
                      ? "border-accent/30 bg-accent/[0.04]"
                      : "border-border bg-surface/30"
                  }`}
                >
                  {/* Top row */}
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        {exp.isCurrent && (
                          <span className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background opacity-60" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-background" />
                            </span>
                            {exp.badge}
                          </span>
                        )}
                        {exp.badge && !exp.isCurrent && (
                          <span className="rounded-full border border-accent/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">
                            {exp.badge}
                          </span>
                        )}
                      </div>

                      {/* Role */}
                      <h3 className="text-base sm:text-lg font-bold leading-tight md:text-xl">
                        {exp.role}
                      </h3>

                      {/* Company + Location */}
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-0.5">
                        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/70">
                          <Briefcase size={13} className="text-accent shrink-0" />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs sm:text-sm text-foreground/50">
                          <MapPin size={13} className="shrink-0" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Period */}
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-2.5 py-1 text-xs font-mono text-foreground/50 shrink-0">
                      <Calendar size={11} className="shrink-0" />
                      {exp.period}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-3 h-px bg-border" />

                  {/* Bullet points */}
                  <ul className="flex flex-col gap-2">
                    {exp.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/60 leading-relaxed">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent opacity-70" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Total experience summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 md:mt-12 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-border bg-surface/40 px-5 py-4 md:px-7 md:py-4.5 backdrop-blur-sm"
        >
          <div className="flex flex-wrap gap-6 sm:gap-8">
            {[
              { label: "Total Experience", value: "5+ Years" },
              { label: "Companies", value: "2" },
              { label: "Roles", value: "4" },
              { label: "Cities", value: "Surat & Hyderabad" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-base sm:text-lg font-bold text-accent">{item.value}</p>
                <p className="text-xs text-foreground/50 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <a
            href="https://www.linkedin.com/in/jash-garach-086759131"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-foreground/60 transition-all duration-300 hover:border-accent hover:text-accent"
          >
            Full Profile on LinkedIn ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
