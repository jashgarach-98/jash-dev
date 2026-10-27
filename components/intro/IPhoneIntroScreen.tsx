"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LockScreenClock from "./LockScreenClock";
import NotificationCardsStack from "./NotificationCardsStack";
import SlideToUnlock from "./SlideToUnlock";
import { iPhoneAudio } from "./IPhoneAudio";

export default function IPhoneIntroScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasStartedTransition, setHasStartedTransition] = useState(false);

  // Lock body and html scrolling while the intro screen is active
  useEffect(() => {
    if (!isVisible || isUnlocked) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isVisible, isUnlocked]);

  // Handle unlock trigger
  const handleUnlock = useCallback(() => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setHasStartedTransition(true);

    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, 600);
  }, [isUnlocked]);

  // Direct skip button
  const handleSkip = useCallback(() => {
    iPhoneAudio.playUnlock();
    handleUnlock();
  }, [handleUnlock]);

  // Keyboard accessibility: Space, Enter, or Escape
  useEffect(() => {
    if (!isVisible || isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        handleUnlock();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, isUnlocked, handleUnlock, handleSkip]);

  // Replay trigger from navbar or footer
  useEffect(() => {
    const handleReplay = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setIsUnlocked(false);
      setHasStartedTransition(false);
      setIsVisible(true);
    };

    window.addEventListener("replay-iphone-intro", handleReplay);
    return () => window.removeEventListener("replay-iphone-intro", handleReplay);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="lockscreen-intro-overlay"
          initial={{ opacity: 1 }}
          animate={{
            opacity: hasStartedTransition ? 0 : 1,
            scale: hasStartedTransition ? 1.04 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-[8500] w-full h-[100dvh] flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto sm:overflow-hidden select-none px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-7 bg-background text-foreground"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 25%, rgba(225, 255, 0, 0.07) 0%, rgba(225, 255, 0, 0.015) 40%, transparent 75%), #050505",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="iOS Interactive Lock Screen"
        >
          {/* Subtle noise grain texture overlay matching website */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Top Bar with "Skip intro" Button */}
          <header className="relative z-10 w-full flex justify-end px-1 sm:px-4 shrink-0">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[12px] sm:text-[13px] font-medium text-foreground/80 hover:text-accent px-3.5 py-1.5 rounded-full bg-surface/85 hover:bg-surface border border-border hover:border-accent/40 backdrop-blur-md transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              Skip intro
            </button>
          </header>

          {/* Main Center Content Column */}
          <motion.main
            animate={{
              y: hasStartedTransition ? -24 : 0,
              opacity: hasStartedTransition ? 0 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 flex-1 w-full max-w-[440px] flex flex-col items-center justify-center my-auto min-h-0 py-2 sm:py-3"
          >
            {/* Padlock + Live IST Date + Big Clock */}
            <LockScreenClock isUnlocked={isUnlocked} />

            {/* Stack of 3 Notification Cards */}
            <div className="w-full mt-4 xs:mt-5 sm:mt-7">
              <NotificationCardsStack />
            </div>
          </motion.main>

          {/* Bottom "Slide to Unlock" Slider + Home Indicator */}
          <motion.footer
            animate={{
              y: hasStartedTransition ? 24 : 0,
              opacity: hasStartedTransition ? 0 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 w-full flex justify-center pb-1 sm:pb-3 shrink-0"
          >
            <SlideToUnlock onUnlock={handleUnlock} isUnlocked={isUnlocked} />
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
