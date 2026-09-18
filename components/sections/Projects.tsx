"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  kind: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  links: { label: string; href: string }[];
  wide?: boolean;
}

const projects: Project[] = [
  {
    id: "grafterr-pos",
    kind: "Flutter App",
    title: "Grafterr POS",
    description:
      "All-in-one Flutter point-of-sale product built for hospitality businesses, helping teams take orders faster, accept payments smoothly, and manage day-to-day operations from a single app experience.",
    tags: ["Flutter", "POS", "Hospitality", "Cross-platform"],
    color: "#f59e0b",
    wide: true,
    links: [
      {
        label: "Play Store",
        href: "https://play.google.com/store/apps/details?id=com.grafterr.grafterr_pos",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/in/app/grafterr-pos/id6474546328",
      },
    ],
  },
  {
    id: "operator",
    kind: "Tablet App",
    title: "Operator — Grafterr",
    description:
      "Restaurant operations app for table orders, payments, split bills, reservations, delivery flows, offers, and service coordination across busy hospitality environments.",
    tags: ["POS", "Tablet", "Hospitality", "Operations"],
    color: "#f59e0b",
    links: [
      {
        label: "View App",
        href: "https://play.google.com/store/apps/details?id=com.eposhybrid.beta.operator",
      },
    ],
  },
  {
    id: "self-checkout",
    kind: "Tablet App",
    title: "Self Checkout — Grafterr",
    description:
      "Self-service kiosk flow that helps customers place and collect orders more quickly while reducing friction and queues at the counter.",
    tags: ["Kiosk", "Self-service", "Tablet", "UX Efficiency"],
    color: "#6366f1",
    links: [
      {
        label: "View App",
        href: "https://play.google.com/store/apps/details?id=com.eposhybrid.selfcheckout",
      },
    ],
  },
  {
    id: "collection-app",
    kind: "Tablet App",
    title: "Collection App — Grafterr",
    description:
      "Large-screen order status display showing cooking and ready-to-pick-up stages while also allowing advertising alongside operational information.",
    tags: ["Order status", "Large screen", "Customer display"],
    color: "#06b6d4",
    links: [
      {
        label: "View App",
        href: "https://play.google.com/store/apps/details?id=com.grafterr.collectionapp",
      },
    ],
  },
  {
    id: "kitchen-display",
    kind: "Tablet App",
    title: "Kitchen Display — Grafterr",
    description:
      "Kitchen-facing workflow app designed to help chefs optimize preparation flow and deliver smoother dining operations.",
    tags: ["KDS", "Kitchen ops", "Tablet", "Workflow"],
    color: "#14b8a6",
    links: [
      {
        label: "View App",
        href: "https://play.google.com/store/apps/details?id=com.eposhybrid.kitchendisplay",
      },
    ],
  },
];

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

      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.15em] text-foreground/40 font-mono">
              {project.kind}
            </p>
            <h3 className="text-xl font-bold leading-tight md:text-2xl">
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
            <ArrowUpRight size={22} />
          </motion.div>
        </div>

        {/* Description */}
        <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground/60">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1 text-xs font-medium border border-border text-foreground/50 transition-colors duration-300"
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
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors duration-300 hover:text-foreground"
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
      className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32"
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
          className="mb-16 md:mb-20"
        >
          <span className="section-tag">Selected Work</span>
          <h2 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
            Flutter and Android apps for hospitality operations.
          </h2>
          <p className="mt-4 max-w-2xl text-foreground/60 leading-relaxed">
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
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
