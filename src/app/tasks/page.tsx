import type { Metadata } from "next";
import { TaskManager } from "@/components/tasks/TaskManager";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Tareas y Pomodoro",
  description: "Gestiona tus tareas y trabaja en bloques de enfoque con el temporizador Pomodoro.",
};

export default function TasksPage() {
  return (
    <>
      <PageHeader
        title="Tablero de enfoque"
        description="Crea, filtra y completa tareas. Selecciona una para dedicarle una sesión Pomodoro de 25 minutos."
      />
      <TaskManager />
    </>
  );
}
