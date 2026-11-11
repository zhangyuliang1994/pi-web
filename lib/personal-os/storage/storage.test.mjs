import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";
import { getInitialNavigation } from "../../initial-navigation.ts";

const jiti = createJiti(import.meta.url);
const storageModule = await jiti.import("./storage.ts");

const {
  getStoredTasks,
  addStoredTask,
  updateStoredTask,
  toggleStoredTaskComplete,
  deleteStoredTask,
  getStoredProjects,
  addStoredProject,
  updateStoredProject,
  deleteStoredProject,
  getStoredWidgets,
  saveStoredWidgets,
  resetStoredWidgets,
  getProjectInstanceCwd,
  setProjectInstanceCwd,
  getEffectiveProjectCwd,
  localTaskRepository,
} = storageModule;

function setupMockStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  const mockStorage = {
    getItem(key) {
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
  globalThis.window = {};
  globalThis.localStorage = mockStorage;
  return mockStorage;
}

test("Tasks CRUD: add, update, toggle complete, and delete", () => {
  setupMockStorage();

  const task = addStoredTask({
    title: "Verify Agent Tool Execution",
    priority: 1,
    completed: false,
    tags: ["Agent", "Testing"],
  });

  assert.ok(task.id);
  assert.equal(task.title, "Verify Agent Tool Execution");
  assert.equal(task.priority, 1);
  assert.equal(task.completed, false);

  const updated = updateStoredTask(task.id, {
    title: "Verify Agent Tool Execution (Updated)",
    priority: 2,
  });
  assert.equal(updated?.title, "Verify Agent Tool Execution (Updated)");
  assert.equal(updated?.priority, 2);

  const toggled = toggleStoredTaskComplete(task.id);
  assert.equal(toggled?.completed, true);

  deleteStoredTask(task.id);
  const remaining = getStoredTasks();
  assert.ok(!remaining.some((t) => t.id === task.id));
});

test("Projects CRUD: add, update, and unassign associated tasks on delete", () => {
  setupMockStorage();

  const project = addStoredProject({
    name: "Personal OS NextGen",
    description: "NextGen Personal OS platform",
    category: "software",
    status: "active",
    progress: 75,
    cwd: "/Users/dev/pi-web",
    tags: ["Next.js", "Pi"],
  });

  assert.ok(project.id);
  assert.equal(project.name, "Personal OS NextGen");

  const task = addStoredTask({
    title: "Project Linked Task",
    priority: 2,
    completed: false,
    projectId: project.id,
    projectName: project.name,
    tags: [],
  });

  const updated = updateStoredProject(project.id, {
    progress: 85,
    status: "completed",
    githubUrl: "https://github.com/org/repo",
  });
  assert.equal(updated?.progress, 85);
  assert.equal(updated?.status, "completed");
  assert.equal(updated?.githubUrl, "https://github.com/org/repo");

  // Delete project with default option: keep tasks and unassign
  deleteStoredProject(project.id, { deleteTasks: false });

  const projects = getStoredProjects();
  assert.ok(!projects.some((p) => p.id === project.id));

  const tasks = getStoredTasks();
  const linkedTask = tasks.find((t) => t.id === task.id);
  assert.ok(linkedTask, "Task should still exist");
  assert.equal(linkedTask.projectId, undefined, "Task projectId should be unassigned");
});

test("Projects CRUD: cascade delete tasks when requested", () => {
  setupMockStorage();

  const project = addStoredProject({
    name: "Temporary Project",
    description: "To be deleted",
    category: "research",
    status: "planning",
    progress: 10,
    tags: [],
  });

  const task = addStoredTask({
    title: "Will be deleted",
    priority: 3,
    completed: false,
    projectId: project.id,
    tags: [],
  });

  deleteStoredProject(project.id, { deleteTasks: true });

  const tasks = getStoredTasks();
  assert.ok(!tasks.some((t) => t.id === task.id), "Task should be deleted when cascade is true");
});

test("Dashboard Widgets: get, save custom order, and reset to defaults", () => {
  setupMockStorage();

  const initialWidgets = getStoredWidgets();
  assert.ok(initialWidgets.length >= 7);
  // Default order is 1..N
  assert.equal(initialWidgets[0].id, "quick_capture");
  assert.equal(initialWidgets[0].order, 1);

  // Reorder widgets
  const reordered = [
    { ...initialWidgets[1], order: 1 },
    { ...initialWidgets[0], order: 2 },
    ...initialWidgets.slice(2).map((w, idx) => ({ ...w, order: idx + 3 })),
  ];
  saveStoredWidgets(reordered);

  const loaded = getStoredWidgets();
  assert.equal(loaded[0].id, initialWidgets[1].id, "First widget should match reordered order");
  assert.equal(loaded[1].id, initialWidgets[0].id, "Second widget should match reordered order");

  // Reset to defaults
  const reset = resetStoredWidgets();
  assert.equal(reset[0].id, "quick_capture");
  assert.equal(reset[0].order, 1);
});

test("LocalStorage error handling: corrupt data falls back gracefully", () => {
  setupMockStorage({
    personal_os_tasks_v1: "INVALID_JSON_CORRUPTED{{{",
    personal_os_widgets_v1: "NOT_JSON",
  });

  // Does not throw and returns defaults
  const tasks = getStoredTasks();
  assert.ok(Array.isArray(tasks));

  const widgets = getStoredWidgets();
  assert.ok(Array.isArray(widgets));
  assert.ok(widgets.length >= 7);
});

test("Machine-specific CWD override decouples shared project from local path", () => {
  setupMockStorage();

  const project = {
    id: "proj-sync-1",
    name: "Cloud Synced Project",
    description: "Shared project",
    category: "software",
    status: "active",
    progress: 50,
    cwd: "/var/cloud/repo",
    tags: [],
    createdAt: "",
    updatedAt: "",
  };

  assert.equal(getEffectiveProjectCwd(project), "/var/cloud/repo");

  // Local device overrides CWD (e.g. on Mac mini)
  setProjectInstanceCwd(project.id, "/Users/local/code/my-repo");
  assert.equal(getProjectInstanceCwd(project.id), "/Users/local/code/my-repo");
  assert.equal(getEffectiveProjectCwd(project), "/Users/local/code/my-repo");

  // Clear override
  setProjectInstanceCwd(project.id, "");
  assert.equal(getEffectiveProjectCwd(project), "/var/cloud/repo");
});

test("Lightweight Repository Interface: async adapter works transparently", async () => {
  setupMockStorage();

  const task = await localTaskRepository.create({
    title: "Async Task",
    priority: 1,
    completed: false,
    tags: [],
  });
  assert.ok(task.id);

  const all = await localTaskRepository.getAll();
  assert.ok(all.some((t) => t.id === task.id));

  const toggled = await localTaskRepository.toggleComplete(task.id);
  assert.equal(toggled?.completed, true);

  await localTaskRepository.delete(task.id);
  const remaining = await localTaskRepository.getAll();
  assert.ok(!remaining.some((t) => t.id === task.id));
});

test("Agent URL compatibility: deep links ?session=... and ?cwd=... are preserved", () => {
  // 1. Session deep link
  const sessionParams = new URLSearchParams("session=01a1c311-518f-726c-800d-0e8ae89fa101");
  const navSession = getInitialNavigation(sessionParams);
  assert.equal(navSession.sessionId, "01a1c311-518f-726c-800d-0e8ae89fa101");
  assert.equal(navSession.requestedCwd, null);

  // 2. Cwd deep link
  const cwdParams = new URLSearchParams("cwd=%2FUsers%2Fyuliangzhang%2Fcode%2Fgithub%2Fpi-web");
  const navCwd = getInitialNavigation(cwdParams);
  assert.equal(navCwd.requestedCwd, "/Users/yuliangzhang/code/github/pi-web");
  assert.equal(navCwd.sessionId, null);

  // 3. Root navigation
  const rootParams = new URLSearchParams("");
  const navRoot = getInitialNavigation(rootParams);
  assert.equal(navRoot.requestedCwd, null);
  assert.equal(navRoot.sessionId, null);
});
