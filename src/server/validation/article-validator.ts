import { DEFAULT_ARTICLE_TAG, type ArticleQuery } from "@/domain/article";
import { ValidationError } from "@/domain/errors";

const TAG_PATTERN = /^[a-z0-9]{1,30}$/;

export function parseArticleQuery(params: URLSearchParams, defaultPerPage: number): ArticleQuery {
  const tag = (params.get("tag") ?? DEFAULT_ARTICLE_TAG).trim().toLowerCase();
  if (!TAG_PATTERN.test(tag)) {
    throw new ValidationError("La etiqueta solo puede contener letras y números (máx. 30).", { tag: "Etiqueta no válida." });
  }

  const perPageParam = Number.parseInt(params.get("perPage") ?? "", 10);
  const perPage = Number.isFinite(perPageParam) ? Math.min(Math.max(perPageParam, 1), 30) : defaultPerPage;

  return { tag, perPage };
}
