import type { FocusSession } from "@/domain/focus-session";
import type { CategoryStats, DailyActivity, ProductivityStats } from "@/domain/stats";
import { TASK_CATEGORIES, type Task } from "@/domain/task";
import type { FocusSessionRepository } from "../repositories/focus-session-repository";
import type { TaskRepository } from "../repositories/task-repository";
import type { Clock } from "../shared/clock";
import { addDays, lastDayKeys, toDayKey } from "../shared/dates";

const WEEK_LENGTH = 7;

/** Read-only aggregations over tasks and focus sessions. */
export class StatsService {
  constructor(
    private readonly tasks: TaskRepository,
    private readonly sessions: FocusSessionRepository,
    private readonly clock: Clock,
  ) {}

  async getProductivityStats(): Promise<ProductivityStats> {
    const [tasks, sessions] = await Promise.all([this.tasks.findAll(), this.sessions.findAll()]);
    const completedTasks = tasks.filter((task) => task.completed).length;
    const today = this.clock.now();

    return {
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks: tasks.length - completedTasks,
      completionRate: tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100),
      totalFocusMinutes: sum(sessions.map((session) => session.durationMinutes)),
      sessionsCount: sessions.length,
      currentStreak: this.computeStreak(tasks, sessions, today),
      byCategory: this.groupByCategory(tasks, sessions),
      weeklyActivity: this.buildWeeklyActivity(tasks, sessions, today),
    };
  }

  private groupByCategory(tasks: Task[], sessions: FocusSession[]): CategoryStats[] {
    return TASK_CATEGORIES.map((category) => {
      const inCategory = tasks.filter((task) => task.category === category);
      return {
        category,
        total: inCategory.length,
        completed: inCategory.filter((task) => task.completed).length,
        focusMinutes: sum(sessions.filter((s) => s.category === category).map((s) => s.durationMinutes)),
      };
    });
  }

  private buildWeeklyActivity(tasks: Task[], sessions: FocusSession[], today: Date): DailyActivity[] {
    const activity = new Map<string, DailyActivity>(
      lastDayKeys(today, WEEK_LENGTH).map((date) => [date, { date, focusMinutes: 0, completedTasks: 0 }]),
    );

    sessions.forEach((session) => {
      const day = activity.get(toDayKey(session.completedAt));
      if (day) day.focusMinutes += session.durationMinutes;
    });
    tasks.forEach((task) => {
      const day = task.completedAt ? activity.get(toDayKey(task.completedAt)) : undefined;
      if (day) day.completedTasks += 1;
    });

    return Array.from(activity.values());
  }

  /** Consecutive active days ending today (or yesterday, if today has no activity yet). */
  private computeStreak(tasks: Task[], sessions: FocusSession[], today: Date): number {
    const activeDays = new Set([
      ...sessions.map((session) => toDayKey(session.completedAt)),
      ...tasks.flatMap((task) => (task.completedAt ? [toDayKey(task.completedAt)] : [])),
    ]);

    let cursor = activeDays.has(toDayKey(today)) ? today : addDays(today, -1);
    let streak = 0;
    while (activeDays.has(toDayKey(cursor))) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
