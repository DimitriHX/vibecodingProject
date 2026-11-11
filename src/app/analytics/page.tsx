import type { Metadata } from "next";
import { Suspense } from "react";
import { getProductivityStats } from "@/server/queries";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown";
import { FocusGoalCard } from "@/components/analytics/FocusGoalCard";
import { StatsOverview } from "@/components/analytics/StatsOverview";
import { WeeklyActivityChart } from "@/components/analytics/WeeklyActivityChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatMinutes, formatWeekday } from "@/lib/format";

export const metadata: Metadata = {
  title: "Analíticas",
  description: "Métricas de productividad: tareas completadas, tiempo de enfoque y rachas.",
};

async function AnalyticsContent() {
  const stats = await getProductivityStats();
  const today = stats.weeklyActivity.at(-1);
  const bestDay = stats.weeklyActivity.reduce((best, day) => (day.focusMinutes > best.focusMinutes ? day : best));
  const weekMinutes = stats.weeklyActivity.reduce((total, day) => total + day.focusMinutes, 0);
  const weekTasks = stats.weeklyActivity.reduce((total, day) => total + day.completedTasks, 0);

  return (
    <div className="space-y-6">
      <StatsOverview stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Actividad semanal"
            description={`${formatMinutes(weekMinutes)} de enfoque y ${weekTasks} tareas completadas esta semana.`}
          />
          <WeeklyActivityChart activity={stats.weeklyActivity} />
          {bestDay.focusMinutes > 0 && (
            <p className="mt-4 text-sm text-ink-muted">
              Tu mejor día fue el <span className="font-medium capitalize text-ink">{formatWeekday(bestDay.date)}</span> con{" "}
              {formatMinutes(bestDay.focusMinutes)}.
            </p>
          )}
        </Card>
        <FocusGoalCard todayMinutes={today?.focusMinutes ?? 0} />
      </div>

      <Card>
        <CardHeader title="Distribución por categoría" description="Tareas completadas y tiempo de enfoque en cada área." />
        <CategoryBreakdown categories={stats.byCategory} />
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Métricas y progreso" description="Entiende cómo inviertes tu tiempo y mantén viva tu racha." />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </>
  );
}
