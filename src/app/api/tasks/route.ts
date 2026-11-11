import type { NextRequest } from "next/server";
import { getContainer } from "@/server/container";
import { created, ok, readJson, withErrorHandling } from "@/server/http/api-response";
import { parseCreateTaskInput, parseTaskFilter } from "@/server/validation/task-validator";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const filter = parseTaskFilter(request.nextUrl.searchParams);
  return ok(await getContainer().taskService.list(filter));
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const input = parseCreateTaskInput(await readJson(request));
  return created(await getContainer().taskService.create(input));
});
