// Dates are formatted in UTC so server and client renders always match.
const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "UTC" });
const weekdayFormatter = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "UTC" });

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatShortDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function formatWeekday(dayKey: string): string {
  return weekdayFormatter.format(new Date(`${dayKey}T00:00:00Z`)).replace(".", "");
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
