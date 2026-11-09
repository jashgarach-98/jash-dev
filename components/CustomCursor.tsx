"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], [role='slider'], input, textarea, select, label[for], summary, .cursor-pointer, .cursor-grab, [data-interactive]";

export default function CustomCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringContainerRef = useRef<HTMLDivElement>(null);
  const ringVisualRef = useRef<HTMLDivElement>(null);
  const dotContainerRef = useRef<HTMLDivElement>(null);
  const dotVisualRef = useRef<HTMLDivElement>(null);

  // Check for fine pointer (mouse / trackpad) devices
  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(pointer: fine)");
    setIsPointerFine(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };

    media.addEventListener("change", handleMediaChange);
    return () => media.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    // Enable custom cursor CSS rule on html element
    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let hasInitialized = false;
    let isVisible = false;
    let isHovering = false;
    let isClicking = false;
    let rafId: number | null = null;
    let lastTime = 0;

    const updateVisualClasses = () => {
      if (ringVisualRef.current) {
        ringVisualRef.current.classList.toggle("is-hovering", isHovering);
        ringVisualRef.current.classList.toggle("is-clicking", isClicking);
      }
      if (dotVisualRef.current) {
        dotVisualRef.current.classList.toggle("is-hovering", isHovering);
        dotVisualRef.current.classList.toggle("is-clicking", isClicking);
      }
    };

    const setVisible = (visible: boolean) => {
      if (isVisible === visible) return;
      isVisible = visible;
      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = visible ? "1" : "0";
      }
    };

    // Frame-rate independent lerp animation for the trailing ring
    const renderRing = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Exponential smoothing: factor 24 ensures rapid, buttery follow without lag
      const factor = 1 - Math.exp(-24 * dt);
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;

      ringX += dx * factor;
      ringY += dy * factor;

      if (ringContainerRef.current) {
        ringContainerRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      // If essentially caught up, settle and pause loop to preserve CPU/GPU
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ringX = mouseX;
        ringY = mouseY;
        if (ringContainerRef.current) {
          ringContainerRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        }
        rafId = null;
        lastTime = 0;
      } else {
        rafId = requestAnimationFrame(renderRing);
      }
    };

    const checkInteractive = (target: Element | null): boolean => {
      if (!target) return false;
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!interactive) return false;
      // Do not treat disabled elements as interactive
      if (
        interactive.hasAttribute("disabled") ||
        interactive.getAttribute("aria-disabled") === "true"
      ) {
        return false;
      }
      return true;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasInitialized) {
        ringX = mouseX;
        ringY = mouseY;
        if (ringContainerRef.current) {
          ringContainerRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        }
        hasInitialized = true;
      }

      // 1. Center precision dot: instantaneous real-time 1:1 hardware tracking (0 lag)
      if (dotContainerRef.current) {
        dotContainerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Trailing ring: wake up RAF loop if needed
      if (!rafId) {
        lastTime = 0;
        rafId = requestAnimationFrame(renderRing);
      }

      if (!isVisible) {
        setVisible(true);
      }

      // 3. Hover state via event delegation
      const target = e.target as Element | null;
      const nextHover = checkInteractive(target);
      if (nextHover !== isHovering) {
        isHovering = nextHover;
        updateVisualClasses();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      isClicking = true;
      updateVisualClasses();
    };

    const handlePointerUp = () => {
      isClicking = false;
      updateVisualClasses();
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target as Element | null;
      const nextHover = checkInteractive(target);
      if (nextHover !== isHovering) {
        isHovering = nextHover;
        updateVisualClasses();
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
      isHovering = false;
      isClicking = false;
      updateVisualClasses();
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleBlur = () => {
      setVisible(false);
      isClicking = false;
      updateVisualClasses();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("dragend", handlePointerUp, { passive: true });
    window.addEventListener("blur", handleBlur);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("dragend", handlePointerUp);
      window.removeEventListener("blur", handleBlur);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 z-[99999] select-none overflow-hidden transition-opacity duration-200"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* Outer Glow Ring Container */}
      <div
        ref={ringContainerRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <div ref={ringVisualRef} className="custom-cursor-ring rounded-full" />
      </div>

      {/* Center Precision Dot Container — instantaneous real-time 1:1 hardware tracking */}
      <div
        ref={dotContainerRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <div ref={dotVisualRef} className="custom-cursor-dot rounded-full" />
      </div>
    </div>
  );
}
