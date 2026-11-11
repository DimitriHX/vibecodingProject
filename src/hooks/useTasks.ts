"use client";

import { useCallback, useEffect, useState } from "react";
import { sortTasks, type CreateTaskInput, type Task } from "@/domain/task";
import { getErrorMessage } from "@/lib/api/http-client";
import { tasksApi } from "@/lib/api/tasks-api";

type Status = "loading" | "ready" | "error";

/** Owns the task list state and its synchronisation with `/api/tasks`. */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const applyResult = useCallback((result: Promise<Task[]>, isCancelled: () => boolean = () => false) => {
    return result
      .then((list) => {
        if (isCancelled()) return;
        setTasks(list);
        setStatus("ready");
        setError(null);
      })
      .catch((err: unknown) => {
        if (isCancelled()) return;
        setError(getErrorMessage(err));
        setStatus("error");
      });
  }, []);

  const fetchTasks = useCallback(() => applyResult(tasksApi.list()), [applyResult]);

  useEffect(() => {
    // Fetch on mount; state is only updated once the request settles.
    let cancelled = false;
    applyResult(tasksApi.list(), () => cancelled);
    return () => {
      cancelled = true;
    };
  }, [applyResult]);

  const reload = useCallback(() => {
    setStatus("loading");
    void fetchTasks();
  }, [fetchTasks]);

  const replace = (updated: Task) =>
    setTasks((current) => sortTasks(current.map((task) => (task.id === updated.id ? updated : task))));

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const created = await tasksApi.create(input);
    setTasks((current) => sortTasks([created, ...current]));
    return created;
  }, []);

  /** Optimistic toggle with rollback if the API call fails. */
  const toggleTask = useCallback(async (task: Task) => {
    replace({ ...task, completed: !task.completed });
    try {
      replace(await tasksApi.update(task.id, { completed: !task.completed }));
    } catch (err) {
      replace(task);
      setError(getErrorMessage(err));
    }
  }, []);

  const deleteTask = useCallback(
    async (task: Task) => {
      setTasks((current) => current.filter((item) => item.id !== task.id));
      try {
        await tasksApi.remove(task.id);
      } catch (err) {
        setError(getErrorMessage(err));
        void fetchTasks();
      }
    },
    [fetchTasks],
  );

  return {
    tasks,
    status,
    error,
    reload,
    refresh: fetchTasks,
    createTask,
    toggleTask,
    deleteTask,
    dismissError: () => setError(null),
  };
}
