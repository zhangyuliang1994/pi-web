"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { BotIcon } from "../ui/icons";
import type { PersonalProject } from "@/lib/personal-os/models/project";

export interface ProjectCardProps {
  project: PersonalProject;
  viewMode: "grid" | "list";
  onViewDetails: (project: PersonalProject) => void;
}

export function ProjectCard({
  project,
  viewMode,
  onViewDetails,
}: ProjectCardProps) {
  const router = useRouter();

  const handleOpenAgent = () => {
    if (project.cwd) {
      router.push(`/?cwd=${encodeURIComponent(project.cwd)}`);
    } else {
      router.push("/");
    }
  };

  const getStatusDot = (status: PersonalProject["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "planning":
        return "bg-blue-500";
      case "paused":
        return "bg-amber-500";
      case "completed":
        return "bg-zinc-400";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(project.status)}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {project.name}
              </h3>
              <Badge variant="outline" size="sm">{project.category}</Badge>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-md mt-0.5">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
          <div className="w-24 hidden md:block">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1">
              <span>{project.progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(project)}
              className="px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              View Project
            </button>
            <button
              type="button"
              onClick={handleOpenAgent}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity"
            >
              <BotIcon size={14} />
              <span>Open Agent</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (matching Stitch Project Card)
  return (
    <Card className="p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant="primary" size="sm">
            {project.category}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(project.status)}`} />
            <span className="capitalize">{project.status}</span>
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
          {project.name}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewDetails(project)}
            className="w-full py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-center"
          >
            View Project
          </button>
          <button
            type="button"
            onClick={handleOpenAgent}
            className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity text-center"
          >
            <BotIcon size={14} />
            <span>Open Agent</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
