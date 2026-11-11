"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { CreateTaskInput, TaskCategory, TaskPriority } from "@/domain/task";
import { ApiError, getErrorMessage } from "@/lib/api/http-client";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/fields";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "./task-options";

interface TaskFormProps {
  onSubmit: (input: CreateTaskInput) => Promise<unknown>;
}

const INITIAL = { title: "", description: "", category: "work" as TaskCategory, priority: "medium" as TaskPriority };

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [values, setValues] = useState(INITIAL);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.title.trim()) {
      setIssues({ title: "Escribe un título para la tarea." });
      return;
    }

    setIsSubmitting(true);
    setIssues({});
    setFormError(null);
    try {
      await onSubmit(values);
      setValues((current) => ({ ...INITIAL, category: current.category }));
    } catch (error) {
      if (error instanceof ApiError && error.issues) setIssues(error.issues);
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Título" htmlFor="task-title" error={issues.title}>
        <Input
          id="task-title"
          value={values.title}
          maxLength={120}
          placeholder="Ej. Refactorizar el módulo de pagos"
          onChange={(event) => update("title", event.target.value)}
          aria-invalid={Boolean(issues.title)}
        />
      </Field>
      <Field label="Descripción" htmlFor="task-description" error={issues.description}>
        <Input
          id="task-description"
          value={values.description}
          maxLength={500}
          placeholder="Opcional"
          onChange={(event) => update("description", event.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría" htmlFor="task-category" error={issues.category}>
          <Select id="task-category" value={values.category} options={CATEGORY_OPTIONS} onValueChange={(value) => update("category", value)} />
        </Field>
        <Field label="Prioridad" htmlFor="task-priority" error={issues.priority}>
          <Select id="task-priority" value={values.priority} options={PRIORITY_OPTIONS} onValueChange={(value) => update("priority", value)} />
        </Field>
      </div>
      {formError && !Object.keys(issues).length && (
        <p role="alert" className="text-sm text-[#a14f57]">
          {formError}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <Plus className="size-4" aria-hidden />
        {isSubmitting ? "Guardando…" : "Añadir tarea"}
      </Button>
    </form>
  );
}
