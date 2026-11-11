/**
 * Generic Map-backed store keyed by `id`. Returns copies so callers
 * can never mutate the stored state by reference.
 */
export class InMemoryStore<T extends { id: string }> {
  private readonly items = new Map<string, T>();

  constructor(seed: readonly T[] = []) {
    seed.forEach((item) => this.items.set(item.id, { ...item }));
  }

  all(): T[] {
    return Array.from(this.items.values(), (item) => ({ ...item }));
  }

  get(id: string): T | null {
    const item = this.items.get(id);
    return item ? { ...item } : null;
  }

  put(item: T): T {
    this.items.set(item.id, { ...item });
    return { ...item };
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }
}
