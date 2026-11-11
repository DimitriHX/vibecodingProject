"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <div className="py-10">
      <ErrorState
        title="No pudimos cargar esta sección"
        message={`Ocurrió un error inesperado. Puedes intentarlo de nuevo${digest ? ` (ref: ${digest})` : ""}.`}
        onRetry={retry}
      />
    </div>
  );
}
