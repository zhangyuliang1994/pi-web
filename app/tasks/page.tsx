"use client";

import React, { useState, useEffect } from "react";
import { PersonalOsLayout } from "@/components/personal-os/layout/PersonalOsLayout";
import { TaskItem } from "@/components/personal-os/tasks/TaskItem";
import { QuickAddBar } from "@/components/personal-os/tasks/QuickAddBar";
import { TaskDetailDrawer } from "@/components/personal-os/tasks/TaskDetailDrawer";
import { PlusIcon, SearchIcon } from "@/components/personal-os/ui/icons";
import {
  getStoredTasks,
  addStoredTask,
  updateStoredTask,
  deleteStoredTask,
  toggleStoredTaskComplete,
  getStoredProjects,
  subscribeToPersonalOsStorage,
} from "@/lib/personal-os/storage/storage";
import { getTodayDateString } from "@/lib/personal-os/utils/date";
import type { PersonalTask, TaskFilterType, TaskPriority } from "@/lib/personal-os/models/task";
import type { PersonalProject } from "@/lib/personal-os/models/project";

export default function TasksPage() {
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [projects, setProjects] = useState<PersonalProject[]>([]);
  const [filterType, setFilterType] = useState<TaskFilterType>("today");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null);

  const loadData = () => {
    setTasks(getStoredTasks());
    setProjects(getStoredProjects());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToPersonalOsStorage(loadData);
    return () => unsub();
  }, []);

  const todayStr = getTodayDateString();

  const handleAddTask = (title: string, priority: TaskPriority, dueDate?: string) => {
    addStoredTask({
      title,
      description: "",
      completed: false,
      priority,
      dueDate: dueDate || todayStr,
      projectId: selectedProjectId || undefined,
      projectName: selectedProjectId
        ? projects.find((p) => p.id === selectedProjectId)?.name
        : undefined,
      tags: ["Inbox"],
    });
    loadData();
  };

  const handleToggleComplete = (id: string) => {
    toggleStoredTaskComplete(id);
    loadData();
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
    }
  };

  const handleUpdateTask = (id: string, updates: Partial<PersonalTask>) => {
    updateStoredTask(id, updates);
    loadData();
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteStoredTask(id);
    loadData();
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(null);
    }
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery) {
      const matchText =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.projectName && t.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchText) return false;
    }

    if (selectedProjectId && t.projectId !== selectedProjectId) {
      return false;
    }

    switch (filterType) {
      case "today":
        return !t.completed && (t.dueDate === todayStr || !t.dueDate);
      case "inbox":
        return !t.completed;
      case "upcoming":
        return !t.completed && t.dueDate && t.dueDate > todayStr;
      case "completed":
        return t.completed;
      default:
        return true;
    }
  });

  const todayCount = tasks.filter((t) => !t.completed && (t.dueDate === todayStr || !t.dueDate)).length;
  const inboxCount = tasks.filter((t) => !t.completed).length;
  const upcomingCount = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const views: { id: TaskFilterType; label: string; count: number }[] = [
    { id: "today", label: "Today", count: todayCount },
    { id: "inbox", label: "Inbox", count: inboxCount },
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
    { id: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <PersonalOsLayout>
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Tasks Navigation Pane (Desktop 220px, Mobile scrollable tabs) */}
        <div className="w-full md:w-56 flex-shrink-0 bg-white dark:bg-[#18181B] border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 space-y-4">
          {/* Main views */}
          <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
            {views.map((v) => {
              const active = filterType === v.id && !selectedProjectId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setFilterType(v.id);
                    setSelectedProjectId(null);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>{v.label}</span>
                  <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {v.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* By Project filter (Desktop only) */}
          <div className="hidden md:block pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
              Filter by Project
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className={`w-full text-left px-2 py-1 rounded text-xs truncate ${
                  selectedProjectId === null
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                All Projects
              </button>
              {projects.map((p) => {
                const count = tasks.filter((t) => t.projectId === p.id && !t.completed).length;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs truncate ${
                      selectedProjectId === p.id
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-zinc-50 dark:bg-zinc-800"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Tasks List View */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] dark:bg-[#09090B] overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto w-full space-y-4">
            {/* Top Workspace Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 capitalize">
                  {selectedProjectId
                    ? projects.find((p) => p.id === selectedProjectId)?.name
                    : filterType === "today"
                    ? "Today's Focus"
                    : filterType}{" "}
                  Tasks
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {filteredTasks.length} {filterType === "completed" ? "completed" : "pending"} tasks
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-48 sm:w-56">
                  <SearchIcon size={14} className="absolute left-2.5 top-2.5 text-zinc-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTask("New task", 2, todayStr)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-semibold hover:opacity-95 shadow-2xs whitespace-nowrap"
                >
                  <PlusIcon size={14} />
                  <span>New Task</span>
                </button>
              </div>
            </div>

            {/* Inline Quick Add Bar */}
            <QuickAddBar
              onAddTask={handleAddTask}
              defaultDueDate={filterType === "today" ? todayStr : undefined}
            />

            {/* Task Item List */}
            {filteredTasks.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white/40 dark:bg-zinc-900/20">
                <p className="text-xs sm:text-sm text-zinc-400">
                  {searchQuery ? "No tasks matching your search." : "No tasks in this view."}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onSelectTask={(t) => setSelectedTask(t)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        projects={projects}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
      />
    </PersonalOsLayout>
  );
}
