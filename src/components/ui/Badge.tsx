import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TONE_SOFT, type Tone } from "./tones";

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", TONE_SOFT[tone], className)}>
      {children}
    </span>
  );
}
