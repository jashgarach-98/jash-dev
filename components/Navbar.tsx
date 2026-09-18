"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
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
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8"
          aria-label="Primary"
        >
          {/* Logo */}
          <a
            href="#"
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
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
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
            <a
              href="mailto:garach.jash1@gmail.com"
              className="hidden md:flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-background transition-all duration-300 hover:opacity-90 hover:scale-[0.97] active:scale-95"
            >
              Hire Me
            </a>

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
            className="fixed top-[65px] left-0 right-0 z-40 glass border-t border-border shadow-2xl"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="mailto:garach.jash1@gmail.com"
                onClick={closeMobileMenu}
                className="mt-2 flex h-11 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-background"
              >
                Hire Me
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
