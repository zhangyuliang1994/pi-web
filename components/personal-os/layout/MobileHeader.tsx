"use client";

import React from "react";
import Link from "next/link";
import { TerminalIcon, SearchIcon, SunIcon, MoonIcon } from "../ui/icons";
import { useTheme } from "@/hooks/useTheme";

export interface MobileHeaderProps {
  onOpenSearch?: () => void;
}

export function MobileHeader({ onOpenSearch }: MobileHeaderProps) {
  const { isDark, setThemePreference } = useTheme();

  const toggleTheme = () => {
    setThemePreference(isDark ? "light" : "dark");
  };

  return (
    <header className="h-14 bg-white dark:bg-[#18181B] border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-30 md:hidden flex-shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-[#4338CA] dark:bg-[#6366F1] text-white flex items-center justify-center font-bold shadow-xs">
          <TerminalIcon size={16} />
        </div>
        <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
          Personal OS
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
          title="Toggle theme"
        >
          {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </button>
        {onOpenSearch && (
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
            title="Search"
          >
            <SearchIcon size={16} />
          </button>
        )}
        <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
          AL
        </div>
      </div>
    </header>
  );
}
