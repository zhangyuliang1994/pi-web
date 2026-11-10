"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, BotIcon, CalendarIcon, SparklesIcon } from "../ui/icons";
import { addStoredTask } from "@/lib/personal-os/storage/storage";
import { getTodayDateString } from "@/lib/personal-os/utils/date";

export interface QuickCaptureProps {
  onTaskCreated?: () => void;
}

export function QuickCapture({ onTaskCreated }: QuickCaptureProps) {
  const router = useRouter();
  const [taskInput, setTaskInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    addStoredTask({
      title: taskInput.trim(),
      completed: false,
      priority: 2,
      dueDate: getTodayDateString(),
      tags: ["Quick Capture"],
    });

    setTaskInput("");
    setNotice("Task captured for Today!");
    setTimeout(() => setNotice(null), 3000);
    onTaskCreated?.();
  };

  const handleNewNote = () => {
    setNotice("Notes module scheduled for v1.1. Quick tasks can be used to track ideas.");
    setTimeout(() => setNotice(null), 3500);
  };

  const handleNewEvent = () => {
    setNotice("Calendar sync is scheduled for v1.1.");
    setTimeout(() => setNotice(null), 3500);
  };

  const handleAskAi = () => {
    router.push("/");
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] p-3 sm:p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Quick Capture
        </span>
        {notice && (
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-in fade-in">
            {notice}
          </span>
        )}
      </div>

      <form onSubmit={handleCreateTask} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Capture a thought or task for today... (Press Enter)"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-2 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity flex items-center gap-1.5 whitespace-nowrap"
        >
          <PlusIcon size={14} />
          <span>Add Task</span>
        </button>
      </form>

      <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs text-zinc-600 dark:text-zinc-400">
        <button
          type="button"
          onClick={handleNewNote}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
        >
          <SparklesIcon size={13} />
          <span>New Note</span>
        </button>
        <button
          type="button"
          onClick={handleNewEvent}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap"
        >
          <CalendarIcon size={13} />
          <span>New Event</span>
        </button>
        <button
          type="button"
          onClick={handleAskAi}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors whitespace-nowrap"
        >
          <BotIcon size={13} />
          <span>Ask AI Assistant</span>
        </button>
      </div>
    </div>
  );
}
