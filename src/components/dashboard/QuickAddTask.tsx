"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { getErrorMessage } from "@/lib/api/http-client";
import { tasksApi } from "@/lib/api/tasks-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/fields";

/** Client widget that posts to `/api/tasks` and refreshes the Server Components around it. */
export function QuickAddTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startTransition] = useTransition();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      await tasksApi.create({ title, category: "work", priority: "medium" });
      setTitle("");
      startTransition(() => router.refresh());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const isBusy = isSaving || isRefreshing;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          aria-label="Título de la tarea rápida"
          placeholder="Añade una tarea rápida…"
          value={title}
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button type="submit" disabled={isBusy || !title.trim()} aria-label="Añadir tarea">
          <Plus className="size-4" aria-hidden />
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#a14f57]">
          {error}
        </p>
      )}
    </form>
  );
}
