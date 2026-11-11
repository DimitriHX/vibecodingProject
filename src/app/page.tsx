import { Suspense } from "react";
import Link from "next/link";
import { Timer } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { FeaturedArticles } from "@/components/dashboard/FeaturedArticles";
import { PendingTasks } from "@/components/dashboard/PendingTasks";
import { QuickAddTask } from "@/components/dashboard/QuickAddTask";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { Card, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

function ListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-10" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Hola, bienvenido a tu flujo"
        description="Un vistazo rápido a tu productividad, tus próximas tareas y lecturas recomendadas."
        action={
          <Link
            href="/tasks"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-strong px-4 text-sm font-medium text-white hover:bg-[#435f80]"
          >
            <Timer className="size-4" aria-hidden />
            Empezar Pomodoro
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Suspense fallback={<AnalyticsSkeleton />}>
          <DashboardStats />
        </Suspense>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Próximas tareas" />
            <div className="mb-4">
              <QuickAddTask />
            </div>
            <Suspense fallback={<ListSkeleton />}>
              <PendingTasks />
            </Suspense>
          </Card>
          <Card>
            <CardHeader title="Lecturas recomendadas" description="Desde DEV.to · #productivity" />
            <Suspense fallback={<ListSkeleton />}>
              <FeaturedArticles />
            </Suspense>
          </Card>
        </div>
      </div>
    </>
  );
}
