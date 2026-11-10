"use client";

import React, { useState, useEffect } from "react";
import { getGreeting, formatHeaderDate } from "@/lib/personal-os/utils/date";
import { SlidersIcon } from "../ui/icons";

export interface WelcomeHeaderProps {
  pendingTasksCount: number;
  activeProjectsCount: number;
  onCustomizeClick: () => void;
}

export function WelcomeHeader({
  pendingTasksCount,
  activeProjectsCount,
  onCustomizeClick,
}: WelcomeHeaderProps) {
  const [greeting, setGreeting] = useState("Good day");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setDateStr(formatHeaderDate());
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {greeting}, Alex.
          </h1>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="System operational" />
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {dateStr || "Today"} • {pendingTasksCount} pending tasks • {activeProjectsCount} active projects
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCustomizeClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-2xs transition-colors"
        >
          <SlidersIcon size={14} />
          <span>Customize Dashboard</span>
        </button>
      </div>
    </div>
  );
}
