import React from "react";
import { Card } from "../ui/Card";
import { CalendarIcon, TasksIcon, ProjectsIcon, SparklesIcon } from "../ui/icons";

export interface DailyOverviewProps {
  eventsCount: number;
  pendingTasksCount: number;
  urgentTasksCount: number;
  activeProjectsCount: number;
  weeklyFocus?: string;
}

export function DailyOverview({
  eventsCount,
  pendingTasksCount,
  urgentTasksCount,
  activeProjectsCount,
  weeklyFocus = "Launch Personal OS V1 & Verify Agent Tooling",
}: DailyOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Events */}
      <Card className="p-3.5 sm:p-4">
        <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Today&apos;s Events</span>
          <CalendarIcon size={16} className="text-blue-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {eventsCount}
          </span>
          <span className="text-xs text-zinc-400">scheduled</span>
        </div>
      </Card>

      {/* Pending Tasks */}
      <Card className="p-3.5 sm:p-4">
        <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Pending Tasks</span>
          <TasksIcon size={16} className="text-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {pendingTasksCount}
          </span>
          {urgentTasksCount > 0 && (
            <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
              {urgentTasksCount} urgent
            </span>
          )}
        </div>
      </Card>

      {/* Active Projects */}
      <Card className="p-3.5 sm:p-4">
        <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Active Projects</span>
          <ProjectsIcon size={16} className="text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-zinc-900 dark:text-zinc-100">
            {activeProjectsCount}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">in progress</span>
        </div>
      </Card>

      {/* Weekly Focus */}
      <Card className="p-3.5 sm:p-4">
        <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider">Weekly Focus</span>
          <SparklesIcon size={16} className="text-indigo-500" />
        </div>
        <p className="text-xs sm:text-sm font-semibold line-clamp-2 text-zinc-800 dark:text-zinc-200" title={weeklyFocus}>
          {weeklyFocus}
        </p>
      </Card>
    </div>
  );
}
