"use client";

import { useEffect } from "react";
import { Coffee, Pause, Play, RotateCcw, Target } from "lucide-react";
import { usePomodoro, type PomodoroMode } from "@/hooks/usePomodoro";
import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PomodoroTimerProps {
  focusTaskTitle: string | null;
  onFocusComplete: (minutes: number) => void;
  focusMinutes?: number;
  breakMinutes?: number;
}

const MODES: { value: PomodoroMode; label: string; icon: typeof Target }[] = [
  { value: "focus", label: "Enfoque", icon: Target },
  { value: "break", label: "Descanso", icon: Coffee },
];

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PomodoroTimer({ focusTaskTitle, onFocusComplete, focusMinutes = 25, breakMinutes = 5 }: PomodoroTimerProps) {
  const timer = usePomodoro({
    focusMinutes,
    breakMinutes,
    onPhaseComplete: (mode, minutes) => {
      if (mode === "focus") onFocusComplete(minutes);
    },
  });

  // Mirror the countdown in the tab title while running (external system sync).
  useEffect(() => {
    if (!timer.isRunning) return;
    const previous = document.title;
    document.title = `${formatClock(timer.remainingSeconds)} · ${timer.mode === "focus" ? "Enfoque" : "Descanso"}`;
    return () => {
      document.title = previous;
    };
  }, [timer.isRunning, timer.remainingSeconds, timer.mode]);

  const isFocus = timer.mode === "focus";

  return (
    <Card className={cn("transition-colors", isFocus ? "bg-surface" : "bg-sage-soft/40")}>
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-surface-muted p-1" role="tablist" aria-label="Modo del temporizador">
        {MODES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={timer.mode === value}
            onClick={() => timer.switchMode(value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition-colors",
              timer.mode === value ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto size-52">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden>
          <circle cx="100" cy="100" r={RADIUS} className="fill-none stroke-surface-muted" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            className={cn("fill-none transition-[stroke-dashoffset] duration-300", isFocus ? "stroke-primary" : "stroke-sage")}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - timer.progress / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums text-ink" aria-live="polite" aria-atomic>
            {formatClock(timer.remainingSeconds)}
          </span>
          <span className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{isFocus ? "Enfoque" : "Descanso"}</span>
        </div>
      </div>

      <p className="mt-4 min-h-10 text-center text-sm text-ink-muted">
        {isFocus ? (
          focusTaskTitle ? (
            <>
              Trabajando en <span className="font-medium text-ink">{focusTaskTitle}</span>
            </>
          ) : (
            "Elige una tarea con «Enfocar» o haz una sesión libre."
          )
        ) : (
          "Estira, hidrátate y respira."
        )}
      </p>

      <div className="mt-2 flex justify-center gap-2">
        {timer.isRunning ? (
          <Button onClick={timer.pause}>
            <Pause className="size-4" aria-hidden />
            Pausar
          </Button>
        ) : (
          <Button onClick={timer.start}>
            <Play className="size-4" aria-hidden />
            Iniciar
          </Button>
        )}
        <Button variant="secondary" onClick={timer.reset} aria-label="Reiniciar temporizador">
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      </div>
    </Card>
  );
}
