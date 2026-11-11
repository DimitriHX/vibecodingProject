import type { CreateTaskInput, Task, UpdateTaskInput } from "@/domain/task";
import { apiRequest } from "./http-client";

export const tasksApi = {
  list: () => apiRequest<Task[]>("/api/tasks"),
  create: (input: CreateTaskInput) =>
    apiRequest<Task>("/api/tasks", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: UpdateTaskInput) =>
    apiRequest<Task>(`/api/tasks/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(input) }),
  remove: (id: string) => apiRequest<void>(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
