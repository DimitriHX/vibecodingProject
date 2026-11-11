/** Base class for expected, user-facing failures. */
export abstract class DomainError extends Error {
  abstract readonly code: string;

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
