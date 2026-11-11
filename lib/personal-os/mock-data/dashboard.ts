import type { DashboardWidgetConfig, BriefingData, ScheduleEvent } from "../models/dashboard";

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
  { id: "quick_capture", label: "Quick Capture Bar", enabled: true, order: 1 },
  { id: "briefing", label: "AI Daily Briefing", enabled: true, order: 2 },
  { id: "overview", label: "Daily Overview Stats", enabled: true, order: 3 },
  { id: "tasks", label: "My Priority Tasks", enabled: true, order: 4 },
  { id: "projects", label: "Active Projects", enabled: true, order: 5 },
  { id: "websites", label: "Website Performance Snapshot", enabled: true, order: 6 },
  { id: "schedule", label: "Today's Schedule", enabled: true, order: 7 },
];

export const INITIAL_BRIEFING: BriefingData = {
  status: "generated",
  headline: "UplinkPlans impressions rose +18.4% this week. CTR on comparison pages is down to 4.33%.",
  summary: "Google Search Console synced 342.1k impressions over the last 28 days. You have 3 urgent tasks scheduled today, including verifying Pi Web agent tool execution states and reviewing Starlink comparison pages.",
  highlights: [
    "UplinkPlans: Starlink vs Roam comparison page gained 1,240 clicks (Position 4.2).",
    "CupCities: World Cup stadium search traffic spiked +35.2% following venue announcements.",
    "Personal OS: All baseline unit tests and type checks passed; V1 workspace layout ready for review.",
  ],
  suggestedAction: {
    label: "Ask AI to diagnose CTR",
    prompt: "Analyze why UplinkPlans comparison page impressions grew by 18% while CTR slightly dropped, and suggest meta title tweaks.",
  },
  generatedAt: "Today at 08:00 AM",
  isDemo: true,
};

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: "evt-1",
    time: "10:00 AM",
    duration: "45m",
    title: "Pi Web Coding Agent Architecture Review",
    category: "work",
    location: "Google Meet",
    completed: true,
  },
  {
    id: "evt-2",
    time: "02:00 PM",
    duration: "1h 30m",
    title: "Deep Work: Personal OS V1 UI Engineering",
    category: "focus",
    location: "Studio",
    completed: false,
  },
  {
    id: "evt-3",
    time: "04:30 PM",
    duration: "30m",
    title: "CupCities SEO Content Strategy & Stadium Map Sync",
    category: "meeting",
    location: "Discord",
    completed: false,
  },
  {
    id: "evt-4",
    time: "06:00 PM",
    duration: "45m",
    title: "Daily Exercise & Evening Walk",
    category: "personal",
    location: "Outdoor",
    completed: false,
  },
];
