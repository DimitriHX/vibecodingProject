export const TASK_CATEGORIES = ["work", "study", "health", "personal"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export const TASK_STATUSES = ["all", "pending", "completed"] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatusFilter = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  pomodoros: number;
  createdAt: string;
  completedAt: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
}

export type UpdateTaskInput = Partial<
  Pick<Task, "title" | "description" | "category" | "priority" | "completed">
>;

export interface TaskFilter {
  status?: TaskStatusFilter;
  category?: TaskCategory | "all";
  priority?: TaskPriority | "all";
  search?: string;
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

export function isTaskCategory(value: unknown): value is TaskCategory {
  return TASK_CATEGORIES.includes(value as TaskCategory);
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority);
}

export function isTaskStatusFilter(value: unknown): value is TaskStatusFilter {
  return TASK_STATUSES.includes(value as TaskStatusFilter);
}

/** Pure filter shared by the API and the client UI. */
export function filterTasks(tasks: readonly Task[], filter: TaskFilter = {}): Task[] {
  const search = filter.search?.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filter.status === "pending" && task.completed) return false;
    if (filter.status === "completed" && !task.completed) return false;
    if (filter.category && filter.category !== "all" && task.category !== filter.category) return false;
    if (filter.priority && filter.priority !== "all" && task.priority !== filter.priority) return false;
    if (search && !`${task.title} ${task.description}`.toLowerCase().includes(search)) return false;
    return true;
  });
}

/** Pending first, then by priority, then newest first. */
export function sortTasks(tasks: readonly Task[]): Task[] {
  return [...tasks].sort(
    (a, b) =>
      Number(a.completed) - Number(b.completed) ||
      PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority] ||
      b.createdAt.localeCompare(a.createdAt),
  );
}
