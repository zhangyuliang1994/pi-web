import React from "react";
import type { TaskPriority } from "@/lib/personal-os/models/task";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "muted" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className = "" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs";

  const variantClasses = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
    primary: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    error: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    muted: "bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60",
    outline: "bg-transparent text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700",
  }[variant];

  return (
    <span className={`inline-flex items-center font-medium rounded ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const configs: Record<TaskPriority, { label: string; variant: "error" | "warning" | "primary" | "muted" }> = {
    1: { label: "P1 Urgent", variant: "error" },
    2: { label: "P2 High", variant: "warning" },
    3: { label: "P3 Medium", variant: "primary" },
    4: { label: "P4 Low", variant: "muted" },
  };
  const config = configs[priority] || configs[4];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
