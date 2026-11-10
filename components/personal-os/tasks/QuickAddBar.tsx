"use client";

import React, { useState } from "react";
import { PlusIcon } from "../ui/icons";
import { getTodayDateString } from "@/lib/personal-os/utils/date";
import type { TaskPriority } from "@/lib/personal-os/models/task";

export interface QuickAddBarProps {
  onAddTask: (title: string, priority: TaskPriority, dueDate?: string) => void;
  defaultDueDate?: string;
}

export function QuickAddBar({ onAddTask, defaultDueDate }: QuickAddBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    // Simple priority parsing: #urgent -> 1, #high -> 2, #med -> 3, default -> 2
    let priority: TaskPriority = 2;
    let text = value;

    if (text.includes("#urgent") || text.includes("#p1")) {
      priority = 1;
      text = text.replace(/#urgent|#p1/gi, "");
    } else if (text.includes("#high") || text.includes("#p2")) {
      priority = 2;
      text = text.replace(/#high|#p2/gi, "");
    } else if (text.includes("#med") || text.includes("#p3")) {
      priority = 3;
      text = text.replace(/#med|#p3/gi, "");
    } else if (text.includes("#low") || text.includes("#p4")) {
      priority = 4;
      text = text.replace(/#low|#p4/gi, "");
    }

    onAddTask(text.trim(), priority, defaultDueDate || getTodayDateString());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/60 dark:bg-zinc-900/40 transition-colors flex items-center gap-2"
    >
      <PlusIcon size={16} className="text-zinc-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type new task title and press Enter... (e.g. Test Docker build #high)"
        className="w-full text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent border-none focus:outline-none"
      />
    </form>
  );
}
