"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "a" | "button";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 30,
  as: Tag = "button",
  href,
  target,
  rel,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  // Inner element moves more for parallax feel
  const innerX = useTransform(x, (v) => v * 0.4);
  const innerY = useTransform(y, (v) => v * 0.4);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    rawX.set((distX / rect.width) * strength);
    rawY.set((distY / rect.height) * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const commonProps = {
    ref: ref as React.Ref<HTMLAnchorElement & HTMLButtonElement>,
    style: { x, y },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileTap: { scale: 0.95 },
    className,
    "aria-label": ariaLabel,
  };

  if (Tag === "a") {
    return (
      <motion.a
        {...commonProps}
        href={href}
        target={target}
        rel={rel}
      >
        <motion.span
          style={{ x: innerX, y: innerY }}
          className="relative z-10 flex items-center gap-2"
        >
          {children}
        </motion.span>
      </motion.a>
    );
  }

  return (
    <motion.button
      {...commonProps}
      type={type}
      onClick={onClick}
    >
      <motion.span
        style={{ x: innerX, y: innerY }}
        className="relative z-10 flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
