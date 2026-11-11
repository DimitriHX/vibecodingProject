import { CheckCircle2, Flame, ListTodo, Timer } from "lucide-react";
import type { ProductivityStats } from "@/domain/stats";
import { formatMinutes, pluralize } from "@/lib/format";
import { cn } from "@/lib/cn";
import { StatCard } from "@/components/ui/StatCard";

const LAYOUTS = {
  wide: "sm:grid-cols-2 lg:grid-cols-4",
  compact: "sm:grid-cols-2",
} as const;

interface StatsOverviewProps {
  stats: ProductivityStats;
  layout?: keyof typeof LAYOUTS;
}

export function StatsOverview({ stats, layout = "wide" }: StatsOverviewProps) {
  return (
    <div className={cn("grid gap-4", LAYOUTS[layout])}>
      <StatCard label="Tareas completadas" value={`${stats.completionRate}%`} hint={`${stats.completedTasks} de ${stats.totalTasks}`} icon={CheckCircle2} tone="sage" />
      <StatCard label="Pendientes" value={stats.pendingTasks} hint="Listas para tu próximo bloque" icon={ListTodo} tone="primary" />
      <StatCard label="Tiempo de enfoque" value={formatMinutes(stats.totalFocusMinutes)} hint={pluralize(stats.sessionsCount, "sesión", "sesiones")} icon={Timer} tone="lavender" />
      <StatCard label="Racha actual" value={pluralize(stats.currentStreak, "día")} hint="Días consecutivos activos" icon={Flame} tone="coral" />
    </div>
  );
}
