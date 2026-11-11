import type { Task } from "@/domain/task";

/**
 * Persistence port for tasks. Services depend on this abstraction,
 * so the in-memory adapter can be swapped for Supabase, Postgres, etc.
 */
export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  save(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
}
