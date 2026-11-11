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

export function deleteStoredProject(id: string, options: { deleteTasks?: boolean } = {}): void {
  const current = getStoredProjects();
  saveStoredProjects(current.filter(p => p.id !== id));

  const tasks = getStoredTasks();
  if (options.deleteTasks) {
    saveStoredTasks(tasks.filter(t => t.projectId !== id));
  } else {
    // Unassign associated tasks without deleting them
    let hasChanges = false;
    const updatedTasks = tasks.map(t => {
      if (t.projectId === id) {
        hasChanges = true;
        return { ...t, projectId: undefined, projectName: undefined };
      }
      return t;
    });
    if (hasChanges) {
      saveStoredTasks(updatedTasks);
    }
  }
}

// ----------------- MACHINE-SPECIFIC WORKSPACE OVERRIDES -----------------

const CWD_OVERRIDE_PREFIX = "personal_os_cwd_override_";

export function getProjectInstanceCwd(projectId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`${CWD_OVERRIDE_PREFIX}${projectId}`);
  } catch {
    return null;
  }
}

export function setProjectInstanceCwd(projectId: string, cwd: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!cwd.trim()) {
      localStorage.removeItem(`${CWD_OVERRIDE_PREFIX}${projectId}`);
    } else {
      localStorage.setItem(`${CWD_OVERRIDE_PREFIX}${projectId}`, cwd.trim());
    }
    notifyChange();
  } catch (e) {
    console.error("Failed to set project instance cwd:", e);
  }
}

export function getEffectiveProjectCwd(project: PersonalProject): string | undefined {
  const override = getProjectInstanceCwd(project.id);
  return override || project.cwd;
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
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return DEFAULT_DASHBOARD_WIDGETS;
    }

    const map = new Map<string, DashboardWidgetConfig>();
    for (const w of parsed) {
      if (w && typeof w.id === "string") {
        map.set(w.id, {
          id: w.id,
          label: typeof w.label === "string" ? w.label : w.id,
          enabled: Boolean(w.enabled),
          order: typeof w.order === "number" ? w.order : 999,
        });
      }
    }

    // Ensure all default widgets exist in case schema was updated
    for (const def of DEFAULT_DASHBOARD_WIDGETS) {
      if (!map.has(def.id)) {
        map.set(def.id, { ...def, order: map.size + 1 });
      }
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => a.order - b.order);
    return merged;
  } catch (e) {
    console.warn("Failed to load widget config:", e);
    return DEFAULT_DASHBOARD_WIDGETS;
  }
}

export function saveStoredWidgets(widgets: DashboardWidgetConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = widgets.map((w, idx) => ({ ...w, order: idx + 1 }));
    localStorage.setItem(KEYS.WIDGETS, JSON.stringify(normalized));
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
  return DEFAULT_DASHBOARD_WIDGETS.map((w, i) => ({ ...w, order: i + 1 }));
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

// ----------------- LIGHTWEIGHT REPOSITORY BOUNDARIES (FOR SPRING BOOT REST API) -----------------

export interface PersonalTaskRepository {
  getAll(): Promise<PersonalTask[]>;
  create(task: Omit<PersonalTask, "id" | "createdAt" | "updatedAt">): Promise<PersonalTask>;
  update(id: string, updates: Partial<PersonalTask>): Promise<PersonalTask | null>;
  toggleComplete(id: string): Promise<PersonalTask | null>;
  delete(id: string): Promise<void>;
}

export interface PersonalProjectRepository {
  getAll(): Promise<PersonalProject[]>;
  create(project: Omit<PersonalProject, "id" | "createdAt" | "updatedAt">): Promise<PersonalProject>;
  update(id: string, updates: Partial<PersonalProject>): Promise<PersonalProject | null>;
  delete(id: string, options?: { deleteTasks?: boolean }): Promise<void>;
}

/**
 * Default local storage implementation of repositories.
 * In V1.1, these can be swapped to RestTaskRepository / RestProjectRepository
 * backed by the Spring Boot backend without changing any UI consumer.
 */
export const localTaskRepository: PersonalTaskRepository = {
  async getAll() {
    return getStoredTasks();
  },
  async create(task) {
    return addStoredTask(task);
  },
  async update(id, updates) {
    return updateStoredTask(id, updates);
  },
  async toggleComplete(id) {
    return toggleStoredTaskComplete(id);
  },
  async delete(id) {
    deleteStoredTask(id);
  },
};

export const localProjectRepository: PersonalProjectRepository = {
  async getAll() {
    return getStoredProjects();
  },
  async create(project) {
    return addStoredProject(project);
  },
  async update(id, updates) {
    return updateStoredProject(id, updates);
  },
  async delete(id, options) {
    deleteStoredProject(id, options);
  },
};

