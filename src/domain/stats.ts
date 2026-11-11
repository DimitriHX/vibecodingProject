import type { TaskCategory } from "./task";

export interface CategoryStats {
  category: TaskCategory;
  total: number;
  completed: number;
  focusMinutes: number;
}

export interface DailyActivity {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  focusMinutes: number;
  completedTasks: number;
}

export interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  /** Integer percentage from 0 to 100. */
  completionRate: number;
  totalFocusMinutes: number;
  sessionsCount: number;
  currentStreak: number;
  byCategory: CategoryStats[];
  weeklyActivity: DailyActivity[];
}
