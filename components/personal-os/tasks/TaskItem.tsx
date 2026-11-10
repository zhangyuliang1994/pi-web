"use client";

import React from "react";
import { PriorityBadge } from "../ui/Badge";
import { ProjectsIcon, CalendarIcon } from "../ui/icons";
import type { PersonalTask } from "@/lib/personal-os/models/task";
import { formatRelativeDueDate } from "@/lib/personal-os/utils/date";

export interface TaskItemProps {
  task: PersonalTask;
  onToggleComplete: (id: string) => void;
  onSelectTask: (task: PersonalTask) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onSelectTask,
}: TaskItemProps) {
  return (
    <div
      onClick={() => onSelectTask(task)}
      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer shadow-2xs space-y-2.5 ${
        task.completed
          ? "bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/50 opacity-65"
          : "bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 cursor-pointer mt-0.5 flex-shrink-0"
          />
          <div className="min-w-0">
            <h3
              className={`text-xs sm:text-sm font-semibold truncate ${
                task.completed
                  ? "line-through text-zinc-400 dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 font-mono">
        {task.projectName && (
          <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
            <ProjectsIcon size={12} />
            <span className="truncate max-w-[120px]">{task.projectName}</span>
          </span>
        )}

        {task.dueDate && (
          <span className="flex items-center gap-1">
            <CalendarIcon size={12} />
            <span>{formatRelativeDueDate(task.dueDate)}</span>
          </span>
        )}

        {task.tags && task.tags.length > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>#{task.tags[0]}</span>
            {task.tags.length > 1 && <span>+{task.tags.length - 1}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
