import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";
import { TONE_SOFT, type Tone } from "./tones";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}

export function StatCard({ label, value, hint, icon: Icon, tone = "primary" }: StatCardProps) {
  return (
    <Card className="flex items-start gap-4">
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", TONE_SOFT[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-ink-muted">{label}</p>
        <p className="text-2xl font-bold text-ink">{value}</p>
        {hint && <p className="truncate text-xs text-ink-muted">{hint}</p>}
      </div>
    </Card>
  );
}
