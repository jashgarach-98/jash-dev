"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface VideoDescriptionProps {
  description: string;
  charLimit?: number;
}

export default function VideoDescription({
  description,
  charLimit = 135,
}: VideoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description || description.trim().length === 0) {
    return (
      <p className="text-xs text-foreground/40 italic">
        No description provided.
      </p>
    );
  }

  const trimmed = description.trim();
  const isLong = trimmed.length > charLimit;

  // Function to render links and hashtags nicely
  const renderFormattedText = (text: string) => {
    // Replace URLs with clickable anchors
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-accent underline underline-offset-2 hover:opacity-80 break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col text-xs leading-relaxed text-foreground/70">
      <div
        className={`transition-all duration-300 whitespace-pre-line ${
          isExpanded
            ? "max-h-[380px] overflow-y-auto pr-1 scrollbar-thin"
            : "line-clamp-3"
        }`}
      >
        {renderFormattedText(trimmed)}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
          className="mt-2 inline-flex items-center gap-1 self-start font-mono text-[11px] font-semibold text-accent hover:underline focus:outline-none"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "Show Less" : "Read More"}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
