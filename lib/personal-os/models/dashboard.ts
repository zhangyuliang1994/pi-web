export type WidgetId =
  | "briefing"
  | "overview"
  | "schedule"
  | "tasks"
  | "projects"
  | "websites"
  | "quick_capture";

export interface DashboardWidgetConfig {
  id: WidgetId;
  label: string;
  enabled: boolean;
  order: number;
}

export type BriefingStatus = "not_generated" | "loading" | "generated" | "failed";

export interface BriefingData {
  status: BriefingStatus;
  headline: string;
  summary: string;
  highlights: string[];
  suggestedAction?: {
    label: string;
    prompt: string;
  };
  generatedAt?: string;
  isDemo?: boolean;
}

export interface ScheduleEvent {
  id: string;
  time: string; // e.g. "10:00 AM"
  duration: string; // e.g. "45m"
  title: string;
  category: "work" | "meeting" | "personal" | "focus";
  location?: string;
  completed?: boolean;
}
