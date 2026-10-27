"use client";

import { motion } from "framer-motion";
import { MessageSquare, Briefcase } from "lucide-react";

interface NotificationItem {
  id: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  app: string;
  time: string;
  title: string;
  description: string;
}

// Android Studio Icon SVG with official robot head & tools
function AndroidStudioIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 sm:w-5 sm:h-5 text-[#3ddc84]"
    >
      {/* Antennae */}
      <line
        x1="7"
        y1="4.5"
        x2="4.5"
        y2="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="4.5"
        x2="19.5"
        y2="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Robot Dome */}
      <path d="M4.5 10a7.5 7.5 0 0 1 15 0H4.5z" />
      {/* Eyes */}
      <circle cx="8.5" cy="7.2" r="1.1" fill="#050505" />
      <circle cx="15.5" cy="7.2" r="1.1" fill="#050505" />
      {/* Studio Body / Platform */}
      <path
        d="M5 12h14v5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17v-5z"
        opacity="0.85"
      />
      {/* Inner tool accent */}
      <path
        d="M10 14h4v2h-4z"
        fill="#050505"
        opacity="0.9"
      />
    </svg>
  );
}

// Xcode hammer icon SVG
function XcodeHammerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 sm:w-5 sm:h-5"
    >
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 3.26-1.25-1.25a2 2 0 0 0-2.83 0l-1.8 1.8 4.08 4.08 1.8-1.8a2 2 0 0 0 0-2.83Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

const notifications: NotificationItem[] = [
  {
    id: "android-studio",
    iconBg: "bg-[#3ddc84]/15 border border-[#3ddc84]/35",
    iconColor: "text-[#3ddc84]",
    icon: <AndroidStudioIcon />,
    app: "Android Studio",
    time: "now",
    title: "Build Succeeded",
    description: "app-release.apk · 0 warnings, 0 errors",
  },
  {
    id: "xcode",
    iconBg: "bg-[#1d4ed8]/20 border border-[#3b82f6]/40",
    iconColor: "text-[#60a5fa]",
    icon: <XcodeHammerIcon />,
    app: "Xcode",
    time: "now",
    title: "Build Succeeded",
    description: "Runner.app · 0 warnings, 0 errors",
  },
  {
    id: "experience",
    iconBg: "bg-accent-muted border border-accent/40",
    iconColor: "text-accent",
    icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />,
    app: "Grafterr × Fin Infocom",
    time: "now",
    title: "Shipping since 2021",
    description: "5+ years crafting high-performance mobile apps.",
  },
  {
    id: "messages",
    iconBg: "bg-[#10b981]/20 border border-[#10b981]/40",
    iconColor: "text-[#34d399]",
    icon: (
      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-current stroke-transparent" />
    ),
    app: "Messages",
    time: "now",
    title: "Jash Garach",
    description: "Hey 👋 slide to unlock and see what I've built.",
  },
];

export default function NotificationCardsStack() {
  return (
    <div className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[430px] flex flex-col gap-1.5 sm:gap-2.5 select-none mx-auto">
      {notifications.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1 + index * 0.07,
            ease: "easeOut",
          }}
          className="group relative w-full rounded-[14px] xs:rounded-[16px] sm:rounded-[18px] bg-surface/85 hover:bg-[#161616] backdrop-blur-xl border border-border hover:border-accent/40 px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.65)] transition-all duration-300"
        >
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* App Icon */}
            <div
              className={`w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] rounded-[9px] sm:rounded-[11px] ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-sm`}
            >
              {item.icon}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] sm:text-[13px] font-medium text-foreground/85 tracking-tight">
                  {item.app}
                </span>
                <span className="text-[10px] sm:text-[11px] text-foreground/45 font-mono">
                  {item.time}
                </span>
              </div>

              <div className="text-[13px] sm:text-[13.5px] font-semibold text-foreground tracking-tight leading-snug mt-0.5 truncate">
                {item.title}
              </div>

              <div className="text-[11px] sm:text-[12px] text-foreground/65 leading-snug mt-0.5 truncate">
                {item.description}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
