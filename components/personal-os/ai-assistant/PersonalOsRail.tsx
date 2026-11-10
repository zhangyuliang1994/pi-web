"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TerminalIcon,
  HomeIcon,
  BotIcon,
  ProjectsIcon,
  TasksIcon,
  SeoIcon,
  SunIcon,
  MoonIcon,
  SlidersIcon,
} from "../ui/icons";
import { useTheme } from "@/hooks/useTheme";

export interface PersonalOsRailProps {
  onOpenEnvironment?: () => void;
}

export function PersonalOsRail({ onOpenEnvironment }: PersonalOsRailProps) {
  const pathname = usePathname();
  const { isDark, setThemePreference } = useTheme();

  const toggleTheme = () => {
    setThemePreference(isDark ? "light" : "dark");
  };

  const isAiActive = pathname === "/";

  return (
    <aside className="hidden md:flex flex-col justify-between items-center w-14 flex-shrink-0 bg-white dark:bg-[#18181B] border-r border-zinc-200 dark:border-zinc-800 py-3 select-none z-30">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Brand Icon */}
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] flex items-center justify-center text-white shadow-xs hover:opacity-90 transition-opacity"
          title="Personal OS Home Dashboard (⌘1)"
        >
          <TerminalIcon size={16} />
        </Link>

        {/* Global Navigation Icons */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2">
          {/* Home */}
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Home Dashboard (⌘1)"
          >
            <HomeIcon size={18} />
          </Link>

          {/* AI Assistant (Active) */}
          <Link
            href="/"
            className={`w-9 h-9 rounded-lg flex items-center justify-center relative transition-colors ${
              isAiActive
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#4338CA] dark:text-[#818CF8]"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="AI Assistant / Pi Coding Agent (⌘2)"
          >
            <BotIcon size={18} strokeWidth={isAiActive ? 2.5 : 2} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
          </Link>

          {/* Projects */}
          <Link
            href="/projects"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Projects Hub (⌘3)"
          >
            <ProjectsIcon size={18} />
          </Link>

          {/* Tasks */}
          <Link
            href="/tasks"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Tasks Management (⌘4)"
          >
            <TasksIcon size={18} />
          </Link>

          {/* Websites & SEO */}
          <Link
            href="/websites"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Websites & SEO Analytics"
          >
            <SeoIcon size={18} />
          </Link>
        </nav>
      </div>

      {/* Bottom Actions: Environment Drawer, Theme Toggle, Avatar */}
      <div className="flex flex-col items-center gap-2">
        {onOpenEnvironment && (
          <button
            type="button"
            onClick={onOpenEnvironment}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Agent Environment & Status"
          >
            <SlidersIcon size={18} />
          </button>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
          {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>

        <div
          className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold mt-1"
          title="Demo User: Alex Lin"
        >
          AL
        </div>
      </div>
    </aside>
  );
}
