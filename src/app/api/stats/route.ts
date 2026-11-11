import { connection } from "next/server";
import { getContainer } from "@/server/container";
import { ok, withErrorHandling } from "@/server/http/api-response";

export const GET = withErrorHandling(async () => {
  // In-memory data changes at runtime: never bake it into the build output.
  await connection();
  return ok(await getContainer().statsService.getProductivityStats());
});
