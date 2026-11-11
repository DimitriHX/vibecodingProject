"use client";

import { ListChecks } from "lucide-react";
import type { Task } from "@/domain/task";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  selectedTaskId: string | null;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onSelect: (task: Task) => void;
}

export function TaskList({ tasks, isLoading, selectedTaskId, ...handlers }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState icon={ListChecks} title="No hay tareas aquí" description="Crea una nueva tarea o ajusta los filtros." />;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} isSelected={task.id === selectedTaskId} {...handlers} />
      ))}
    </ul>
  );
}
