"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { ProjectsIcon, BotIcon } from "../ui/icons";
import { Badge } from "../ui/Badge";
import type { PersonalProject } from "@/lib/personal-os/models/project";

export interface ActiveProjectsProps {
  projects: PersonalProject[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const router = useRouter();
  const displayProjects = projects.filter((p) => p.status === "active").slice(0, 4);

  const handleOpenAgent = (project: PersonalProject) => {
    // If project has cwd, navigate to /?cwd=...
    if (project.cwd) {
      router.push(`/?cwd=${encodeURIComponent(project.cwd)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ProjectsIcon size={16} className="text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Active Projects
          </h2>
        </div>
        <Link
          href="/projects"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all ({projects.length}) →
        </Link>
      </CardHeader>
      <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col justify-between space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {project.name}
                </span>
                <Badge variant="primary" size="sm">
                  {project.category}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                {project.description}
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1">
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

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/projects"
                className="flex-1 text-center py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition-colors"
              >
                View Project
              </Link>
              <button
                type="button"
                onClick={() => handleOpenAgent(project)}
                className="flex items-center justify-center gap-1 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                title="Launch Pi Agent session"
              >
                <BotIcon size={12} />
                <span>Agent</span>
              </button>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
