import type { FocusSession } from "@/domain/focus-session";
import type { Task, TaskCategory, TaskPriority } from "@/domain/task";
import { addDays } from "../shared/dates";
import type { IdGenerator } from "../shared/id-generator";

interface TaskSeed {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  createdDaysAgo: number;
  completedDaysAgo?: number;
  pomodoros?: number;
}

const TASK_SEEDS: TaskSeed[] = [
  { title: "Configurar Route Handlers", description: "Crear endpoints REST para tareas y métricas.", category: "work", priority: "high", createdDaysAgo: 6, completedDaysAgo: 5, pomodoros: 3 },
  { title: "Leer guía de Server Components", description: "Repasar la frontera entre Server y Client Components.", category: "study", priority: "medium", createdDaysAgo: 5, completedDaysAgo: 3, pomodoros: 2 },
  { title: "Caminar 30 minutos", description: "Pausa activa después del bloque de la mañana.", category: "health", priority: "low", createdDaysAgo: 3, completedDaysAgo: 1 },
  { title: "Revisar pull requests pendientes", description: "Dar feedback a los PR del equipo.", category: "work", priority: "high", createdDaysAgo: 2, completedDaysAgo: 0, pomodoros: 1 },
  { title: "Practicar TypeScript genéricos", description: "Resolver 5 ejercicios de type-challenges.", category: "study", priority: "medium", createdDaysAgo: 1 },
  { title: "Planificar la semana", description: "Definir los tres objetivos principales.", category: "personal", priority: "medium", createdDaysAgo: 1 },
  { title: "Desplegar en Vercel", description: "Configurar variables de entorno y dominio.", category: "work", priority: "high", createdDaysAgo: 0 },
  { title: "Meditación guiada", description: "10 minutos antes de dormir.", category: "health", priority: "low", createdDaysAgo: 0 },
];

const SESSION_SEEDS: { daysAgo: number; minutes: number; taskIndex: number | null }[] = [
  { daysAgo: 6, minutes: 25, taskIndex: 0 },
  { daysAgo: 5, minutes: 50, taskIndex: 0 },
  { daysAgo: 4, minutes: 25, taskIndex: 1 },
  { daysAgo: 3, minutes: 25, taskIndex: 1 },
  { daysAgo: 2, minutes: 15, taskIndex: null },
  { daysAgo: 1, minutes: 25, taskIndex: 2 },
  { daysAgo: 0, minutes: 25, taskIndex: 3 },
];

/** Demo data relative to `now`, so charts always show a recent week. */
export function createSeedData(now: Date, ids: IdGenerator): { tasks: Task[]; sessions: FocusSession[] } {
  const iso = (daysAgo: number) => addDays(now, -daysAgo).toISOString();

  const tasks: Task[] = TASK_SEEDS.map((seed) => ({
    id: ids.next(),
    title: seed.title,
    description: seed.description,
    category: seed.category,
    priority: seed.priority,
    completed: seed.completedDaysAgo !== undefined,
    pomodoros: seed.pomodoros ?? 0,
    createdAt: iso(seed.createdDaysAgo),
    completedAt: seed.completedDaysAgo !== undefined ? iso(seed.completedDaysAgo) : null,
  }));

  const sessions: FocusSession[] = SESSION_SEEDS.map((seed) => {
    const task = seed.taskIndex !== null ? tasks[seed.taskIndex] : null;
    return {
      id: ids.next(),
      taskId: task?.id ?? null,
      category: task?.category ?? null,
      durationMinutes: seed.minutes,
      completedAt: iso(seed.daysAgo),
    };
  });

  return { tasks, sessions };
}
