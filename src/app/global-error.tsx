"use client";

import "./globals.css";

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-canvas p-6 font-sans text-ink">
        <title>Error · FocusFlow</title>
        <div className="max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">FocusFlow no está disponible</h1>
          <p className="mt-2 text-ink-muted">Se produjo un error crítico al cargar la aplicación.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 rounded-xl bg-primary-strong px-4 py-2 text-sm font-medium text-white"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
