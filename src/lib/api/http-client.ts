import type { ApiResponse } from "@/domain/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly issues?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Thin fetch wrapper for the internal Route Handlers: sets JSON headers,
 * unwraps the `{ data }` envelope and turns `{ error }` into an ApiError.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError("No hay conexión con el servidor.", 0, "NETWORK_ERROR");
  }

  if (response.status === 204) return undefined as T;

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !body || "error" in body) {
    const failure = body && "error" in body ? body.error : null;
    throw new ApiError(
      failure?.message ?? `Error ${response.status}`,
      response.status,
      failure?.code ?? "UNKNOWN_ERROR",
      failure?.issues,
    );
  }
  return body.data;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ha ocurrido un error inesperado.";
}
