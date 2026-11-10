"use client";

import type { PersonalTask } from "../models/task";
import type { PersonalProject } from "../models/project";
import type { DashboardWidgetConfig, BriefingData } from "../models/dashboard";
import { INITIAL_TASKS } from "../mock-data/tasks";
import { INITIAL_PROJECTS } from "../mock-data/projects";
import { DEFAULT_DASHBOARD_WIDGETS, INITIAL_BRIEFING } from "../mock-data/dashboard";

const KEYS = {
  TASKS: "personal_os_tasks_v1",
  PROJECTS: "personal_os_projects_v1",
  WIDGETS: "personal_os_widgets_v1",
  BRIEFING: "personal_os_briefing_v1",
};

type StorageEventCallback = () => void;
const listeners = new Set<StorageEventCallback>();

function notifyChange() {
  if (typeof window !== "undefined") {
    listeners.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error("Storage listener error:", err);
      }
    });
  }
}

export function subscribeToPersonalOsStorage(callback: StorageEventCallback): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// ----------------- TASKS -----------------

export function getStoredTasks(): PersonalTask[] {
  if (typeof window === "undefined") return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(raw) as PersonalTask[];
  } catch (e) {
    console.warn("Failed to load tasks from localStorage:", e);
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: PersonalTask[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    notifyChange();
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
}

export function addStoredTask(task: Omit<PersonalTask, "id" | "createdAt" | "updatedAt"> & { id?: string }): PersonalTask {
  const current = getStoredTasks();
  const now = new Date().toISOString();
  const newTask: PersonalTask = {
    ...task,
    id: task.id || `task-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  saveStoredTasks([newTask, ...current]);
  return newTask;
}

export function updateStoredTask(id: string, updates: Partial<PersonalTask>): PersonalTask | null {
  const current = getStoredTasks();
  const index = current.findIndex(t => t.id === id);
  if (index === -1) return null;

  const updated: PersonalTask = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  current[index] = updated;
  saveStoredTasks(current);
  return updated;
}

export function deleteStoredTask(id: string): boolean {
  const current = getStoredTasks();
  const filtered = current.filter(t => t.id !== id);
  if (filtered.length !== current.length) {
    saveStoredTasks(filtered);
    return true;
  }
  return false;
}

export function toggleStoredTaskComplete(id: string): PersonalTask | null {
  const current = getStoredTasks();
  const task = current.find(t => t.id === id);
  if (!task) return null;
  return updateStoredTask(id, { completed: !task.completed });
}

// ----------------- PROJECTS -----------------

export function getStoredProjects(): PersonalProject[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw) as PersonalProject[];
  } catch (e) {
    console.warn("Failed to load projects from localStorage:", e);
    return INITIAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: PersonalProject[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    notifyChange();
  } catch (e) {
    console.error("Failed to save projects:", e);
  }
}

export function addStoredProject(project: Omit<PersonalProject, "id" | "createdAt" | "updatedAt"> & { id?: string }): PersonalProject {
  const current = getStoredProjects();
  const now = new Date().toISOString();
  const newProject: PersonalProject = {
    ...project,
    id: project.id || `proj-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  saveStoredProjects([newProject, ...current]);
  return newProject;
}

export function updateStoredProject(id: string, updates: Partial<PersonalProject>): PersonalProject | null {
  const current = getStoredProjects();
  const index = current.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: PersonalProject = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  current[index] = updated;
  saveStoredProjects(current);
  return updated;
}

// ----------------- DASHBOARD WIDGETS -----------------

export function getStoredWidgets(): DashboardWidgetConfig[] {
  if (typeof window === "undefined") return DEFAULT_DASHBOARD_WIDGETS;
  try {
    const raw = localStorage.getItem(KEYS.WIDGETS);
    if (!raw) {
      localStorage.setItem(KEYS.WIDGETS, JSON.stringify(DEFAULT_DASHBOARD_WIDGETS));
      return DEFAULT_DASHBOARD_WIDGETS;
    }
    return JSON.parse(raw) as DashboardWidgetConfig[];
  } catch (e) {
    console.warn("Failed to load widget config:", e);
    return DEFAULT_DASHBOARD_WIDGETS;
  }
}

export function saveStoredWidgets(widgets: DashboardWidgetConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.WIDGETS, JSON.stringify(widgets));
    notifyChange();
  } catch (e) {
    console.error("Failed to save widgets:", e);
  }
}

export function resetStoredWidgets(): DashboardWidgetConfig[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.WIDGETS, JSON.stringify(DEFAULT_DASHBOARD_WIDGETS));
    notifyChange();
  }
  return DEFAULT_DASHBOARD_WIDGETS;
}

// ----------------- BRIEFING -----------------

export function getStoredBriefing(): BriefingData {
  if (typeof window === "undefined") return INITIAL_BRIEFING;
  try {
    const raw = localStorage.getItem(KEYS.BRIEFING);
    if (!raw) return INITIAL_BRIEFING;
    return JSON.parse(raw) as BriefingData;
  } catch {
    return INITIAL_BRIEFING;
  }
}

export function saveStoredBriefing(briefing: BriefingData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.BRIEFING, JSON.stringify(briefing));
    notifyChange();
  } catch (e) {
    console.error("Failed to save briefing:", e);
  }
}

// ----------------- RESET ALL -----------------

export function resetPersonalOsData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(KEYS.WIDGETS, JSON.stringify(DEFAULT_DASHBOARD_WIDGETS));
    localStorage.setItem(KEYS.BRIEFING, JSON.stringify(INITIAL_BRIEFING));
    notifyChange();
  } catch (e) {
    console.error("Failed to reset Personal OS data:", e);
  }
}
