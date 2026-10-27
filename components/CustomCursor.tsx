"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth physics for the trailing ring
  const springConfig = { stiffness: 220, damping: 20, mass: 0.4 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // High responsiveness for the center dot
  const dotConfig = { stiffness: 700, damping: 35, mass: 0.05 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    // Only activate custom cursor on fine pointer (mouse/trackpad) devices
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(pointer: fine)");
      setIsPointerFine(media.matches);

      const handleMediaChange = (e: MediaQueryListEvent) => {
        setIsPointerFine(e.matches);
      };

      media.addEventListener("change", handleMediaChange);
      return () => media.removeEventListener("change", handleMediaChange);
    }
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnterInteractive = () => setIsHovering(true);
    const handleMouseLeaveInteractive = () => setIsHovering(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    // Attach listeners to interactive elements across the app & intro screen
    const addListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, [role='button'], [role='slider'], input, textarea, label[for], .cursor-pointer, .cursor-grab, [data-interactive]"
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnterInteractive);
        el.addEventListener("mouseleave", handleMouseLeaveInteractive);
      });
    };

    addListeners();

    // Re-attach listeners when DOM changes (intro mounts/unmounts)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [mouseX, mouseY, isVisible, isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] select-none">
      {/* Outer Glow Ring */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 46 : isClicking ? 28 : 34,
          height: isHovering ? 46 : isClicking ? 28 : 34,
          borderColor: isHovering
            ? "var(--accent)"
            : "rgba(237, 237, 237, 0.65)",
          backgroundColor: isHovering
            ? "rgba(225, 255, 0, 0.12)"
            : "rgba(237, 237, 237, 0.03)",
          boxShadow: isHovering
            ? "0 0 18px rgba(225, 255, 0, 0.4)"
            : "0 0 10px rgba(0, 0, 0, 0.6)",
          scale: isClicking ? 0.92 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed top-0 left-0 rounded-full border-2"
      />

      {/* Center Precision Dot — always crisp & radiant */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isClicking ? 0.75 : isHovering ? 1.25 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
      />
    </div>
  );
}
