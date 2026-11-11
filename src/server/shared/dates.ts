const DAY_MS = 24 * 60 * 60 * 1000;

/** UTC day key in ISO format (YYYY-MM-DD). */
export function toDayKey(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Day keys for the last `count` days, oldest first, ending on `today`. */
export function lastDayKeys(today: Date, count: number): string[] {
  return Array.from({ length: count }, (_, index) => toDayKey(addDays(today, index - count + 1)));
}
