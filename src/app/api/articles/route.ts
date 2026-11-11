import type { NextRequest } from "next/server";
import { getContainer } from "@/server/container";
import { serverEnv } from "@/server/config/env";
import { ok, withErrorHandling } from "@/server/http/api-response";
import { parseArticleQuery } from "@/server/validation/article-validator";

/** Backend-for-frontend proxy: hides the DEV.to URL/API key and normalizes its payload. */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const query = parseArticleQuery(request.nextUrl.searchParams, serverEnv.devTo.perPage);
  return ok(await getContainer().articleService.getByTag(query));
});
