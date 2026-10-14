import type { Metadata } from "next";
import BlogGrid from "@/components/blog/BlogGrid";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | Jash Garach",
  description:
    "Notes on Android and Flutter development — architecture, shipping mobile products, and what's changing across the two ecosystems.",
  openGraph: {
    type: "website",
    title: "Blog | Jash Garach",
    description:
      "Notes on Android and Flutter development — architecture, shipping mobile products, and what's changing across the two ecosystems.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section
      className="relative overflow-hidden px-4 py-14 md:px-8 md:py-20 lg:py-24"
      aria-label="Blog"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-accent opacity-[0.04] blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <span className="section-tag">Blog</span>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
            Notes on building mobile products that hold up in the real world.
          </h1>
          <p className="mt-3.5 max-w-2xl text-sm md:text-base text-foreground/60 leading-relaxed">
            Short, practical takes on Android and Flutter — what&apos;s changing,
            what I&apos;ve learned shipping apps, and how to keep them fast and
            maintainable.
          </p>
        </div>

        {/* Post grid */}
        <BlogGrid posts={posts} />
      </div>
    </section>
  );
}
