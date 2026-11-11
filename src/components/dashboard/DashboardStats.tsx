import { getProductivityStats } from "@/server/queries";
import { StatsOverview } from "@/components/analytics/StatsOverview";
import { WeeklyActivityChart } from "@/components/analytics/WeeklyActivityChart";
import { Card, CardHeader } from "@/components/ui/Card";

export async function DashboardStats() {
  const stats = await getProductivityStats();

  return (
    <div className="space-y-6">
      <StatsOverview stats={stats} layout="compact" />
      <Card>
        <CardHeader title="Enfoque de los últimos 7 días" description="Minutos registrados con el temporizador Pomodoro." />
        <WeeklyActivityChart activity={stats.weeklyActivity} />
      </Card>
    </div>
  );
}
