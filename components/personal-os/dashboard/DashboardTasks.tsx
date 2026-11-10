"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { TasksIcon } from "../ui/icons";
import { PriorityBadge } from "../ui/Badge";
import type { PersonalTask } from "@/lib/personal-os/models/task";
import { formatRelativeDueDate } from "@/lib/personal-os/utils/date";

export interface DashboardTasksProps {
  tasks: PersonalTask[];
  onToggleComplete: (id: string) => void;
}

export function DashboardTasks({ tasks, onToggleComplete }: DashboardTasksProps) {
  // Show up to 4 priority tasks
  const displayTasks = tasks.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TasksIcon size={16} className="text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            My Tasks
          </h2>
        </div>
        <Link
          href="/tasks"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all tasks →
        </Link>
      </CardHeader>
      <CardBody className="space-y-2.5">
        {displayTasks.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">No pending tasks for today.</p>
        ) : (
          displayTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                task.completed
                  ? "bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/50 opacity-60"
                  : "bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-medium truncate ${
                      task.completed
                        ? "line-through text-zinc-400 dark:text-zinc-500"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {task.title}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                  {task.projectName && (
                    <span className="truncate max-w-[120px]">{task.projectName}</span>
                  )}
                  {task.dueDate && (
                    <>
                      <span>•</span>
                      <span>{formatRelativeDueDate(task.dueDate)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}
