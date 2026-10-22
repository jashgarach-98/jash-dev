"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Lock,
  Unlock,
  FileCode,
  Heading,
  AlignLeft,
  List,
  Quote,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Post, PostBlock, PostReference } from "@/lib/posts";
import PostArticle from "@/components/blog/PostArticle";

interface AdminPostEditorProps {
  initialPost?: Post | null;
  onSave: (post: Post) => Promise<boolean>;
  onCancel: () => void;
  hasGithubToken: boolean;
  onOpenSettings: () => void;
}

const PRESET_CATEGORIES = [
  "Android / Kotlin",
  "Flutter / Architecture",
  "Mobile AI & Productivity",
  "Android / Jetpack Compose",
  "Flutter / Dart",
  "Networking & Resiliency",
  "Performance & Profiling",
  "Hardware & POS Integration",
  "Testing & CI/CD",
];

const PRESET_ACCENTS = [
  "#38bdf8", // Blue
  "#22d3ee", // Cyan
  "#10b981", // Emerald
  "#818cf8", // Indigo
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Sky
  "#a855f7", // Purple
  "#e1ff00", // Neon lime
];

export default function AdminPostEditor({
  initialPost,
  onSave,
  onCancel,
  hasGithubToken,
  onOpenSettings,
}: AdminPostEditorProps) {
  const isEditing = Boolean(initialPost?.slug);

  const [post, setPost] = useState<Post>(() => {
    if (initialPost) return { ...initialPost };
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0];
    const publishedLabel = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return {
      slug: "",
      title: "",
      description: "",
      date: isoDate,
      publishedLabel,
      readingTime: "5 min read",
      category: PRESET_CATEGORIES[0],
      tags: ["Android", "Kotlin"],
      accent: PRESET_ACCENTS[0],
      coverImage: {
        src: "",
        alt: "",
        caption: "",
      },
      blocks: [
        {
          type: "paragraph",
          text: "Write your opening insights here...",
        },
        {
          type: "heading",
          text: "Architectural Overview",
        },
        {
          type: "code",
          language: "kotlin",
          code: "// Code snippet here",
        },
      ],
      references: [
        {
          label: "Official Documentation",
          href: "https://developer.android.com",
        },
      ],
    };
  });

  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [tagInput, setTagInput] = useState(post.tags.join(", "));
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Update slug automatically when title changes if unlocked
  const handleTitleChange = (val: string) => {
    setPost((prev) => {
      const updated = { ...prev, title: val };
      if (!slugLocked) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
          .slice(0, 60);
      }
      return updated;
    });
  };

  const handleTagsChange = (val: string) => {
    setTagInput(val);
    const parsed = val
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setPost((prev) => ({ ...prev, tags: parsed }));
  };

  // Block Manipulations
  const handleAddBlock = (type: PostBlock["type"]) => {
    let newBlock: PostBlock;
    if (type === "paragraph") newBlock = { type: "paragraph", text: "" };
    else if (type === "heading") newBlock = { type: "heading", text: "" };
    else if (type === "code")
      newBlock = { type: "code", language: "kotlin", code: "" };
    else if (type === "list") newBlock = { type: "list", items: [""] };
    else if (type === "quote") newBlock = { type: "quote", text: "" };
    else newBlock = { type: "paragraph", text: "" };

    setPost((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const handleUpdateBlock = (index: number, updated: PostBlock) => {
    setPost((prev) => {
      const copy = [...prev.blocks];
      copy[index] = updated;
      return { ...prev, blocks: copy };
    });
  };

  const handleRemoveBlock = (index: number) => {
    setPost((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    setPost((prev) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= prev.blocks.length) return prev;
      const copy = [...prev.blocks];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, blocks: copy };
    });
  };

  const handleGenerateCover = () => {
    if (!post.title) {
      alert("Please enter a title first to generate a cover image.");
      return;
    }
    const cleanTitle = encodeURIComponent(post.title.slice(0, 80));
    const url = `https://image.pollinations.ai/prompt/editorial%20minimal%20dark%20tech%20illustration%20for%20${cleanTitle}%20with%20neon%20accents%2016:9?width=1280&height=720&nologo=true&seed=42`;
    setPost((prev) => ({
      ...prev,
      coverImage: {
        src: url,
        alt: `${post.title} illustration`,
        caption: post.description,
      },
    }));
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(post, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.slug || "article"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post.title.trim()) {
      setSaveStatus({ type: "error", message: "Article title is required." });
      return;
    }
    if (!post.slug.trim()) {
      setSaveStatus({ type: "error", message: "Slug is required." });
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const success = await onSave(post);
      if (success) {
        setSaveStatus({
          type: "success",
          message: "Article saved and committed to GitHub successfully!",
        });
      } else {
        setSaveStatus({
          type: "error",
          message: "Failed to commit article to GitHub. Check your PAT token.",
        });
      }
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Error saving article.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-foreground/70 hover:text-foreground hover:bg-surface/80 transition-colors cursor-pointer"
            title="Back to posts"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isEditing ? "Edit Article" : "Create New Article"}
            </h2>
            <p className="text-xs text-foreground/50 font-mono">
              Slug: {post.slug || "new-article-slug"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            title="Download JSON file"
          >
            <Download size={14} />
            <span className="hidden md:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
          >
            <Eye size={14} />
            <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent/20 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? "Saving..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* GitHub Token Warning banner if missing */}
      {!hasGithubToken && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-400 shrink-0" />
            <span>
              GitHub Token missing. You can edit and export JSON, but commits to the repo require a PAT.
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1 bg-amber-400 text-black font-semibold rounded-lg hover:opacity-90 shrink-0 cursor-pointer"
          >
            Add PAT
          </button>
        </div>
      )}

      {/* Save Notification */}
      {saveStatus && (
        <div
          className={`rounded-2xl border p-4 text-xs font-mono flex items-center gap-2 ${
            saveStatus.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Live Preview Modal / Drawer */}
      {showPreview && (
        <div className="rounded-3xl border border-accent/30 bg-background/95 p-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
              <h3 className="font-bold text-sm uppercase tracking-wider font-mono text-accent">
                Live Article Preview
              </h3>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-xs text-foreground/50 hover:text-foreground font-mono"
            >
              Close Preview [×]
            </button>
          </div>
          <div className="max-w-3xl mx-auto">
            <PostArticle post={post} />
          </div>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Metadata Grid */}
        <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground/60">
            Article Metadata
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Article Title *
              </label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Architecting Large-Scale Flutter Applications with Clean Architecture"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                  Slug (URL Path) *
                </label>
                <button
                  type="button"
                  onClick={() => setSlugLocked(!slugLocked)}
                  className="text-[11px] font-mono text-foreground/50 hover:text-accent flex items-center gap-1 cursor-pointer"
                >
                  {slugLocked ? <Lock size={11} /> : <Unlock size={11} />}
                  {slugLocked ? "Locked" : "Editable"}
                </button>
              </div>
              <input
                type="text"
                value={post.slug}
                readOnly={slugLocked}
                onChange={(e) =>
                  setPost((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="architecting-large-scale-flutter-apps"
                required
                className={`w-full rounded-xl border border-border px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none ${
                  slugLocked ? "bg-surface/50 opacity-75" : "bg-background"
                }`}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Category
              </label>
              <select
                value={post.category}
                onChange={(e) =>
                  setPost((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Description (1-2 sentences)
              </label>
              <textarea
                rows={2}
                value={post.description}
                onChange={(e) =>
                  setPost((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="A practical architectural breakdown for mobile engineers..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none resize-y"
              />
            </div>

            {/* Reading Time */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Reading Time
              </label>
              <input
                type="text"
                value={post.readingTime}
                onChange={(e) =>
                  setPost((prev) => ({ ...prev, readingTime: e.target.value }))
                }
                placeholder="5 min read"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Published Date */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Publication Date
              </label>
              <input
                type="date"
                value={post.date}
                onChange={(e) => {
                  const val = e.target.value;
                  const dateObj = new Date(val);
                  const label = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : val;
                  setPost((prev) => ({
                    ...prev,
                    date: val,
                    publishedLabel: label,
                  }));
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Android, Flutter, Kotlin, Clean Architecture"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Accent Color */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={post.accent || "#38bdf8"}
                  onChange={(e) =>
                    setPost((prev) => ({ ...prev, accent: e.target.value }))
                  }
                  className="h-10 w-12 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_ACCENTS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setPost((prev) => ({ ...prev, accent: color }))
                      }
                      className="h-6 w-6 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-mono tracking-wider text-foreground/60">
                Cover Image URL
              </label>
              <button
                type="button"
                onClick={handleGenerateCover}
                className="flex items-center gap-1 text-[11px] font-mono text-accent hover:underline cursor-pointer"
              >
                <Sparkles size={11} /> Auto-Generate Cover (AI)
              </button>
            </div>
            <input
              type="text"
              value={post.coverImage?.src || ""}
              onChange={(e) =>
                setPost((prev) => ({
                  ...prev,
                  coverImage: {
                    src: e.target.value,
                    alt: `${prev.title} cover`,
                    caption: prev.description,
                  },
                }))
              }
              placeholder="https://... or /blog/cover.jpg"
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
            />
            {post.coverImage?.src && (
              <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage.src}
                  alt={post.coverImage.alt || "Cover preview"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Blocks Section */}
        <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground/60">
                Content Blocks ({post.blocks.length})
              </h3>
              <p className="text-xs text-foreground/40 font-mono">
                Add, reorder, or edit structured paragraphs, headings, code, and quotes
              </p>
            </div>

            {/* Quick Add Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleAddBlock("paragraph")}
                className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <AlignLeft size={12} /> + Paragraph
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("heading")}
                className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <Heading size={12} /> + Heading
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("code")}
                className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <FileCode size={12} /> + Code
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("list")}
                className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <List size={12} /> + List
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock("quote")}
                className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-mono text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <Quote size={12} /> + Quote
              </button>
            </div>
          </div>

          {/* Blocks List */}
          <div className="space-y-4">
            {post.blocks.map((block, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-background/60 p-4 space-y-3 relative group"
              >
                {/* Block Controls Header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    #{index + 1} {block.type}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveBlock(index, "up")}
                      className="p-1 text-foreground/40 hover:text-foreground disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={index === post.blocks.length - 1}
                      onClick={() => handleMoveBlock(index, "down")}
                      className="p-1 text-foreground/40 hover:text-foreground disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(index)}
                      className="p-1 text-red-400/60 hover:text-red-400 cursor-pointer ml-2"
                      title="Remove block"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Block Editors */}
                {block.type === "paragraph" && (
                  <textarea
                    rows={3}
                    value={block.text}
                    onChange={(e) =>
                      handleUpdateBlock(index, {
                        type: "paragraph",
                        text: e.target.value,
                      })
                    }
                    placeholder="Enter paragraph text..."
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none resize-y"
                  />
                )}

                {block.type === "heading" && (
                  <input
                    type="text"
                    value={block.text}
                    onChange={(e) =>
                      handleUpdateBlock(index, {
                        type: "heading",
                        text: e.target.value,
                      })
                    }
                    placeholder="Section Heading..."
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm font-bold text-foreground focus:border-accent focus:outline-none"
                  />
                )}

                {block.type === "code" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-mono text-foreground/50">
                        Language:
                      </label>
                      <select
                        value={block.language}
                        onChange={(e) =>
                          handleUpdateBlock(index, {
                            ...block,
                            language: e.target.value,
                          })
                        }
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-mono text-foreground focus:outline-none"
                      >
                        <option value="kotlin">Kotlin</option>
                        <option value="dart">Dart</option>
                        <option value="typescript">TypeScript</option>
                        <option value="yaml">YAML</option>
                        <option value="bash">Shell / Bash</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                    <textarea
                      rows={5}
                      value={block.code}
                      onChange={(e) =>
                        handleUpdateBlock(index, {
                          ...block,
                          code: e.target.value,
                        })
                      }
                      placeholder="// Code here..."
                      className="w-full rounded-xl border border-border/70 bg-surface/80 p-3 font-mono text-xs text-foreground focus:border-accent focus:outline-none resize-y"
                    />
                  </div>
                )}

                {block.type === "list" && (
                  <div className="space-y-2">
                    {block.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <span className="text-accent">•</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newItems = [...block.items];
                            newItems[itemIdx] = e.target.value;
                            handleUpdateBlock(index, {
                              type: "list",
                              items: newItems,
                            });
                          }}
                          placeholder="List item..."
                          className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = block.items.filter(
                              (_, i) => i !== itemIdx
                            );
                            handleUpdateBlock(index, {
                              type: "list",
                              items: newItems,
                            });
                          }}
                          className="text-red-400/60 hover:text-red-400 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(index, {
                          type: "list",
                          items: [...block.items, ""],
                        })
                      }
                      className="text-xs text-accent font-mono hover:underline cursor-pointer"
                    >
                      + Add Item
                    </button>
                  </div>
                )}

                {block.type === "quote" && (
                  <textarea
                    rows={2}
                    value={block.text}
                    onChange={(e) =>
                      handleUpdateBlock(index, {
                        type: "quote",
                        text: e.target.value,
                      })
                    }
                    placeholder="Key architectural takeaway quote..."
                    className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-xs italic text-foreground focus:border-accent focus:outline-none resize-y"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* References Section */}
        <div className="rounded-3xl border border-border bg-surface/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground/60">
              External Documentation References
            </h3>
            <button
              type="button"
              onClick={() =>
                setPost((prev) => ({
                  ...prev,
                  references: [
                    ...(prev.references || []),
                    { label: "Documentation", href: "https://" },
                  ],
                }))
              }
              className="text-xs font-mono text-accent hover:underline cursor-pointer"
            >
              + Add Reference
            </button>
          </div>

          <div className="space-y-2">
            {(post.references || []).map((ref, refIdx) => (
              <div key={refIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ref.label}
                  onChange={(e) => {
                    const copy = [...(post.references || [])];
                    copy[refIdx] = { ...ref, label: e.target.value };
                    setPost((prev) => ({ ...prev, references: copy }));
                  }}
                  placeholder="Label (e.g. Android Developers Docs)"
                  className="w-1/3 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                <input
                  type="url"
                  value={ref.href}
                  onChange={(e) => {
                    const copy = [...(post.references || [])];
                    copy[refIdx] = { ...ref, href: e.target.value };
                    setPost((prev) => ({ ...prev, references: copy }));
                  }}
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const copy = (post.references || []).filter(
                      (_, i) => i !== refIdx
                    );
                    setPost((prev) => ({ ...prev, references: copy }));
                  }}
                  className="text-red-400/60 hover:text-red-400 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs sm:text-sm font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Publishing to GitHub..." : "Save & Publish Article"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
