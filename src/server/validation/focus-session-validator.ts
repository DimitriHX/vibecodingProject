import type { RecordFocusSessionInput } from "@/domain/focus-session";
import { assertRecord, IssueCollector } from "./validator";

export const SESSION_MAX_MINUTES = 180;

export function parseRecordFocusSessionInput(body: unknown): RecordFocusSessionInput {
  const raw = assertRecord(body);
  const issues = new IssueCollector();

  const minutes = raw.durationMinutes;
  if (typeof minutes !== "number" || !Number.isInteger(minutes) || minutes < 1 || minutes > SESSION_MAX_MINUTES) {
    issues.add("durationMinutes", `La duración debe ser un entero entre 1 y ${SESSION_MAX_MINUTES}.`);
  }
  if (raw.taskId !== undefined && raw.taskId !== null && typeof raw.taskId !== "string") {
    issues.add("taskId", "taskId debe ser texto o null.");
  }
  issues.throwIfAny();

  return {
    durationMinutes: minutes as number,
    taskId: (raw.taskId as string | null | undefined) ?? null,
  };
}
