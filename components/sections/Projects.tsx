"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Building2,
  Layers,
} from "lucide-react";
import { projects, type Project, type ProjectCategory } from "@/lib/projects";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const isPersonal = project.category === "personal";

  return (
    <motion.article
      layout
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface/40 backdrop-blur-sm transition-colors duration-500 hover:border-[var(--project-color)] ${
        project.wide ? "md:col-span-2" : ""
      }`}
      style={{ "--project-color": project.color } as React.CSSProperties}
    >
      {/* Color accent top bar */}
      <motion.div
        animate={{ scaleX: isHovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left"
        style={{ background: project.color }}
      />

      <div className="flex flex-1 flex-col p-5 md:p-6 lg:p-7">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-foreground/40 font-mono">
                {project.kind}
              </span>
              <span className="text-foreground/20 text-xs">•</span>
              {isPersonal ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
                  <Sparkles size={11} className="stroke-[2.2]" />
                  Personal Project
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-amber-400 border border-amber-500/20">
                  <Building2 size={11} className="stroke-[2.2]" />
                  Fininfocom / Grafterr
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold leading-tight md:text-xl lg:text-2xl">
              {project.title}
            </h3>
          </div>

          {/* Animated arrow */}
          <motion.div
            animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-1 shrink-0 text-foreground/30 group-hover:text-accent"
            style={{ color: isHovered ? project.color : undefined }}
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        {/* Description */}
        <p className="mb-4 flex-1 text-xs md:text-sm leading-relaxed text-foreground/60">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium border border-border text-foreground/50 transition-colors duration-300"
              style={{
                background: isHovered ? `${project.color}14` : undefined,
                borderColor: isHovered ? `${project.color}40` : undefined,
                color: isHovered ? project.color : undefined,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/60 transition-colors duration-300 hover:text-foreground"
              style={{ color: isHovered ? project.color : undefined }}
            >
              <ExternalLink size={13} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");

  const personalProjects = projects.filter((p) => p.category === "personal");
  const fininfocomProjects = projects.filter(
    (p) => p.category === "fininfocom"
  );

  const filterTabs = [
    {
      id: "all" as const,
      label: "All Projects",
      count: projects.length,
      icon: Layers,
    },
    {
      id: "personal" as const,
      label: "Personal Projects",
      count: personalProjects.length,
      icon: Sparkles,
    },
    {
      id: "fininfocom" as const,
      label: "Fininfocom / Grafterr",
      count: fininfocomProjects.length,
      icon: Building2,
    },
  ];

  return (
    <section
      id="projects"
      className="relative overflow-hidden px-4 py-14 md:px-8 md:py-20 lg:py-24"
      aria-label="Projects"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent opacity-[0.04] blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12"
        >
          <span className="section-tag">Selected Work</span>
          <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
            Flutter and Android apps built for enterprise and real-world operations.
          </h2>
          <p className="mt-3.5 max-w-2xl text-sm md:text-base text-foreground/60 leading-relaxed">
            A portfolio featuring independent personal applications alongside
            commercial POS, kiosk, and operations platforms engineered for
            Fininfocom and Grafterr.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/60 hover:text-foreground hover:bg-surface/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProjectFilterTab"
                      className="absolute inset-0 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-sm"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon
                      size={14}
                      className={
                        isActive ? "text-accent" : "text-foreground/40 group-hover:text-foreground/70"
                      }
                    />
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-mono transition-colors ${
                        isActive
                          ? "bg-accent/20 text-accent font-semibold"
                          : "bg-surface/80 text-foreground/50 border border-border"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {activeFilter === "all" ? (
            <motion.div
              key="all-projects"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Group 1: Personal Projects */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                        Personal & Independent Projects
                      </h3>
                      <p className="text-xs text-foreground/50">
                        Self-driven mobile applications built and maintained end-to-end
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto rounded-full bg-surface px-2.5 py-0.5 text-xs font-mono text-foreground/60 border border-border">
                    {personalProjects.length} Projects
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                  {personalProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>

              {/* Group 2: Fininfocom / Grafterr */}
              <div className="space-y-5 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                        Fininfocom / Grafterr Products
                      </h3>
                      <p className="text-xs text-foreground/50">
                        Commercial POS, tablet, kiosk, and kitchen management solutions built for hospitality businesses
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto rounded-full bg-surface px-2.5 py-0.5 text-xs font-mono text-foreground/60 border border-border">
                    {fininfocomProjects.length} Projects
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                  {fininfocomProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                      activeFilter === "personal"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {activeFilter === "personal" ? (
                      <Sparkles size={16} />
                    ) : (
                      <Building2 size={16} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      {activeFilter === "personal"
                        ? "Personal & Independent Projects"
                        : "Fininfocom / Grafterr Products"}
                    </h3>
                    <p className="text-xs text-foreground/50">
                      {activeFilter === "personal"
                        ? "Self-driven mobile applications built and maintained end-to-end"
                        : "Commercial POS, tablet, kiosk, and kitchen management solutions built for hospitality businesses"}
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-surface px-2.5 py-0.5 text-xs font-mono text-foreground/60 border border-border">
                  {(activeFilter === "personal"
                    ? personalProjects
                    : fininfocomProjects
                  ).length}{" "}
                  Projects
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                {(activeFilter === "personal"
                  ? personalProjects
                  : fininfocomProjects
                ).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
