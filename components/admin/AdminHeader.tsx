"use client";

import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Sparkles,
  FolderGit2,
  Settings,
  ExternalLink,
  LogOut,
  GitBranch,
} from "lucide-react";
import { REPO_OWNER, REPO_NAME, REPO_BRANCH } from "@/lib/github";

export type AdminTab = "posts" | "editor" | "ai" | "projects" | "settings";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  hasGithubToken: boolean;
  onLogout: () => void;
}

export default function AdminHeader({
  activeTab,
  onTabChange,
  hasGithubToken,
  onLogout,
}: AdminHeaderProps) {
  const tabs = [
    { id: "posts" as AdminTab, label: "All Posts", icon: FileText },
    { id: "editor" as AdminTab, label: "New Post", icon: PlusCircle },
    { id: "ai" as AdminTab, label: "AI Generator", icon: Sparkles },
    { id: "projects" as AdminTab, label: "Projects", icon: FolderGit2 },
    { id: "settings" as AdminTab, label: "Settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-bold text-base md:text-lg tracking-tight hover:opacity-90 transition-opacity"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-black font-mono font-bold text-sm">
                JG
              </span>
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-mono text-foreground/50">
              <GitBranch size={11} /> {REPO_OWNER}/{REPO_NAME}:{REPO_BRANCH}
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-foreground/70 hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-accent" : "text-foreground/50"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Git Status Badge */}
            <button
              onClick={() => onTabChange("settings")}
              className={`hidden lg:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono transition-colors ${
                hasGithubToken
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
              title={
                hasGithubToken
                  ? "GitHub Token active: Commits enabled"
                  : "GitHub Token missing: Read-only mode"
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  hasGithubToken ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {hasGithubToken ? "GitOps Active" : "No PAT"}
            </button>

            {/* View Site */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 rounded-xl border border-border px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-surface transition-colors"
            >
              <span className="hidden sm:inline">Portfolio</span>
              <ExternalLink size={12} />
            </Link>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
