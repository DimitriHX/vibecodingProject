import type { Article, ArticleQuery } from "@/domain/article";
import type { ArticleProvider } from "../providers/article-provider";

export class ArticleService {
  constructor(
    private readonly provider: ArticleProvider,
    private readonly defaultPerPage: number,
  ) {}

  async getByTag({ tag, perPage }: ArticleQuery): Promise<Article[]> {
    return this.provider.fetchArticles({ tag, perPage: perPage ?? this.defaultPerPage });
  }
}
