"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  HomeIcon,
  BotIcon,
  ProjectsIcon,
  TasksIcon,
  SeoIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
} from "../ui/icons";
import { useTheme } from "@/hooks/useTheme";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickNewTask?: () => void;
}

export function CommandPalette({ isOpen, onClose, onQuickNewTask }: CommandPaletteProps) {
  const router = useRouter();
  const { isDark, setThemePreference } = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent, but if pressed while open, toggle
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const commands = [
    { label: "Go to Home Dashboard", category: "Navigation", icon: HomeIcon, action: () => navigateTo("/dashboard"), shortcut: "⌘1" },
    { label: "Open AI Assistant (Pi Agent)", category: "Navigation", icon: BotIcon, action: () => navigateTo("/"), shortcut: "⌘2" },
    { label: "Browse Projects", category: "Navigation", icon: ProjectsIcon, action: () => navigateTo("/projects"), shortcut: "⌘3" },
    { label: "Manage Tasks", category: "Navigation", icon: TasksIcon, action: () => navigateTo("/tasks"), shortcut: "⌘4" },
    { label: "View Websites & SEO Analytics", category: "Navigation", icon: SeoIcon, action: () => navigateTo("/websites") },
    {
      label: "Toggle Theme (Light / Dark)",
      category: "Preferences",
      icon: isDark ? SunIcon : MoonIcon,
      action: () => {
        setThemePreference(isDark ? "light" : "dark");
        onClose();
      },
    },
  ];

  if (onQuickNewTask) {
    commands.unshift({
      label: "Create New Task",
      category: "Actions",
      icon: PlusIcon,
      action: () => {
        onClose();
        onQuickNewTask();
      },
      shortcut: "N",
    });
  }

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 text-zinc-900 dark:text-zinc-100">
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
          <SearchIcon size={18} className="text-zinc-400" />
          <input
            type="text"
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full px-3 py-3.5 bg-transparent text-sm focus:outline-none placeholder:text-zinc-400"
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400">No results found for &ldquo;{query}&rdquo;</div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className="text-zinc-500 dark:text-zinc-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-400">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
