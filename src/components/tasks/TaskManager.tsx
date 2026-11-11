"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { filterTasks } from "@/domain/task";
import { useTasks } from "@/hooks/useTasks";
import { getErrorMessage } from "@/lib/api/http-client";
import { sessionsApi } from "@/lib/api/sessions-api";
import { pluralize } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PomodoroTimer } from "./PomodoroTimer";
import { DEFAULT_TASK_FILTER, TaskFilters, type TaskFilterState } from "./TaskFilters";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

/** Container component: wires the tasks hook, filters and Pomodoro together. */
export function TaskManager() {
  const { tasks, status, error, reload, refresh, createTask, toggleTask, deleteTask, dismissError } = useTasks();
  const [filter, setFilter] = useState<TaskFilterState>(DEFAULT_TASK_FILTER);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId && !task.completed) ?? null;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  const handleFocusComplete = async (minutes: number) => {
    try {
      await sessionsApi.record({ taskId: selectedTask?.id ?? null, durationMinutes: minutes });
      setNotice(`¡Sesión de ${minutes} min registrada${selectedTask ? ` para "${selectedTask.title}"` : ""}!`);
      await refresh();
    } catch (err) {
      setNotice(`No se pudo guardar la sesión: ${getErrorMessage(err)}`);
    }
  };

  if (status === "error" && tasks.length === 0) {
    return <ErrorState title="No pudimos cargar tus tareas" message={error ?? ""} onRetry={reload} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="order-2 space-y-4 lg:order-1" aria-labelledby="task-list-title">
        <div className="flex items-baseline justify-between">
          <h2 id="task-list-title" className="text-lg font-semibold text-ink">
            Tus tareas
          </h2>
          {status === "ready" && (
            <p className="text-sm text-ink-muted">
              {pluralize(pendingCount, "pendiente")} · {pluralize(tasks.length - pendingCount, "completada")}
            </p>
          )}
        </div>

        <TaskFilters value={filter} onChange={setFilter} />

        {error && status !== "error" && (
          <div role="alert" className="flex items-center justify-between rounded-xl bg-coral-soft px-4 py-2 text-sm text-[#a14f57]">
            {error}
            <button type="button" onClick={dismissError} aria-label="Cerrar aviso">
              <X className="size-4" />
            </button>
          </div>
        )}

        <TaskList
          tasks={visibleTasks}
          isLoading={status === "loading"}
          selectedTaskId={selectedTask?.id ?? null}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onSelect={(task) => setSelectedTaskId(task.id)}
        />
      </section>

      <aside className="order-1 space-y-6 lg:order-2">
        <PomodoroTimer focusTaskTitle={selectedTask?.title ?? null} onFocusComplete={handleFocusComplete} />
        {notice && (
          <p role="status" className="flex items-start gap-2 rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage-strong">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            {notice}
          </p>
        )}
        <Card>
          <CardHeader title="Nueva tarea" description="Organiza tu próximo bloque de enfoque." />
          <TaskForm onSubmit={createTask} />
        </Card>
      </aside>
    </div>
  );
}
