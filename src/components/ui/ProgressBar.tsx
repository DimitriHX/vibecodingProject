import { cn } from "@/lib/cn";
import { TONE_SOLID, type Tone } from "./tones";

interface ProgressBarProps {
  /** Value between 0 and 100. */
  value: number;
  tone?: Tone;
  label: string;
  className?: string;
}

export function ProgressBar({ value, tone = "primary", label, className }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-surface-muted", className)}
    >
      <div className={cn("h-full rounded-full transition-all duration-500", TONE_SOLID[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}
