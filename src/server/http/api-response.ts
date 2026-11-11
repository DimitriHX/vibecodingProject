import "server-only";
import { unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess } from "@/domain/api";
import { isDomainError, ValidationError, type DomainErrorCode } from "@/domain/errors";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

const STATUS_BY_CODE: Record<DomainErrorCode, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  EXTERNAL_SERVICE_ERROR: 502,
};

/** Translates any thrown value into the uniform ApiFailure envelope. */
export function toErrorResponse(error: unknown) {
  if (isDomainError(error)) {
    const issues = error.issues && Object.keys(error.issues).length > 0 ? error.issues : undefined;
    return NextResponse.json<ApiFailure>(
      { error: { code: error.code, message: error.message, issues } },
      { status: STATUS_BY_CODE[error.code] },
    );
  }

  console.error("[api] Unexpected error", error);
  return NextResponse.json<ApiFailure>(
    { error: { code: "INTERNAL_ERROR", message: "Ha ocurrido un error inesperado." } },
    { status: 500 },
  );
}

/** Higher-order handler: keeps every Route Handler free of try/catch boilerplate. */
export function withErrorHandling<Args extends unknown[]>(handler: (...args: Args) => Promise<Response>) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Let Next.js internal control-flow errors (prerender bailouts, redirects...) propagate.
      unstable_rethrow(error);
      return toErrorResponse(error);
    }
  };
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("El cuerpo de la petición no es un JSON válido.");
  }
}
