"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "../ui/Drawer";
import { Badge, PriorityBadge } from "../ui/Badge";
import { GitHubIcon, BotIcon, TasksIcon, EditIcon, TrashIcon, SyncIcon } from "../ui/icons";
import { getEffectiveProjectCwd } from "@/lib/personal-os/storage/storage";
import type { PersonalProject, ProjectCategory, ProjectStatus } from "@/lib/personal-os/models/project";
import type { PersonalTask } from "@/lib/personal-os/models/task";

export interface ProjectDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: PersonalProject | null;
  tasks: PersonalTask[];
  onToggleTaskComplete?: (taskId: string) => void;
  onUpdateProject?: (id: string, updates: Partial<PersonalProject>) => void;
  onDeleteProject?: (id: string, options: { deleteTasks?: boolean }) => void;
}

export function ProjectDetailDrawer({
  isOpen,
  onClose,
  project,
  tasks,
  onToggleTaskComplete,
  onUpdateProject,
  onDeleteProject,
}: ProjectDetailDrawerProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteOption, setDeleteOption] = useState<"unassign" | "cascade">("unassign");
  const [validatingCwd, setValidatingCwd] = useState(false);
  const [cwdError, setCwdError] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<ProjectCategory>("software");
  const [editStatus, setEditStatus] = useState<ProjectStatus>("active");
  const [editProgress, setEditProgress] = useState(0);
  const [editGithubUrl, setEditGithubUrl] = useState("");
  const [editWebsiteUrl, setEditWebsiteUrl] = useState("");
  const [editCwd, setEditCwd] = useState("");
  const [editTags, setEditTags] = useState("");

  useEffect(() => {
    if (project) {
      setEditName(project.name);
      setEditDescription(project.description);
      setEditCategory(project.category);
      setEditStatus(project.status);
      setEditProgress(project.progress);
      setEditGithubUrl(project.githubUrl || "");
      setEditWebsiteUrl(project.websiteUrl || "");
      setEditCwd(project.cwd || "");
      setEditTags(project.tags ? project.tags.join(", ") : "");
      setCwdError(null);
      setIsEditing(false);
      setIsConfirmingDelete(false);
    }
  }, [project, isOpen]);

  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  const handleOpenAgent = async () => {
    setCwdError(null);
    const effectiveCwd = editCwd.trim() || getEffectiveProjectCwd(project);
    if (!effectiveCwd) {
      onClose();
      router.push("/");
      return;
    }

    setValidatingCwd(true);
    try {
      const res = await fetch("/api/cwd/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cwd: effectiveCwd }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCwdError(data.error || `Directory does not exist: ${effectiveCwd}`);
        setValidatingCwd(false);
        return;
      }
      onClose();
      router.push(`/?cwd=${encodeURIComponent(data.cwd)}`);
    } catch (err) {
      setCwdError(`Failed to validate directory: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setValidatingCwd(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const parsedTags = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onUpdateProject?.(project.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      category: editCategory,
      status: editStatus,
      progress: Math.min(100, Math.max(0, editProgress)),
      githubUrl: editGithubUrl.trim() || undefined,
      websiteUrl: editWebsiteUrl.trim() || undefined,
      cwd: editCwd.trim() || undefined,
      tags: parsedTags,
    });

    setIsEditing(false);
    setCwdError(null);
  };

  const handleConfirmDelete = () => {
    onDeleteProject?.(project.id, { deleteTasks: deleteOption === "cascade" });
    setIsConfirmingDelete(false);
    onClose();
  };

  const getStatusBadgeVariant = (status: PersonalProject["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "planning":
        return "primary";
      case "paused":
        return "warning";
      case "completed":
        return "muted";
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Project" : project.name}
      description={isEditing ? "Update project details, links, and workspace" : `Managed ${project.category} workspace`}
      width="lg"
    >
      <div className="space-y-6">
        {/* Error notification for CWD */}
        {cwdError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <span>⚠️</span>
              <span>Workspace Directory Invalid</span>
            </div>
            <p className="font-mono text-[11px] break-all">{cwdError}</p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Click here to edit CWD path →
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation View */}
        {isConfirmingDelete ? (
          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Delete Project &ldquo;{project.name}&rdquo;?
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                This project has {projectTasks.length} associated task(s). Choose what happens to these tasks:
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700">
                <input
                  type="radio"
                  name="delete-tasks-opt"
                  value="unassign"
                  checked={deleteOption === "unassign"}
                  onChange={() => setDeleteOption("unassign")}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Keep tasks and unassign them (Recommended)
                  </span>
                  <p className="text-zinc-500 text-[11px]">
                    Tasks will remain in your workspace without project affiliation.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer p-2 rounded bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700">
                <input
                  type="radio"
                  name="delete-tasks-opt"
                  value="cascade"
                  checked={deleteOption === "cascade"}
                  onChange={() => setDeleteOption("cascade")}
                  className="mt-0.5 text-rose-600"
                />
                <div>
                  <span className="font-semibold text-rose-700 dark:text-rose-300">
                    Delete all {projectTasks.length} associated task(s) as well
                  </span>
                  <p className="text-zinc-500 text-[11px]">
                    Permanently removes all tasks linked to this project.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-2xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        ) : isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="software">Software</option>
                  <option value="website">Websites &amp; SEO</option>
                  <option value="personal">Personal</option>
                  <option value="research">Research</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="active">Active</option>
                  <option value="planning">Planning</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                <span>Progress: {editProgress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={editProgress}
                onChange={(e) => setEditProgress(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Local Pi Agent Working Directory (CWD)
              </label>
              <input
                type="text"
                placeholder="/Users/username/code/repo"
                value={editCwd}
                onChange={(e) => setEditCwd(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/owner/repo"
                value={editGithubUrl}
                onChange={(e) => setEditGithubUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Website URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={editWebsiteUrl}
                onChange={(e) => setEditWebsiteUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Next.js, Agent, TypeScript"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-semibold hover:opacity-95 shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* View Details */
          <>
            {/* Status & Actions Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{project.category}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  title="Edit Project"
                >
                  <EditIcon size={13} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-100/60 dark:hover:bg-rose-950/60 transition-colors"
                  title="Delete Project"
                >
                  <TrashIcon size={13} />
                  <span>Delete</span>
                </button>

                <button
                  type="button"
                  disabled={validatingCwd}
                  onClick={handleOpenAgent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity disabled:opacity-50"
                >
                  {validatingCwd ? (
                    <SyncIcon size={14} className="animate-spin" />
                  ) : (
                    <BotIcon size={14} />
                  )}
                  <span>Open Agent</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Overview
              </h4>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1 font-mono">
                <span>Overall Progress</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{project.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Links & Paths */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Resources &amp; Paths
              </h4>
              <div className="space-y-2 text-xs">
                {project.cwd && (
                  <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <span className="text-zinc-400">CWD:</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-[280px]">
                      {project.cwd}
                    </span>
                  </div>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between hover:border-zinc-400 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GitHubIcon size={14} />
                      <span>GitHub Repository</span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">↗</span>
                  </a>
                )}
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between hover:border-zinc-400 transition-colors"
                  >
                    <span>Live Website</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Tags &amp; Tech Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="muted" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Tasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <TasksIcon size={14} />
                  <span>Project Tasks ({projectTasks.length})</span>
                </h4>
              </div>

              {projectTasks.length === 0 ? (
                <p className="text-xs text-zinc-400 py-3 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                  No tasks linked to this project yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {projectTasks.map((t) => (
                    <li
                      key={t.id}
                      className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => onToggleTaskComplete?.(t.id)}
                          className="mt-0.5 w-3.5 h-3.5 rounded text-indigo-600 cursor-pointer"
                        />
                        <span
                          className={`text-xs ${
                            t.completed
                              ? "line-through text-zinc-400"
                              : "text-zinc-800 dark:text-zinc-200"
                          } truncate`}
                        >
                          {t.title}
                        </span>
                      </div>
                      <PriorityBadge priority={t.priority} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
