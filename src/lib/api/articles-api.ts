import type { Article } from "@/domain/article";
import { apiRequest } from "./http-client";

export const articlesApi = {
  listByTag: (tag: string, signal?: AbortSignal) =>
    apiRequest<Article[]>(`/api/articles?tag=${encodeURIComponent(tag)}`, { signal }),
};
