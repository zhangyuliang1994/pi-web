import type { PersonalTask } from "../models/task";
import { getTodayDateString } from "../utils/date";

const today = getTodayDateString();

// Tomorrow date string
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrow = tomorrowDate.toISOString().slice(0, 10);

// Next week date string
const nextWeekDate = new Date();
nextWeekDate.setDate(nextWeekDate.getDate() + 5);
const nextWeek = nextWeekDate.toISOString().slice(0, 10);

export const INITIAL_TASKS: PersonalTask[] = [
  {
    id: "task-1",
    title: "Review UplinkPlans search impression dip on comparison pages",
    description: "Investigate whether the recent title tag revamp caused click-through rate decline on /starlink-vs-oneweb.",
    completed: false,
    priority: 1, // Urgent
    dueDate: today,
    projectId: "proj-uplink-plans",
    projectName: "UplinkPlans",
    tags: ["SEO", "Analysis"],
    createdAt: "2026-11-08T08:00:00Z",
    updatedAt: "2026-11-08T08:00:00Z",
  },
  {
    id: "task-2",
    title: "Implement Pi Web agent environment drawer and tool status mapping",
    description: "Map 5 execution states (Running, Success, Failed, Waiting for Confirmation, Cancelled) in the tool call UI.",
    completed: false,
    priority: 1,
    dueDate: today,
    projectId: "proj-personal-os",
    projectName: "Personal OS",
    tags: ["Frontend", "Agent"],
    createdAt: "2026-11-07T14:30:00Z",
    updatedAt: "2026-11-08T10:00:00Z",
  },
  {
    id: "task-3",
    title: "Verify CupCities 2026 stadium geo-coordinates and transportation guides",
    description: "Add MetLife Stadium (NYC/NJ) and Estadio Azteca (Mexico City) venue navigation details.",
    completed: false,
    priority: 2, // High
    dueDate: today,
    projectId: "proj-cup-cities",
    projectName: "CupCities",
    tags: ["Content", "World Cup"],
    createdAt: "2026-11-06T11:00:00Z",
    updatedAt: "2026-11-07T09:00:00Z",
  },
  {
    id: "task-4",
    title: "Refactor Biz MCP SQLite connector to support vector embeddings query",
    description: "Add sqlite-vec extension loading and check compatibility with Anthropic tool calling specifications.",
    completed: false,
    priority: 3, // Medium
    dueDate: tomorrow,
    projectId: "proj-biz-mcp",
    projectName: "Biz MCP",
    tags: ["MCP", "Database"],
    createdAt: "2026-11-05T16:00:00Z",
    updatedAt: "2026-11-06T15:00:00Z",
  },
  {
    id: "task-5",
    title: "Draft weekly digital workspace summary & sprint goals",
    description: "Consolidate commits across Personal OS, client projects, and affiliate revenue reports.",
    completed: false,
    priority: 4, // Low
    dueDate: nextWeek,
    tags: ["Planning", "Review"],
    createdAt: "2026-11-08T18:00:00Z",
    updatedAt: "2026-11-08T18:00:00Z",
  },
  {
    id: "task-6",
    title: "Configure Tailwind CSS dark theme tokens for Personal OS components",
    description: "Ensure high contrast graphite styling on cards, inputs, and status badges in dark mode.",
    completed: true,
    priority: 2,
    dueDate: today,
    projectId: "proj-personal-os",
    projectName: "Personal OS",
    tags: ["UI/UX", "Tailwind"],
    createdAt: "2026-11-04T10:00:00Z",
    updatedAt: "2026-11-08T19:00:00Z",
  },
  {
    id: "task-7",
    title: "Set up Google Search Console verification DNS records for SatcomIndex",
    description: "TXT records deployed to Cloudflare DNS and verified with Google Search Console.",
    completed: true,
    priority: 3,
    projectId: "proj-satcom-index",
    projectName: "SatcomIndex",
    tags: ["DNS", "SEO"],
    createdAt: "2026-11-02T12:00:00Z",
    updatedAt: "2026-11-05T14:00:00Z",
  },
];
