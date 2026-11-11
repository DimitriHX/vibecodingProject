import type { TaskCategory } from "./task";

export interface FocusSession {
  id: string;
  taskId: string | null;
  category: TaskCategory | null;
  durationMinutes: number;
  completedAt: string;
}

export interface RecordFocusSessionInput {
  taskId?: string | null;
  durationMinutes: number;
}
