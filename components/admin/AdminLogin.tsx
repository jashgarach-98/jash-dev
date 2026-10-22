"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, KeyRound, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { verifyAdminPin, saveAdminConfig } from "@/lib/admin-auth";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pin.trim()) {
      setError("Please enter the admin PIN.");
      return;
    }

    setLoading(true);

    if (verifyAdminPin(pin)) {
      saveAdminConfig({
        isAuthenticated: true,
        loginTime: Date.now(),
        ...(githubToken.trim() ? { githubToken: githubToken.trim() } : {}),
      });
      onSuccess();
    } else {
      setError("Incorrect PIN. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl border border-border bg-surface/70 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow Flourish */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-xs text-foreground/50 font-mono">
              Portfolio & Content Management
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="admin-pin"
              className="block text-xs uppercase font-mono tracking-wider text-foreground/60 mb-2"
            >
              Security PIN
            </label>
            <div className="relative">
              <input
                id="admin-pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="Enter 4-digit PIN"
                maxLength={8}
                autoFocus
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-lg font-mono tracking-widest text-center text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
              <KeyRound
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-foreground/40 text-center font-mono">
              Default demo PIN: <span className="text-accent font-semibold">2026</span>
            </p>
          </div>

          {!showTokenInput ? (
            <button
              type="button"
              onClick={() => setShowTokenInput(true)}
              className="text-xs text-accent/80 hover:text-accent font-mono flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={12} /> Add GitHub Token now (optional)
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5"
            >
              <label
                htmlFor="github-token"
                className="block text-xs uppercase font-mono tracking-wider text-foreground/60"
              >
                GitHub Personal Access Token (PAT)
              </label>
              <input
                id="github-token"
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-xs font-mono text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
              <p className="text-[11px] text-foreground/40 leading-relaxed">
                Needed only to publish commits directly to GitHub repository. You can also configure this later in Settings.
              </p>
            </motion.div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
          >
            {loading ? "Unlocking..." : "Unlock Dashboard"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-[11px] font-mono text-foreground/40">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-accent" /> Client Session Guard
          </span>
          <span>v1.0.0</span>
        </div>
      </motion.div>
    </div>
  );
}
