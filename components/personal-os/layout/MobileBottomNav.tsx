"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BotIcon,
  ProjectsIcon,
  TasksIcon,
  MoreHorizontalIcon,
  SeoIcon,
  SettingsIcon,
  CalendarIcon,
  XIcon,
} from "../ui/icons";
import { Badge } from "../ui/Badge";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="h-16 bg-white dark:bg-[#18181B] border-t border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-around fixed bottom-0 left-0 right-0 z-40 select-none md:hidden pb-safe">
        {/* Home */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            isActive("/dashboard")
              ? "text-[#4338CA] dark:text-[#818CF8]"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <HomeIcon size={20} strokeWidth={isActive("/dashboard") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* AI Assistant */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg relative transition-colors ${
            isActive("/")
              ? "text-[#4338CA] dark:text-[#818CF8]"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <BotIcon size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-2" />
          <span className="text-[10px] font-medium">AI</span>
        </Link>

        {/* Projects */}
        <Link
          href="/projects"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            isActive("/projects")
              ? "text-[#4338CA] dark:text-[#818CF8]"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <ProjectsIcon size={20} strokeWidth={isActive("/projects") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Projects</span>
        </Link>

        {/* Tasks */}
        <Link
          href="/tasks"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            isActive("/tasks")
              ? "text-[#4338CA] dark:text-[#818CF8]"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <TasksIcon size={20} strokeWidth={isActive("/tasks") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Tasks</span>
        </Link>

        {/* More */}
        <button
          type="button"
          onClick={() => setShowMoreDrawer(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            isActive("/websites")
              ? "text-[#4338CA] dark:text-[#818CF8]"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <MoreHorizontalIcon size={20} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* More Sheet Drawer */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowMoreDrawer(false)}
          />
          <div className="relative bg-white dark:bg-[#18181B] border-t border-zinc-200 dark:border-zinc-800 rounded-t-2xl p-4 shadow-xl z-10 pb-safe">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-semibold text-sm">More Workspaces</span>
              <button
                type="button"
                onClick={() => setShowMoreDrawer(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className="py-3 space-y-1">
              <Link
                href="/websites"
                onClick={() => setShowMoreDrawer(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <SeoIcon size={18} className="text-emerald-600" />
                  <span>Websites & SEO</span>
                </div>
                <Badge variant="success">Active</Badge>
              </Link>
              <div className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-3">
                  <CalendarIcon size={18} />
                  <span>Calendar & Agenda</span>
                </div>
                <Badge variant="muted">v1.1</Badge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg text-sm text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-3">
                  <SettingsIcon size={18} />
                  <span>Preferences</span>
                </div>
                <Badge variant="muted">v1.1</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
