"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "../ui/Drawer";
import { BotIcon, CalendarIcon, ProjectsIcon } from "../ui/icons";
import type { PersonalTask, TaskPriority } from "@/lib/personal-os/models/task";
import type { PersonalProject } from "@/lib/personal-os/models/project";

export interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: PersonalTask | null;
  projects: PersonalProject[];
  onUpdateTask: (id: string, updates: Partial<PersonalTask>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function TaskDetailDrawer({
  isOpen,
  onClose,
  task,
  projects,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
}: TaskDetailDrawerProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(2);
  const [projectId, setProjectId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setProjectId(task.projectId || "");
      setDueDate(task.dueDate || "");
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    const selectedProj = projects.find((p) => p.id === projectId);
    onUpdateTask(task.id, {
      title,
      description,
      priority,
      projectId: projectId || undefined,
      projectName: selectedProj?.name || undefined,
      dueDate: dueDate || undefined,
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  const handleAskAgent = () => {
    onClose();
    router.push("/");
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        handleSave();
        onClose();
      }}
      title="Task Details"
      description="View and update task specifications"
      width="md"
    >
      <div className="space-y-5">
        {/* Title input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Description textarea */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Description / Context
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            placeholder="Add relevant links, notes, or execution context..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Priority & Due Date grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => {
                const p = Number(e.target.value) as TaskPriority;
                setPriority(p);
                onUpdateTask(task.id, { priority: p });
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
            >
              <option value={1}>P1 Urgent (Red)</option>
              <option value={2}>P2 High (Orange)</option>
              <option value={3}>P3 Medium (Blue)</option>
              <option value={4}>P4 Low (Gray)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1">
              <CalendarIcon size={12} />
              <span>Due Date</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                onUpdateTask(task.id, { dueDate: e.target.value || undefined });
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Project Selector */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1">
            <ProjectsIcon size={12} />
            <span>Associated Project</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => {
              const pid = e.target.value;
              setProjectId(pid);
              const proj = projects.find((p) => p.id === pid);
              onUpdateTask(task.id, {
                projectId: pid || undefined,
                projectName: proj?.name || undefined,
              });
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
          >
            <option value="">No Project (General / Life)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pi Agent Action Card (matching Stitch) */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
          <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
            Pi Agent Assistant Action
          </span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Need help resolving this task? You can launch the Pi Web coding agent with this task&apos;s context.
          </p>
          <button
            type="button"
            onClick={handleAskAgent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity"
          >
            <BotIcon size={14} />
            <span>Ask Pi Agent</span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
          >
            Delete Task
          </button>
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              task.completed
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
            }`}
          >
            {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
