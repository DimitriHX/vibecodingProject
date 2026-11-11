import type { NextRequest } from "next/server";
import { connection } from "next/server";
import { getContainer } from "@/server/container";
import { created, ok, readJson, withErrorHandling } from "@/server/http/api-response";
import { parseRecordFocusSessionInput } from "@/server/validation/focus-session-validator";

export const GET = withErrorHandling(async () => {
  await connection();
  return ok(await getContainer().focusSessionService.list());
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const input = parseRecordFocusSessionInput(await readJson(request));
  return created(await getContainer().focusSessionService.record(input));
});
