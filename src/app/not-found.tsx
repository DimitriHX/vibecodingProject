import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-lavender-soft text-[#6b5a80]">
        <Compass className="size-8" aria-hidden />
      </span>
      <p className="text-sm font-semibold text-lavender">Error 404</p>
      <h1 className="mt-1 text-2xl font-bold text-ink">Esta página se perdió en el flujo</h1>
      <p className="mt-2 max-w-md text-ink-muted">La ruta que buscas no existe o fue movida.</p>
      <Link href="/" className="mt-6 rounded-xl bg-primary-strong px-4 py-2 text-sm font-medium text-white hover:bg-[#435f80]">
        Volver al dashboard
      </Link>
    </div>
  );
}
