import type { CategoryStats } from "@/domain/stats";
import { formatMinutes } from "@/lib/format";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CATEGORY_META } from "@/components/tasks/task-meta";

export function CategoryBreakdown({ categories }: { categories: CategoryStats[] }) {
  return (
    <ul className="space-y-5">
      {categories.map((item) => {
        const meta = CATEGORY_META[item.category];
        const Icon = meta.icon;
        const rate = item.total === 0 ? 0 : (item.completed / item.total) * 100;
        return (
          <li key={item.category}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-ink">
                <Icon className="size-4 text-ink-muted" aria-hidden />
                {meta.label}
              </span>
              <span className="text-ink-muted">
                {item.completed}/{item.total} · {formatMinutes(item.focusMinutes)}
              </span>
            </div>
            <ProgressBar value={rate} tone={meta.tone} label={`Progreso en ${meta.label}`} />
          </li>
        );
      })}
    </ul>
  );
}
