"use client";

import { Search } from "lucide-react";
import type { TaskFilter } from "@/domain/task";
import { Input, Select } from "@/components/ui/fields";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS, withAllOption } from "./task-options";

export type TaskFilterState = Required<TaskFilter>;

export const DEFAULT_TASK_FILTER: TaskFilterState = { status: "all", category: "all", priority: "all", search: "" };

const CATEGORY_FILTER_OPTIONS = withAllOption(CATEGORY_OPTIONS, "Todas las categorías");
const PRIORITY_FILTER_OPTIONS = withAllOption(PRIORITY_OPTIONS, "Todas las prioridades");

interface TaskFiltersProps {
  value: TaskFilterState;
  onChange: (value: TaskFilterState) => void;
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  const set = <K extends keyof TaskFilterState>(key: K, next: TaskFilterState[K]) => onChange({ ...value, [key]: next });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
        <Input
          aria-label="Buscar tareas"
          placeholder="Buscar…"
          value={value.search}
          onChange={(event) => set("search", event.target.value)}
          className="pl-9"
        />
      </div>
      <Select aria-label="Filtrar por estado" value={value.status} options={STATUS_OPTIONS} onValueChange={(next) => set("status", next)} />
      <Select aria-label="Filtrar por categoría" value={value.category} options={CATEGORY_FILTER_OPTIONS} onValueChange={(next) => set("category", next)} />
      <Select aria-label="Filtrar por prioridad" value={value.priority} options={PRIORITY_FILTER_OPTIONS} onValueChange={(next) => set("priority", next)} />
    </div>
  );
}
