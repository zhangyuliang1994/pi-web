"use client";

import React, { useState, useEffect } from "react";
import { PersonalOsLayout } from "@/components/personal-os/layout/PersonalOsLayout";
import { ProjectCard } from "@/components/personal-os/projects/ProjectCard";
import { CreateProjectModal } from "@/components/personal-os/projects/CreateProjectModal";
import { ProjectDetailDrawer } from "@/components/personal-os/projects/ProjectDetailDrawer";
import { PlusIcon, SearchIcon, GridIcon, ListIcon } from "@/components/personal-os/ui/icons";
import {
  getStoredProjects,
  addStoredProject,
  updateStoredProject,
  deleteStoredProject,
  getStoredTasks,
  toggleStoredTaskComplete,
  subscribeToPersonalOsStorage,
} from "@/lib/personal-os/storage/storage";
import type { PersonalProject, ProjectCategory } from "@/lib/personal-os/models/project";
import type { PersonalTask } from "@/lib/personal-os/models/task";

type CategoryFilter = "all" | ProjectCategory;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<PersonalProject[]>([]);
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PersonalProject | null>(null);

  const loadData = () => {
    setProjects(getStoredProjects());
    setTasks(getStoredTasks());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToPersonalOsStorage(loadData);
    return () => unsub();
  }, []);

  const handleCreateProject = (
    newProj: Omit<PersonalProject, "id" | "createdAt" | "updatedAt">
  ) => {
    addStoredProject(newProj);
    loadData();
  };

  const handleUpdateProject = (id: string, updates: Partial<PersonalProject>) => {
    updateStoredProject(id, updates);
    loadData();
    setSelectedProject((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  };

  const handleDeleteProject = (id: string, options: { deleteTasks?: boolean }) => {
    deleteStoredProject(id, options);
    loadData();
    setSelectedProject(null);
  };

  const handleToggleTask = (taskId: string) => {
    toggleStoredTaskComplete(taskId);
    setTasks(getStoredTasks());
  };

  const filtered = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesQuery;
  });

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: "All", value: "all" },
    { label: "Software", value: "software" },
    { label: "Websites & SEO", value: "website" },
    { label: "Personal", value: "personal" },
    { label: "Research", value: "research" },
  ];

  return (
    <PersonalOsLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Projects Hub
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                {projects.length} Managed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Active repositories, web properties, and research domains.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-semibold hover:opacity-95 shadow-2xs transition-opacity"
          >
            <PlusIcon size={16} />
            <span>New Project</span>
          </button>
        </div>

        {/* Filter and View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat.label}
                  {cat.value !== "all" && (
                    <span className="ml-1 opacity-60">
                      ({projects.filter((p) => p.category === cat.value).length})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + View mode controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-56">
              <SearchIcon
                size={14}
                className="absolute left-2.5 top-2.5 text-zinc-400"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
                title="Grid View"
              >
                <GridIcon size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${
                  viewMode === "list"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
                title="List View"
              >
                <ListIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-400">
              No projects found matching the criteria.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-3"
            }
          >
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onViewDetails={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleCreateProject}
      />

      {/* Project Detail Drawer */}
      <ProjectDetailDrawer
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        tasks={tasks}
        onToggleTaskComplete={handleToggleTask}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
    </PersonalOsLayout>
  );
}
