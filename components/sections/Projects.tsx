"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projects, type Project } from "@/lib/projects";

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

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
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
            <p className="mb-1 text-xs uppercase tracking-[0.15em] text-foreground/40 font-mono">
              {project.kind}
            </p>
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
          className="mb-10 md:mb-14"
        >
          <span className="section-tag">Selected Work</span>
          <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
            Flutter and Android apps built for enterprise and real-world operations.
          </h2>
          <p className="mt-3.5 max-w-2xl text-sm md:text-base text-foreground/60 leading-relaxed">
            Reliable, high-clarity mobile tools that help real businesses run
            smoothly and give users a faster, cleaner experience.
          </p>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
