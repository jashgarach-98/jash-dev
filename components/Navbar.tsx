"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { useHireMe } from "@/context/HireMeContext";

const navLinks = [
  { href: "/#about", localHash: "#about", label: "About" },
  { href: "/#projects", localHash: "#projects", label: "Projects" },
  { href: "/#experience", localHash: "#experience", label: "Experience" },
  { href: "/#contact", localHash: "#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, setTheme } = useTheme();
  const { openHireMe } = useHireMe();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle smooth scrolling to target section when arriving with hash
  useEffect(() => {
    if (typeof window === "undefined" || !isHome) return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToHash();
    const t1 = setTimeout(scrollToHash, 100);
    const t2 = setTimeout(scrollToHash, 300);

    window.addEventListener("hashchange", scrollToHash);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname, isHome]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass shadow-[0_1px_0_var(--border)]"
            : "bg-transparent"
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4"
          aria-label="Primary"
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            aria-label="Jash Garach home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-bold text-sm text-background font-mono transition-transform duration-300 group-hover:rotate-6">
              JG
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-foreground/50 leading-none font-mono transition-colors duration-500">
                Android / Flutter
              </p>
              <p className="text-sm font-semibold leading-tight transition-colors duration-500">
                Jash Garach
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {!isHome && (
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors duration-300 relative group"
                >
                  Home
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            )}
            {navLinks.map((link) => (
              <li key={link.label}>
                {isHome ? (
                  <a
                    href={link.localHash}
                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors duration-300 relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/blog"
                className={clsx(
                  "text-sm font-medium transition-colors duration-300 relative group",
                  pathname.startsWith("/blog")
                    ? "text-accent font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                )}
              >
                Blog
                <span
                  className={clsx(
                    "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300",
                    pathname.startsWith("/blog") ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            </li>
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/60 hover:text-foreground hover:border-accent hover:text-accent transition-all duration-300"
                aria-label={
                  theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {theme === "dark" ? (
                      <Sun size={16} />
                    ) : (
                      <Moon size={16} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {/* CTA button — hidden on mobile */}
            <button
              type="button"
              onClick={openHireMe}
              className="hidden md:flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-background transition-all duration-300 hover:opacity-90 hover:scale-[0.97] active:scale-95"
            >
              Hire Me
            </button>

            {/* Mobile menu toggle */}
            <button
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/60"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[61px] md:top-[69px] left-0 right-0 z-40 glass border-t border-border shadow-2xl"
          >
            <nav className="flex flex-col gap-1 p-4">
              {!isHome && (
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-all duration-200"
                >
                  Home
                </Link>
              )}
              {navLinks.map((link) =>
                isHome ? (
                  <a
                    key={link.label}
                    href={link.localHash}
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className={clsx(
                  "rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                  pathname.startsWith("/blog")
                    ? "text-accent bg-accent/10 font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/10"
                )}
              >
                Blog
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  openHireMe();
                }}
                className="mt-2 flex h-11 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-background transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                Hire Me
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
