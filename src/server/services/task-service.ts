import { NotFoundError } from "@/domain/errors";
import {
  filterTasks,
  sortTasks,
  type CreateTaskInput,
  type Task,
  type TaskFilter,
  type UpdateTaskInput,
} from "@/domain/task";
import type { TaskRepository } from "../repositories/task-repository";
import type { Clock } from "../shared/clock";
import type { IdGenerator } from "../shared/id-generator";

/** Task use cases. Knows nothing about HTTP nor about the storage engine. */
export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async list(filter: TaskFilter = {}): Promise<Task[]> {
    const tasks = await this.repository.findAll();
    return sortTasks(filterTasks(tasks, filter));
  }

  async get(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) throw new NotFoundError(`No existe una tarea con id "${id}".`);
    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    return this.repository.save({
      id: this.ids.next(),
      title: input.title,
      description: input.description ?? "",
      category: input.category,
      priority: input.priority,
      completed: false,
      pomodoros: 0,
      createdAt: this.clock.now().toISOString(),
      completedAt: null,
    });
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const current = await this.get(id);
    const completionChanged = input.completed !== undefined && input.completed !== current.completed;

    return this.repository.save({
      ...current,
      ...input,
      completedAt: completionChanged
        ? input.completed
          ? this.clock.now().toISOString()
          : null
        : current.completedAt,
    });
  }

  async registerPomodoro(id: string): Promise<Task> {
    const current = await this.get(id);
    return this.repository.save({ ...current, pomodoros: current.pomodoros + 1 });
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundError(`No existe una tarea con id "${id}".`);
  }
}
