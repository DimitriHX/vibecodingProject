export const DOMAIN_ERROR_CODES = ["VALIDATION_ERROR", "NOT_FOUND", "EXTERNAL_SERVICE_ERROR"] as const;
export type DomainErrorCode = (typeof DOMAIN_ERROR_CODES)[number];

/** Base class for expected, user-facing failures. */
export abstract class DomainError extends Error {
  abstract readonly code: DomainErrorCode;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";

  constructor(
    message: string,
    readonly issues: Record<string, string> = {},
  ) {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";
}

export class ExternalServiceError extends DomainError {
  readonly code = "EXTERNAL_SERVICE_ERROR";
}

/**
 * Structural check by `code`. Next.js may bundle this module into several
 * server layers (RSC, SSR, Route Handlers), so `instanceof` is not reliable
 * for errors thrown by services shared between them.
 */
export function isDomainError(error: unknown): error is DomainError & { issues?: Record<string, string> } {
  return (
    error instanceof Error &&
    "code" in error &&
    DOMAIN_ERROR_CODES.includes((error as { code: unknown }).code as DomainErrorCode)
  );
}
