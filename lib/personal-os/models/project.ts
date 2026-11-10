export type ProjectCategory = "software" | "website" | "personal" | "research";
export type ProjectStatus = "active" | "planning" | "paused" | "completed";

export interface PersonalProject {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progress: number; // 0 - 100
  updatedAt: string;
  createdAt: string;
  githubUrl?: string;
  websiteUrl?: string;
  cwd?: string; // Optional local path bound to Pi Web agent
  tags: string[];
  metrics?: {
    tasksCount: number;
    completedTasksCount: number;
    sessionsCount?: number;
  };
}
