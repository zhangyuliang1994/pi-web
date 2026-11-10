"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "../ui/Drawer";
import { Badge, PriorityBadge } from "../ui/Badge";
import { GitHubIcon, BotIcon, TasksIcon } from "../ui/icons";
import type { PersonalProject } from "@/lib/personal-os/models/project";
import type { PersonalTask } from "@/lib/personal-os/models/task";

export interface ProjectDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: PersonalProject | null;
  tasks: PersonalTask[];
  onToggleTaskComplete?: (taskId: string) => void;
}

export function ProjectDetailDrawer({
  isOpen,
  onClose,
  project,
  tasks,
  onToggleTaskComplete,
}: ProjectDetailDrawerProps) {
  const router = useRouter();

  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  const handleOpenAgent = () => {
    onClose();
    if (project.cwd) {
      router.push(`/?cwd=${encodeURIComponent(project.cwd)}`);
    } else {
      router.push("/");
    }
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
      title={project.name}
      description={`Managed ${project.category} workspace`}
      width="lg"
    >
      <div className="space-y-6">
        {/* Status & Actions Header */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <button
            type="button"
            onClick={handleOpenAgent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity"
          >
            <BotIcon size={14} />
            <span>Open Agent</span>
          </button>
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
      </div>
    </Drawer>
  );
}
