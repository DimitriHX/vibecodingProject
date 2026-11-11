"use client";

import { Check, Timer, Trash2 } from "lucide-react";
import type { Task } from "@/domain/task";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CATEGORY_META, PRIORITY_META } from "./task-meta";

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onSelect: (task: Task) => void;
}

export function TaskItem({ task, isSelected, onToggle, onDelete, onSelect }: TaskItemProps) {
  const category = CATEGORY_META[task.category];
  const priority = PRIORITY_META[task.priority];
  const CategoryIcon = category.icon;

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-2xl border bg-surface p-4 transition-colors",
        isSelected ? "border-primary ring-2 ring-primary-soft" : "border-line hover:border-primary/40",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={task.completed ? `Marcar "${task.title}" como pendiente` : `Completar "${task.title}"`}
        aria-pressed={task.completed}
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.completed ? "border-sage bg-sage text-white" : "border-line hover:border-sage",
        )}
      >
        {task.completed && <Check className="size-3.5" aria-hidden />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("font-medium text-ink", task.completed && "text-ink-muted line-through")}>{task.title}</p>
        {task.description && <p className="mt-0.5 text-sm text-ink-muted">{task.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone={category.tone}>
            <CategoryIcon className="size-3" aria-hidden />
            {category.label}
          </Badge>
          <Badge tone={priority.tone}>Prioridad {priority.label.toLowerCase()}</Badge>
          {task.pomodoros > 0 && (
            <Badge tone="neutral">
              <Timer className="size-3" aria-hidden />
              {task.pomodoros}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        {!task.completed && (
          <Button variant={isSelected ? "secondary" : "ghost"} size="sm" onClick={() => onSelect(task)} aria-label={`Enfocarse en "${task.title}"`}>
            <Timer className="size-4" aria-hidden />
            <span className="hidden sm:inline">{isSelected ? "En foco" : "Enfocar"}</span>
          </Button>
        )}
        <Button variant="danger" size="sm" onClick={() => onDelete(task)} aria-label={`Eliminar "${task.title}"`}>
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </li>
  );
}
