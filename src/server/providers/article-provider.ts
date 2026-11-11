import type { Article, ArticleQuery } from "@/domain/article";

/** Port for any external source of technical articles. */
export interface ArticleProvider {
  fetchArticles(query: Required<ArticleQuery>): Promise<Article[]>;
}
