"use client";

import { useState } from "react";
import {
  Github,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  REPO_OWNER,
  REPO_NAME,
  REPO_BRANCH,
  verifyGitHubToken,
} from "@/lib/github";
import { logoutAdmin } from "@/lib/admin-auth";

interface AdminSettingsProps {
  githubToken: string;
  geminiApiKey: string;
  onSaveTokens: (tokens: { githubToken: string; geminiApiKey: string }) => void;
  onLogout: () => void;
}

export default function AdminSettings({
  githubToken,
  geminiApiKey,
  onSaveTokens,
  onLogout,
}: AdminSettingsProps) {
  const [tokenInput, setTokenInput] = useState(githubToken);
  const [geminiInput, setGeminiInput] = useState(geminiApiKey);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    username?: string;
    repoAccess?: boolean;
    error?: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestToken = async () => {
    if (!tokenInput.trim()) {
      setVerificationResult({
        valid: false,
        error: "Please enter a GitHub token to test.",
      });
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    const result = await verifyGitHubToken(tokenInput);
    setVerificationResult(result);
    setVerifying(false);
  };

  const handleSave = () => {
    onSaveTokens({
      githubToken: tokenInput.trim(),
      geminiApiKey: geminiInput.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Settings & Integrations</h2>
        <p className="text-xs sm:text-sm text-foreground/60 font-mono mt-1">
          Configure GitOps token, Google AI Studio integration, and environment settings.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Settings saved to your local browser session!</span>
        </div>
      )}

      {/* GitHub GitOps Section */}
      <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-surface border border-border flex items-center justify-center">
              <Github size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold">GitHub GitOps Integration</h3>
              <p className="text-xs font-mono text-foreground/50">
                Target: {REPO_OWNER}/{REPO_NAME} ({REPO_BRANCH} branch)
              </p>
            </div>
          </div>

          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+Admin+Panel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
          >
            <span>Create New PAT on GitHub</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
            Personal Access Token (classic or fine-grained with repo write access)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value);
                setVerificationResult(null);
              }}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleTestToken}
              disabled={verifying}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors cursor-pointer disabled:opacity-50"
            >
              {verifying ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Shield size={13} />
              )}
              <span>Test Access</span>
            </button>
          </div>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div
            className={`rounded-2xl border p-4 text-xs font-mono space-y-1 ${
              verificationResult.valid && verificationResult.repoAccess
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {verificationResult.valid && verificationResult.repoAccess ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>
                {verificationResult.valid && verificationResult.repoAccess
                  ? `Authenticated as @${verificationResult.username} with push access!`
                  : "Verification Failed"}
              </span>
            </div>
            {verificationResult.error && (
              <p className="opacity-90">{verificationResult.error}</p>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-background/50 border border-border/50 p-4 text-xs text-foreground/60 space-y-2">
          <p className="font-semibold text-foreground/80">How GitOps Works:</p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
            <li>When you save articles or edit projects, commits are pushed directly to <span className="text-accent">{REPO_BRANCH}</span>.</li>
            <li>Vercel detects the commit and triggers a continuous preview or production deployment.</li>
            <li>GitHub Actions triggers <span className="text-accent">deploy.yml</span> to update GitHub Pages automatically.</li>
            <li>No database subscriptions or maintenance required.</li>
          </ul>
        </div>
      </div>

      {/* Google Gemini AI Section */}
      <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-surface border border-border flex items-center justify-center">
              <Key size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold">Google Gemini API</h3>
              <p className="text-xs font-mono text-foreground/50">
                Powers the AI Technical Article Generator (gemini-2.0-flash)
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-accent hover:underline"
          >
            <span>Google AI Studio</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
            Gemini API Key
          </label>
          <input
            type="password"
            value={geminiInput}
            onChange={(e) => setGeminiInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Admin Security Information */}
      <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Shield size={18} className="text-accent" />
          <span>Security & Customization</span>
        </h3>
        <p className="text-xs text-foreground/70 leading-relaxed">
          The default admin PIN is <code className="bg-surface px-1.5 py-0.5 rounded text-accent font-mono">2026</code>.
          To set a custom PIN in production, add this environment variable in your Vercel Dashboard (<span className="font-mono text-xs">Settings &gt; Environment Variables</span>):
        </p>
        <div className="rounded-xl bg-background border border-border p-3 font-mono text-xs text-foreground/80">
          NEXT_PUBLIC_ADMIN_PIN=your_custom_pin_here
        </div>
      </div>

      {/* Save Settings Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => {
            if (confirm("Log out and clear stored session tokens?")) {
              logoutAdmin();
              onLogout();
            }
          }}
          className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset Session & Logout</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs sm:text-sm font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-accent/20"
        >
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}
