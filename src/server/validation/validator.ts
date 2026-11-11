import { ValidationError } from "@/domain/errors";

/**
 * Collects field issues and throws a single ValidationError,
 * so every validator reports all problems at once.
 */
export class IssueCollector {
  private readonly issues: Record<string, string> = {};

  add(field: string, message: string): this {
    this.issues[field] ??= message;
    return this;
  }

  throwIfAny(message = "Los datos enviados no son válidos."): void {
    if (Object.keys(this.issues).length > 0) {
      throw new ValidationError(message, this.issues);
    }
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assertRecord(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ValidationError("El cuerpo de la petición debe ser un objeto JSON.");
  }
  return value;
}
