"use client";

import { useState, useEffect } from "react";
import type { Post } from "@/lib/posts";
import type { Project } from "@/lib/projects";
import {
  getStoredAdminConfig,
  saveAdminConfig,
  logoutAdmin,
  type AdminConfig,
} from "@/lib/admin-auth";
import { commitFileToRepo } from "@/lib/github";
import AdminLogin from "./AdminLogin";
import AdminHeader, { type AdminTab } from "./AdminHeader";
import AdminPostsList from "./AdminPostsList";
import AdminPostEditor from "./AdminPostEditor";
import AdminAiGenerator from "./AdminAiGenerator";
import AdminProjectsManager from "./AdminProjectsManager";
import AdminSettings from "./AdminSettings";
import PostArticle from "@/components/blog/PostArticle";

interface AdminDashboardProps {
  initialPosts: Post[];
  initialProjects: Project[];
}

export default function AdminDashboard({
  initialPosts,
  initialProjects,
}: AdminDashboardProps) {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("posts");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [previewingPost, setPreviewingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  // Load session from browser storage
  useEffect(() => {
    setConfig(getStoredAdminConfig());
  }, []);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!config.isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          setConfig(getStoredAdminConfig());
        }}
      />
    );
  }

  // Handle saving an article
  const handleSavePost = async (post: Post): Promise<boolean> => {
    // 1. Update in local state
    const existingIndex = posts.findIndex((p) => p.slug === post.slug);
    let updatedPosts: Post[];
    if (existingIndex >= 0) {
      updatedPosts = [...posts];
      updatedPosts[existingIndex] = post;
    } else {
      updatedPosts = [post, ...posts];
    }
    setPosts(updatedPosts);

    // 2. If GitHub token is provided, commit to GitHub
    if (config.githubToken) {
      const postsJsonStr = JSON.stringify(updatedPosts, null, 2);
      const postSlugJsonStr = JSON.stringify(post, null, 2);

      const commit1 = await commitFileToRepo(
        config.githubToken,
        "data/posts.json",
        postsJsonStr,
        `chore(blog): update ${post.slug} in posts.json`
      );

      const commit2 = await commitFileToRepo(
        config.githubToken,
        `content/posts/${post.slug}.json`,
        postSlugJsonStr,
        `chore(blog): write ${post.slug}.json content`
      );

      return commit1.success && commit2.success;
    }

    return true;
  };

  // Handle deleting an article
  const handleDeletePost = async (slug: string) => {
    setLoading(true);
    const updated = posts.filter((p) => p.slug !== slug);
    setPosts(updated);

    if (config.githubToken) {
      const postsJsonStr = JSON.stringify(updated, null, 2);
      await commitFileToRepo(
        config.githubToken,
        "data/posts.json",
        postsJsonStr,
        `chore(blog): delete ${slug} from posts.json`
      );
    }
    setLoading(false);
  };

  // Handle saving projects
  const handleSaveProjects = async (
    updatedProjects: Project[]
  ): Promise<boolean> => {
    setProjects(updatedProjects);
    if (config.githubToken) {
      const jsonStr = JSON.stringify(updatedProjects, null, 2);
      const res = await commitFileToRepo(
        config.githubToken,
        "data/projects.json",
        jsonStr,
        "chore(portfolio): update featured projects"
      );
      return res.success;
    }
    return true;
  };

  const handleLogout = () => {
    logoutAdmin();
    setConfig({
      isAuthenticated: false,
      githubToken: "",
      geminiApiKey: "",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "editor" && activeTab !== "editor") {
            setEditingPost(null);
          }
          setActiveTab(tab);
        }}
        hasGithubToken={Boolean(config.githubToken)}
        onLogout={handleLogout}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* All Posts View */}
        {activeTab === "posts" && (
          <AdminPostsList
            posts={posts}
            onEdit={(post) => {
              setEditingPost(post);
              setActiveTab("editor");
            }}
            onPreview={(post) => setPreviewingPost(post)}
            onCreateNew={() => {
              setEditingPost(null);
              setActiveTab("editor");
            }}
            onOpenAi={() => setActiveTab("ai")}
            onDelete={handleDeletePost}
            loading={loading}
          />
        )}

        {/* Post Editor View */}
        {activeTab === "editor" && (
          <AdminPostEditor
            initialPost={editingPost}
            onSave={handleSavePost}
            onCancel={() => {
              setEditingPost(null);
              setActiveTab("posts");
            }}
            hasGithubToken={Boolean(config.githubToken)}
            onOpenSettings={() => setActiveTab("settings")}
          />
        )}

        {/* AI Generator View */}
        {activeTab === "ai" && (
          <AdminAiGenerator
            geminiApiKey={config.geminiApiKey}
            onUpdateGeminiKey={(key) => {
              const updated = saveAdminConfig({ geminiApiKey: key });
              setConfig(updated);
            }}
            onPostGenerated={(generated) => {
              setEditingPost(generated);
              setActiveTab("editor");
            }}
            existingSlugs={posts.map((p) => p.slug)}
          />
        )}

        {/* Projects View */}
        {activeTab === "projects" && (
          <AdminProjectsManager
            initialProjects={projects}
            onSaveProjects={handleSaveProjects}
            hasGithubToken={Boolean(config.githubToken)}
            onOpenSettings={() => setActiveTab("settings")}
          />
        )}

        {/* Settings View */}
        {activeTab === "settings" && (
          <AdminSettings
            githubToken={config.githubToken}
            geminiApiKey={config.geminiApiKey}
            onSaveTokens={(tokens) => {
              const updated = saveAdminConfig(tokens);
              setConfig(updated);
            }}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Global Preview Modal */}
      {previewingPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/90 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-surface/90 p-6 md:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewingPost(null)}
              className="sticky top-0 float-right -mt-2 -mr-2 z-10 rounded-xl bg-background border border-border px-3 py-1.5 text-xs font-mono text-foreground/70 hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
            >
              Close [ESC]
            </button>
            <div className="clear-both pt-2">
              <PostArticle post={previewingPost} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
