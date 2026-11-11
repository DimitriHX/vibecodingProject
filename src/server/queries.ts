import "server-only";
import { connection } from "next/server";
import type { ArticleQuery } from "@/domain/article";
import { getContainer } from "./container";

/**
 * Read models for Server Components. `connection()` marks the read as
 * request-time so runtime data is never frozen into the static shell.
 */
export async function getProductivityStats() {
  await connection();
  return getContainer().statsService.getProductivityStats();
}

export async function getPendingTasks(limit: number) {
  await connection();
  const tasks = await getContainer().taskService.list({ status: "pending" });
  return tasks.slice(0, limit);
}

export async function getArticles(query: ArticleQuery) {
  await connection();
  return getContainer().articleService.getByTag(query);
}
