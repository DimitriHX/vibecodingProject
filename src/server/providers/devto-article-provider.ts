import "server-only";
import { cacheLife } from "next/cache";
import type { Article, ArticleQuery } from "@/domain/article";
import { ExternalServiceError } from "@/domain/errors";
import type { ArticleProvider } from "./article-provider";
import { mapDevToArticle, type DevToArticleDto } from "./devto-mapper";

export interface DevToConfig {
  baseUrl: string;
  apiKey?: string;
  cacheSeconds: number;
}

/**
 * Cached at the data level so every caller (pages and Route Handlers)
 * shares the same DEV.to response for `cacheSeconds`.
 */
async function fetchDevToArticles(url: string, apiKey: string | undefined, cacheSeconds: number): Promise<Article[]> {
  "use cache";
  cacheLife({ revalidate: cacheSeconds, expire: cacheSeconds * 6 });

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.forem.api-v1+json",
      ...(apiKey ? { "api-key": apiKey } : {}),
    },
  });

  if (!response.ok) {
    throw new ExternalServiceError(`DEV.to respondió con estado ${response.status}.`);
  }

  const payload = (await response.json()) as DevToArticleDto[];
  return payload.map(mapDevToArticle);
}

export class DevToArticleProvider implements ArticleProvider {
  constructor(private readonly config: DevToConfig) {}

  async fetchArticles({ tag, perPage }: Required<ArticleQuery>): Promise<Article[]> {
    const url = new URL(`${this.config.baseUrl.replace(/\/$/, "")}/articles`);
    url.searchParams.set("tag", tag);
    url.searchParams.set("per_page", String(perPage));

    try {
      return await fetchDevToArticles(url.toString(), this.config.apiKey, this.config.cacheSeconds);
    } catch (error) {
      if (error instanceof ExternalServiceError) throw error;
      throw new ExternalServiceError("No se pudo conectar con DEV.to. Inténtalo de nuevo en unos minutos.");
    }
  }
}
