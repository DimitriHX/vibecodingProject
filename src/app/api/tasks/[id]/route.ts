import type { NextRequest } from "next/server";
import { getContainer } from "@/server/container";
import { noContent, ok, readJson, withErrorHandling } from "@/server/http/api-response";
import { parseUpdateTaskInput } from "@/server/validation/task-validator";

type Context = RouteContext<"/api/tasks/[id]">;

export const GET = withErrorHandling(async (_request: NextRequest, { params }: Context) => {
  const { id } = await params;
  return ok(await getContainer().taskService.get(id));
});

export const PATCH = withErrorHandling(async (request: NextRequest, { params }: Context) => {
  const { id } = await params;
  const input = parseUpdateTaskInput(await readJson(request));
  return ok(await getContainer().taskService.update(id, input));
});

export const DELETE = withErrorHandling(async (_request: NextRequest, { params }: Context) => {
  const { id } = await params;
  await getContainer().taskService.remove(id);
  return noContent();
});
