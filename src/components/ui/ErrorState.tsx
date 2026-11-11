import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Algo salió mal", message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-coral-soft bg-surface px-6 py-10 text-center">
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-coral-soft text-[#a14f57]">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-md text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          <RotateCcw className="size-4" aria-hidden />
          Reintentar
        </Button>
      )}
    </div>
  );
}
