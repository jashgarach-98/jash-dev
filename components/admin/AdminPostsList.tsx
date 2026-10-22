"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Calendar,
  Clock,
  Tag,
  Sparkles,
} from "lucide-react";
import type { Post } from "@/lib/posts";

interface AdminPostsListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onPreview: (post: Post) => void;
  onCreateNew: () => void;
  onOpenAi: () => void;
  onDelete: (slug: string) => Promise<void>;
  loading: boolean;
}

export default function AdminPostsList({
  posts,
  onEdit,
  onPreview,
  onCreateNew,
  onOpenAi,
  onDelete,
  loading,
}: AdminPostsListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, selectedCategory]);

  const handleDeleteClick = async (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This will remove it from posts.json and the blog.`)) {
      setDeletingSlug(slug);
      try {
        await onDelete(slug);
      } finally {
        setDeletingSlug(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-xs sm:text-sm text-foreground/60 font-mono">
            {posts.length} technical articles published across {categories.length - 1} categories
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenAi}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-accent hover:bg-accent/20 transition-colors cursor-pointer"
          >
            <Sparkles size={15} />
            <span>AI Generate</span>
          </button>

          <button
            onClick={onCreateNew}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent/20"
          >
            <Plus size={16} />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, tag, or topic..."
            className="w-full rounded-xl border border-border bg-surface/50 pl-10 pr-4 py-2 text-xs sm:text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-accent text-black font-semibold"
                  : "border border-border bg-surface/40 text-foreground/60 hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-foreground/50 font-mono">
            No articles match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="group relative rounded-2xl border border-border bg-surface/40 hover:border-border/80 transition-all p-5 backdrop-blur-sm"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: post.accent || "#38bdf8",
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-foreground/50">
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{
                        background: `${post.accent}20`,
                        color: post.accent,
                      }}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.publishedLabel || post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readingTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground hover:text-accent transition-colors line-clamp-1">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground/60 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-[11px] font-mono text-foreground/50 border border-border/50"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-border/50 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => onPreview(post)}
                    className="flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-surface/80 transition-colors cursor-pointer"
                    title="Live Preview"
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => onEdit(post)}
                    className="flex items-center gap-1 rounded-xl border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors cursor-pointer"
                    title="Edit Article"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      const duplicated: Post = {
                        ...post,
                        slug: `${post.slug}-copy`,
                        title: `${post.title} (Draft)`,
                      };
                      onEdit(duplicated);
                    }}
                    className="flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                    title="Duplicate Post"
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    disabled={loading || deletingSlug === post.slug}
                    onClick={() => handleDeleteClick(post.slug, post.title)}
                    className="flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                    title="Delete Post"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
