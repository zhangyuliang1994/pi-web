export type TaskPriority = 1 | 2 | 3 | 4;

export interface PersonalTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority; // 1: Urgent (Red), 2: High (Orange), 3: Medium (Blue), 4: Low (Gray)
  dueDate?: string; // YYYY-MM-DD
  projectId?: string;
  projectName?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskFilterType = "today" | "inbox" | "upcoming" | "completed";
