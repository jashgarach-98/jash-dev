"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";

interface LockScreenClockProps {
  isUnlocked: boolean;
}

interface TimeData {
  timeStr: string;
  dateStr: string;
}

const getISTTime = (): TimeData => {
  const now = new Date();

  // 24-hour format in Indian Standard Time (Asia/Kolkata)
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Date in IST: "Tuesday, 27 October"
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return {
    timeStr: timeFormatter.format(now),
    dateStr: dateFormatter.format(now),
  };
};

export default function LockScreenClock({ isUnlocked }: LockScreenClockProps) {
  const [mounted, setMounted] = useState(false);
  const [timeData, setTimeData] = useState<TimeData>({
    timeStr: "13:32",
    dateStr: "Tuesday, 27 October",
  });

  useEffect(() => {
    setMounted(true);
    setTimeData(getISTTime());

    const interval = setInterval(() => {
      setTimeData(getISTTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none w-full">
      {/* Top Padlock Icon */}
      <motion.div
        animate={
          isUnlocked
            ? { scale: [1, 1.25, 1], y: -2 }
            : { scale: 1, y: 0 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="flex items-center justify-center mb-1.5 sm:mb-2"
      >
        {isUnlocked ? (
          <Unlock className="w-4 h-4 text-accent stroke-[2.2]" />
        ) : (
          <Lock className="w-4 h-4 text-foreground/85 stroke-[2]" />
        )}
      </motion.div>

      {/* Date in IST: "Tuesday, 27 October" */}
      <div className="text-[13px] xs:text-[14px] sm:text-[15px] font-medium tracking-normal text-foreground/80 font-sans">
        {mounted ? timeData.dateStr : "Tuesday, 27 October"}
      </div>

      {/* Massive Responsive Clock: "13:32" in website's Sora / sans font */}
      <div className="mt-0.5 sm:mt-1 flex items-center justify-center">
        <span className="text-[64px] xs:text-[76px] sm:text-[104px] md:text-[124px] lg:text-[132px] font-bold leading-none tracking-tight text-foreground drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] font-sans">
          {mounted ? timeData.timeStr : "13:32"}
        </span>
      </div>

      {/* Small IST Timezone Pill (website accent styling) */}
      <div className="mt-1 sm:mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-muted border border-accent/20 text-[10px] sm:text-[11px] font-mono text-accent font-medium">
        <span>🇮🇳 IST</span>
        <span className="text-accent/50">•</span>
        <span>UTC+5:30</span>
      </div>
    </div>
  );
}
