import type { DailyActivity } from "@/domain/stats";
import { formatMinutes, formatWeekday } from "@/lib/format";

/** Pure CSS bar chart: renders on the server with zero client JavaScript. */
export function WeeklyActivityChart({ activity }: { activity: DailyActivity[] }) {
  const max = Math.max(...activity.map((day) => day.focusMinutes), 1);

  return (
    <figure>
      <div className="flex h-48 items-end gap-2 sm:gap-4">
        {activity.map((day, index) => {
          const isToday = index === activity.length - 1;
          return (
            <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium text-ink-muted">{day.focusMinutes > 0 ? `${day.focusMinutes}m` : ""}</span>
              <div
                className={`w-full max-w-12 rounded-t-lg transition-all ${isToday ? "bg-primary" : "bg-primary-soft"}`}
                style={{ height: `${Math.max((day.focusMinutes / max) * 100, 4)}%` }}
                title={`${formatMinutes(day.focusMinutes)} · ${day.completedTasks} tareas`}
              />
              <span className={`text-xs capitalize ${isToday ? "font-semibold text-ink" : "text-ink-muted"}`}>{formatWeekday(day.date)}</span>
            </div>
          );
        })}
      </div>
      <figcaption className="sr-only">
        Minutos de enfoque por día:{" "}
        {activity.map((day) => `${formatWeekday(day.date)} ${day.focusMinutes} minutos`).join(", ")}
      </figcaption>
    </figure>
  );
}
