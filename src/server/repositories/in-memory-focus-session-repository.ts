import type { FocusSession } from "@/domain/focus-session";
import type { FocusSessionRepository } from "./focus-session-repository";
import { InMemoryStore } from "./in-memory-store";

export class InMemoryFocusSessionRepository implements FocusSessionRepository {
  private readonly store: InMemoryStore<FocusSession>;

  constructor(seed: readonly FocusSession[] = []) {
    this.store = new InMemoryStore(seed);
  }

  async findAll(): Promise<FocusSession[]> {
    return this.store.all();
  }

  async save(session: FocusSession): Promise<FocusSession> {
    return this.store.put(session);
  }
}
