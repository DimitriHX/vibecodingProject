import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";
import { getPendingTasks } from "@/server/queries";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORY_META, PRIORITY_META } from "@/components/tasks/task-meta";

export async function PendingTasks({ limit = 4 }: { limit?: number }) {
  const tasks = await getPendingTasks(limit);

  if (tasks.length === 0) {
    return <EmptyState icon={PartyPopper} title="¡Todo al día!" description="No tienes tareas pendientes." />;
  }

  return (
    <>
      <ul className="divide-y divide-line">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
            <span className="min-w-0 truncate text-sm font-medium text-ink">{task.title}</span>
            <span className="flex shrink-0 gap-1.5">
              <Badge tone={CATEGORY_META[task.category].tone}>{CATEGORY_META[task.category].label}</Badge>
              <Badge tone={PRIORITY_META[task.priority].tone} className="hidden sm:inline-flex">
                {PRIORITY_META[task.priority].label}
              </Badge>
            </span>
          </li>
        ))}
      </ul>
      <Link href="/tasks" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-strong hover:underline">
        Ver todas las tareas <ArrowRight className="size-4" aria-hidden />
      </Link>
    </>
  );
}
