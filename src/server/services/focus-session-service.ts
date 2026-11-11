import type { FocusSession, RecordFocusSessionInput } from "@/domain/focus-session";
import type { FocusSessionRepository } from "../repositories/focus-session-repository";
import type { Clock } from "../shared/clock";
import type { IdGenerator } from "../shared/id-generator";
import type { TaskService } from "./task-service";

export class FocusSessionService {
  constructor(
    private readonly repository: FocusSessionRepository,
    private readonly tasks: TaskService,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  async list(): Promise<FocusSession[]> {
    const sessions = await this.repository.findAll();
    return sessions.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }

  /** Stores a finished Pomodoro and credits it to the linked task, if any. */
  async record(input: RecordFocusSessionInput): Promise<FocusSession> {
    const task = input.taskId ? await this.tasks.registerPomodoro(input.taskId) : null;

    return this.repository.save({
      id: this.ids.next(),
      taskId: task?.id ?? null,
      category: task?.category ?? null,
      durationMinutes: input.durationMinutes,
      completedAt: this.clock.now().toISOString(),
    });
  }
}
