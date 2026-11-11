import "server-only";
import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess } from "@/domain/api";
import { DomainError, ExternalServiceError, NotFoundError, ValidationError } from "@/domain/errors";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

function statusFor(error: DomainError): number {
  if (error instanceof ValidationError) return 400;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ExternalServiceError) return 502;
  return 500;
}

/** Translates any thrown value into the uniform ApiFailure envelope. */
export function toErrorResponse(error: unknown) {
  if (error instanceof DomainError) {
    const issues = error instanceof ValidationError && Object.keys(error.issues).length > 0 ? error.issues : undefined;
    return NextResponse.json<ApiFailure>(
      { error: { code: error.code, message: error.message, issues } },
      { status: statusFor(error) },
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
