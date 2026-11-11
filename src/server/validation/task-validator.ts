import {
  isTaskCategory,
  isTaskPriority,
  isTaskStatusFilter,
  type CreateTaskInput,
  type TaskFilter,
  type UpdateTaskInput,
} from "@/domain/task";
import { assertRecord, IssueCollector } from "./validator";

export const TASK_TITLE_MAX = 120;
export const TASK_DESCRIPTION_MAX = 500;

function checkTitle(value: unknown, issues: IssueCollector): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.add("title", "El título es obligatorio.");
    return undefined;
  }
  if (value.trim().length > TASK_TITLE_MAX) {
    issues.add("title", `El título no puede superar ${TASK_TITLE_MAX} caracteres.`);
  }
  return value.trim();
}

function checkDescription(value: unknown, issues: IssueCollector): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    issues.add("description", "La descripción debe ser texto.");
    return undefined;
  }
  if (value.length > TASK_DESCRIPTION_MAX) {
    issues.add("description", `La descripción no puede superar ${TASK_DESCRIPTION_MAX} caracteres.`);
  }
  return value.trim();
}

export function parseCreateTaskInput(body: unknown): CreateTaskInput {
  const raw = assertRecord(body);
  const issues = new IssueCollector();

  const title = checkTitle(raw.title, issues);
  const description = checkDescription(raw.description, issues);
  if (!isTaskCategory(raw.category)) issues.add("category", "Categoría no válida.");
  if (!isTaskPriority(raw.priority)) issues.add("priority", "Prioridad no válida.");
  issues.throwIfAny();

  return {
    title: title!,
    description,
    category: raw.category as CreateTaskInput["category"],
    priority: raw.priority as CreateTaskInput["priority"],
  };
}

export function parseUpdateTaskInput(body: unknown): UpdateTaskInput {
  const raw = assertRecord(body);
  const issues = new IssueCollector();
  const input: UpdateTaskInput = {};

  if ("title" in raw) input.title = checkTitle(raw.title, issues);
  if ("description" in raw) input.description = checkDescription(raw.description, issues) ?? "";
  if ("category" in raw) {
    if (isTaskCategory(raw.category)) input.category = raw.category;
    else issues.add("category", "Categoría no válida.");
  }
  if ("priority" in raw) {
    if (isTaskPriority(raw.priority)) input.priority = raw.priority;
    else issues.add("priority", "Prioridad no válida.");
  }
  if ("completed" in raw) {
    if (typeof raw.completed === "boolean") input.completed = raw.completed;
    else issues.add("completed", "El campo completed debe ser booleano.");
  }

  if (Object.keys(raw).length === 0) issues.add("body", "No hay campos para actualizar.");
  issues.throwIfAny();
  return input;
}

export function parseTaskFilter(params: URLSearchParams): TaskFilter {
  const status = params.get("status");
  const category = params.get("category");
  const priority = params.get("priority");
  const search = params.get("search");

  return {
    status: isTaskStatusFilter(status) ? status : undefined,
    category: isTaskCategory(category) ? category : undefined,
    priority: isTaskPriority(priority) ? priority : undefined,
    search: search ?? undefined,
  };
}
