import type { FocusSession } from "@/domain/focus-session";

export interface FocusSessionRepository {
  findAll(): Promise<FocusSession[]>;
  save(session: FocusSession): Promise<FocusSession>;
}
