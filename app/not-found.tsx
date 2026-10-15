import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-md">
        <span className="section-tag font-mono">404 Error</span>
        <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground md:text-7xl font-mono text-accent">
          404
        </h1>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Page not found
        </h2>
        <p className="mt-3 text-sm md:text-base text-foreground/60 leading-relaxed">
          The page or article you are looking for doesn&apos;t exist, has been moved, or the link may have had a typo.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Home size={16} />
            Back to Home
          </Link>

          <Link
            href="/blog"
            className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <BookOpen size={16} />
            Explore Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
