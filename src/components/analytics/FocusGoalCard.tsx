"use client";

import { Target } from "lucide-react";
import { useLocalStorageNumber } from "@/hooks/useLocalStorage";
import { formatMinutes } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

const GOAL_KEY = "focusflow:daily-goal";
const DEFAULT_GOAL = 100;

export function FocusGoalCard({ todayMinutes }: { todayMinutes: number }) {
  const [goal, setGoal] = useLocalStorageNumber(GOAL_KEY, DEFAULT_GOAL);
  const progress = (todayMinutes / goal) * 100;
  const remaining = Math.max(goal - todayMinutes, 0);

  return (
    <Card>
      <CardHeader title="Meta diaria" description="Ajusta tu objetivo de enfoque; se guarda en este navegador." />
      <div className="mb-4 flex items-end justify-between">
        <p className="text-3xl font-bold text-ink">
          {Math.min(Math.round(progress), 100)}
          <span className="text-lg text-ink-muted">%</span>
        </p>
        <Target className="size-6 text-lavender" aria-hidden />
      </div>
      <ProgressBar value={progress} tone="lavender" label="Progreso de la meta diaria" />
      <p className="mt-3 text-sm text-ink-muted">
        {remaining === 0 ? "¡Meta cumplida! 🎉" : `Te faltan ${formatMinutes(remaining)} para ${formatMinutes(goal)}.`}
      </p>
      <label htmlFor="goal-range" className="mt-5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
        Objetivo: {formatMinutes(goal)}
      </label>
      <input
        id="goal-range"
        type="range"
        min={25}
        max={300}
        step={25}
        value={goal}
        onChange={(event) => setGoal(Number(event.target.value))}
        className="mt-2 w-full accent-[#b8a9c9]"
      />
    </Card>
  );
}
