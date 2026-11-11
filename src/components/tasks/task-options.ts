import { TASK_CATEGORIES, TASK_PRIORITIES, type TaskCategory, type TaskPriority, type TaskStatusFilter } from "@/domain/task";
import type { SelectOption } from "@/components/ui/fields";
import { CATEGORY_META, PRIORITY_META } from "./task-meta";

export const CATEGORY_OPTIONS: SelectOption<TaskCategory>[] = TASK_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_META[value].label,
}));

export const PRIORITY_OPTIONS: SelectOption<TaskPriority>[] = TASK_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_META[value].label,
}));

export const STATUS_OPTIONS: SelectOption<TaskStatusFilter>[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

export function withAllOption<T extends string>(options: SelectOption<T>[], label: string): SelectOption<T | "all">[] {
  return [{ value: "all", label }, ...options];
}
