import type { Task } from "@/domain/task";
import { InMemoryStore } from "./in-memory-store";
import type { TaskRepository } from "./task-repository";

export class InMemoryTaskRepository implements TaskRepository {
  private readonly store: InMemoryStore<Task>;

  constructor(seed: readonly Task[] = []) {
    this.store = new InMemoryStore(seed);
  }

  async findAll(): Promise<Task[]> {
    return this.store.all();
  }

  async findById(id: string): Promise<Task | null> {
    return this.store.get(id);
  }

  async save(task: Task): Promise<Task> {
    return this.store.put(task);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.remove(id);
  }
}
