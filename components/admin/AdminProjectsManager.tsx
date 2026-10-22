"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  X,
} from "lucide-react";
import type { Project, ProjectLink } from "@/lib/projects";

interface AdminProjectsManagerProps {
  initialProjects: Project[];
  onSaveProjects: (projects: Project[]) => Promise<boolean>;
  hasGithubToken: boolean;
  onOpenSettings: () => void;
}

export default function AdminProjectsManager({
  initialProjects,
  onSaveProjects,
  hasGithubToken,
  onOpenSettings,
}: AdminProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= projects.length) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setProjects(copy);
  };

  const handleDelete = (index: number) => {
    if (confirm(`Remove project "${projects[index].title}"?`)) {
      setProjects((prev) => prev.filter((_, i) => i !== index));
      if (editingIndex === index) setEditingIndex(null);
    }
  };

  const handleAddNew = () => {
    const newProj: Project = {
      id: `new-project-${Date.now()}`,
      kind: "Flutter App",
      title: "New Featured Project",
      description: "A high-performance mobile application...",
      tags: ["Flutter", "Cross-Platform", "Dart"],
      color: "#10b981",
      wide: false,
      links: [
        {
          label: "Play Store",
          href: "https://play.google.com/store/apps/details?id=...",
        },
      ],
    };
    setProjects((prev) => [...prev, newProj]);
    setEditingIndex(projects.length);
  };

  const handleUpdateProject = (index: number, updated: Project) => {
    setProjects((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const ok = await onSaveProjects(projects);
      if (ok) {
        setStatus({
          type: "success",
          message: "Projects committed and published to GitHub successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to save projects to GitHub. Check your PAT token.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Error saving projects.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Portfolio Projects Manager
          </h2>
          <p className="text-xs sm:text-sm text-foreground/60 font-mono">
            {projects.length} featured apps and platforms shown on the homepage
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Project</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent/20 disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? "Saving..." : "Save to GitHub"}</span>
          </button>
        </div>
      </div>

      {!hasGithubToken && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 font-mono flex items-center justify-between gap-3">
          <span>
            GitHub Token missing. Saving requires a GitHub PAT in Settings.
          </span>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1 bg-amber-400 text-black font-semibold rounded-lg hover:opacity-90 shrink-0 cursor-pointer"
          >
            Add PAT
          </button>
        </div>
      )}

      {status && (
        <div
          className={`rounded-2xl border p-4 text-xs font-mono flex items-center gap-2 ${
            status.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => {
          const isEditing = editingIndex === index;

          return (
            <div
              key={project.id || index}
              className="rounded-2xl border border-border bg-surface/30 p-5 backdrop-blur-sm transition-all"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: project.color,
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-foreground/40 font-bold">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-foreground/50">
                        {project.kind}
                      </span>
                      {project.wide && (
                        <span className="rounded-full bg-accent/10 text-accent text-[10px] font-mono px-2 py-0.5 border border-accent/20">
                          Wide Card
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 text-foreground/40 hover:text-foreground disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === projects.length - 1}
                    className="p-1.5 text-foreground/40 hover:text-foreground disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setEditingIndex(isEditing ? null : index)
                    }
                    className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-foreground/70 hover:text-foreground cursor-pointer ml-2"
                  >
                    <Edit2 size={12} />
                    <span>{isEditing ? "Close" : "Edit"}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1.5 text-red-400/60 hover:text-red-400 cursor-pointer ml-1"
                    title="Remove project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Collapsible Edit Form */}
              {isEditing ? (
                <div className="mt-5 pt-5 border-t border-border/60 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-foreground/60">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          handleUpdateProject(index, {
                            ...project,
                            title: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-foreground/60">
                        Category / Kind
                      </label>
                      <input
                        type="text"
                        value={project.kind}
                        onChange={(e) =>
                          handleUpdateProject(index, {
                            ...project,
                            kind: e.target.value,
                          })
                        }
                        placeholder="Flutter App, Tablet App, etc."
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-mono text-foreground/60">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={project.description}
                        onChange={(e) =>
                          handleUpdateProject(index, {
                            ...project,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none resize-y"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-foreground/60">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={project.tags.join(", ")}
                        onChange={(e) =>
                          handleUpdateProject(index, {
                            ...project,
                            tags: e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-foreground/60">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={project.color}
                          onChange={(e) =>
                            handleUpdateProject(index, {
                              ...project,
                              color: e.target.value,
                            })
                          }
                          className="h-9 w-12 rounded-lg border border-border bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono text-foreground/50">
                          {project.color}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wide toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      id={`wide-${index}`}
                      type="checkbox"
                      checked={Boolean(project.wide)}
                      onChange={(e) =>
                        handleUpdateProject(index, {
                          ...project,
                          wide: e.target.checked,
                        })
                      }
                      className="rounded border-border accent-accent h-4 w-4"
                    />
                    <label
                      htmlFor={`wide-${index}`}
                      className="text-xs font-mono text-foreground/70 cursor-pointer"
                    >
                      Make this a Wide 2-Column Featured Card on Desktop
                    </label>
                  </div>

                  {/* Links */}
                  <div className="space-y-2 border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-foreground/60">
                        Store / Web Links
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateProject(index, {
                            ...project,
                            links: [
                              ...project.links,
                              { label: "Website", href: "https://" },
                            ],
                          })
                        }
                        className="text-[11px] font-mono text-accent hover:underline cursor-pointer"
                      >
                        + Add Link
                      </button>
                    </div>

                    {project.links.map((link, linkIdx) => (
                      <div key={linkIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...project.links];
                            newLinks[linkIdx] = {
                              ...link,
                              label: e.target.value,
                            };
                            handleUpdateProject(index, {
                              ...project,
                              links: newLinks,
                            });
                          }}
                          placeholder="Label (e.g. Play Store)"
                          className="w-1/3 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                        <input
                          type="url"
                          value={link.href}
                          onChange={(e) => {
                            const newLinks = [...project.links];
                            newLinks[linkIdx] = {
                              ...link,
                              href: e.target.value,
                            };
                            handleUpdateProject(index, {
                              ...project,
                              links: newLinks,
                            });
                          }}
                          placeholder="https://..."
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks = project.links.filter(
                              (_, i) => i !== linkIdx
                            );
                            handleUpdateProject(index, {
                              ...project,
                              links: newLinks,
                            });
                          }}
                          className="text-red-400/60 hover:text-red-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <p className="text-xs sm:text-sm text-foreground/60 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border/50 bg-surface px-2 py-0.5 text-[11px] font-mono text-foreground/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
