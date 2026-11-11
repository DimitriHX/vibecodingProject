import { BookOpen, Briefcase, HeartPulse, User, type LucideIcon } from "lucide-react";
import type { TaskCategory, TaskPriority } from "@/domain/task";
import type { Tone } from "@/components/ui/tones";

interface Meta {
  label: string;
  tone: Tone;
}

/** Presentation metadata kept apart from the domain model. */
export const CATEGORY_META: Record<TaskCategory, Meta & { icon: LucideIcon }> = {
  work: { label: "Trabajo", tone: "primary", icon: Briefcase },
  study: { label: "Estudio", tone: "lavender", icon: BookOpen },
  health: { label: "Salud", tone: "sage", icon: HeartPulse },
  personal: { label: "Personal", tone: "amber", icon: User },
};

export const PRIORITY_META: Record<TaskPriority, Meta> = {
  high: { label: "Alta", tone: "coral" },
  medium: { label: "Media", tone: "amber" },
  low: { label: "Baja", tone: "neutral" },
};
