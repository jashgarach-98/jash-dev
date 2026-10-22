"use client";

import { useState } from "react";
import {
  Sparkles,
  Zap,
  Key,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { Post } from "@/lib/posts";
import { TOPIC_PRESETS, generateArticleWithGemini } from "@/lib/ai-generator";

interface AdminAiGeneratorProps {
  geminiApiKey: string;
  onUpdateGeminiKey: (key: string) => void;
  onPostGenerated: (post: Post) => void;
  existingSlugs: string[];
}

export default function AdminAiGenerator({
  geminiApiKey,
  onUpdateGeminiKey,
  onPostGenerated,
  existingSlugs,
}: AdminAiGeneratorProps) {
  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_PRESETS[0].topic);
  const [selectedCategory, setSelectedCategory] = useState(
    TOPIC_PRESETS[0].category
  );
  const [selectedAccent, setSelectedAccent] = useState(TOPIC_PRESETS[0].accent);
  const [customTopic, setCustomTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);

  const handleSaveKey = () => {
    onUpdateGeminiKey(keyInput.trim());
  };

  const handleGenerate = async () => {
    const activeKey = geminiApiKey || keyInput.trim();
    if (!activeKey) {
      setError("Please enter your Google Gemini API Key first.");
      return;
    }

    const topic = customTopic.trim() || selectedTopic;
    if (!topic) {
      setError("Please select or enter a topic.");
      return;
    }

    setGenerating(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const post = await generateArticleWithGemini({
        apiKey: activeKey,
        topic,
        category: selectedCategory,
        accent: selectedAccent,
        existingSlugs,
      });

      setGeneratedPost(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate post.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="text-accent" size={24} />
          <span>AI Technical Blog Generator</span>
        </h2>
        <p className="text-xs sm:text-sm text-foreground/60 font-mono mt-1">
          Generate complete production-grade technical articles in Jash&apos;s calm, high-depth developer voice.
        </p>
      </div>

      {/* API Key Box */}
      <div className="rounded-3xl border border-border bg-surface/40 p-6 space-y-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-accent" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
              Google Gemini API Key
            </h3>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono text-accent hover:underline"
          >
            Get Free Gemini Key <ExternalLink size={11} />
          </a>
        </div>

        <div className="flex gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleSaveKey}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors cursor-pointer"
          >
            Save Key
          </button>
        </div>
        <p className="text-[11px] text-foreground/40 font-mono">
          Uses <span className="text-accent font-semibold">gemini-2.0-flash</span>. Your API key is stored securely in your browser session.
        </p>
      </div>

      {/* Preset Topics Carousel / Matrix */}
      <div className="space-y-3">
        <label className="text-xs uppercase font-mono tracking-wider text-foreground/60 block">
          Preset Technical Topics Matrix
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPIC_PRESETS.map((preset, idx) => {
            const isSelected =
              !customTopic && selectedTopic === preset.topic;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomTopic("");
                  setSelectedTopic(preset.topic);
                  setSelectedCategory(preset.category);
                  setSelectedAccent(preset.accent);
                }}
                className={`text-left rounded-2xl border p-4 transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-md shadow-accent/10"
                    : "border-border bg-surface/30 hover:border-border/80 hover:bg-surface/50"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span
                    className="font-semibold"
                    style={{ color: preset.accent }}
                  >
                    {preset.category}
                  </span>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-semibold line-clamp-2 leading-snug">
                  {preset.topic}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Topic Input */}
      <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground/60">
          Or Enter a Custom Topic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-foreground/60">
              Custom Topic Title
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Profiling Memory Leaks in Large Jetpack Compose Apps with LeakCanary"
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-foreground/60">
              Category
            </label>
            <input
              type="text"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholder="Android / Performance"
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating Technical Article with Gemini...</span>
            </>
          ) : (
            <>
              <Zap size={16} />
              <span>Generate Full Article Draft</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Result Card */}
      {generatedPost && (
        <div className="rounded-3xl border border-accent/40 bg-surface/60 p-6 space-y-5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <CheckCircle2 size={16} />
            <span className="font-semibold">Article Generated Successfully!</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-foreground/50">
              <span
                className="px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: `${generatedPost.accent}20`,
                  color: generatedPost.accent,
                }}
              >
                {generatedPost.category}
              </span>
              <span>• {generatedPost.readingTime}</span>
              <span>• {generatedPost.blocks.length} content blocks</span>
            </div>

            <h3 className="text-xl font-bold">{generatedPost.title}</h3>
            <p className="text-xs sm:text-sm text-foreground/70">
              {generatedPost.description}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={() => onPostGenerated(generatedPost)}
              className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent/20"
            >
              <span>Load into Editor & Review</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
