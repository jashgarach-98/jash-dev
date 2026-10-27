"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { iPhoneAudio } from "./IPhoneAudio";

interface SlideToUnlockProps {
  onUnlock: () => void;
  isUnlocked: boolean;
}

export default function SlideToUnlock({
  onUnlock,
  isUnlocked,
}: SlideToUnlockProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const [maxDrag, setMaxDrag] = useState<number>(240);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasUnlocked, setHasUnlocked] = useState<boolean>(false);

  const dragX = useMotionValue(0);

  // Calculate max drag distance on mount and on window resize
  const updateMaxDrag = useCallback(() => {
    if (trackRef.current && knobRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const knobWidth = knobRef.current.clientWidth;
      // 5px padding on each side
      const calculatedMax = Math.max(0, trackWidth - knobWidth - 10);
      setMaxDrag(calculatedMax);
    }
  }, []);

  useEffect(() => {
    updateMaxDrag();
    window.addEventListener("resize", updateMaxDrag);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && trackRef.current) {
      resizeObserver = new ResizeObserver(() => updateMaxDrag());
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateMaxDrag);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateMaxDrag]);

  // Fade out text as knob approaches the right
  const textOpacity = useTransform(
    dragX,
    [0, maxDrag * 0.45, maxDrag * 0.75],
    [1, 0.35, 0]
  );

  // Dynamic neon accent fill behind the knob
  const trackFillWidth = useTransform(dragX, (x) => `${Math.max(0, x + 22)}px`);

  const triggerUnlock = useCallback(() => {
    if (hasUnlocked) return;
    setHasUnlocked(true);

    iPhoneAudio.playUnlock();

    animate(dragX, maxDrag, {
      type: "spring",
      stiffness: 400,
      damping: 30,
      onComplete: () => {
        onUnlock();
      },
    });
  }, [hasUnlocked, dragX, maxDrag, onUnlock]);

  const handleDragStart = () => {
    setIsDragging(true);
    iPhoneAudio.playTap();
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    dragX.set(Math.max(0, Math.min(info.offset.x, maxDrag)));
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    const threshold = maxDrag * 0.68;

    if (info.offset.x >= threshold) {
      triggerUnlock();
    } else {
      animate(dragX, 0, {
        type: "spring",
        stiffness: 450,
        damping: 32,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      triggerUnlock();
    }
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX > rect.width * 0.5) {
        triggerUnlock();
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none px-2">
      {/* Slider Track Capsule */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Slide to unlock"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((dragX.get() / (maxDrag || 1)) * 100)}
        onKeyDown={handleKeyDown}
        onClick={handleTrackClick}
        className="relative h-[52px] sm:h-[56px] w-[290px] xs:w-[330px] sm:w-[370px] max-w-[92vw] rounded-full bg-surface/90 backdrop-blur-xl border border-border p-[5px] sm:p-[6px] flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent/40 touch-none cursor-pointer"
      >
        {/* Dynamic neon lime accent glow following knob */}
        <motion.div
          style={{ width: trackFillWidth }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent/25 via-accent/10 to-transparent pointer-events-none rounded-full"
        />

        {/* Shimmering Center Text */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none pl-6 sm:pl-7"
        >
          <span className="slide-shimmer-text text-[13px] sm:text-[14px] font-medium text-foreground/75 tracking-wide">
            slide to unlock
          </span>
        </motion.div>

        {/* Circular White Handle with Dark Right Arrow */}
        <motion.div
          ref={knobRef}
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.06}
          dragMomentum={false}
          style={{ x: dragX }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-hidden="true"
          className="relative z-10 h-[40px] sm:h-[44px] w-[40px] sm:w-[44px] rounded-full bg-white text-background shadow-[0_2px_12px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 touch-none border border-white/40"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-background stroke-[2.5]" />
        </motion.div>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-[110px] sm:w-[130px] h-[4px] rounded-full bg-foreground/60 mx-auto mt-3 sm:mt-4" />
    </div>
  );
}
