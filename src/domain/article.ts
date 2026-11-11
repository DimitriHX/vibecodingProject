export interface ArticleAuthor {
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  coverImage: string | null;
  tags: string[];
  readingTimeMinutes: number;
  reactions: number;
  comments: number;
  publishedAt: string;
  author: ArticleAuthor;
}

export interface ArticleQuery {
  tag: string;
  perPage?: number;
}

export const ARTICLE_TAGS = [
  "nextjs",
  "react",
  "typescript",
  "javascript",
  "ai",
  "productivity",
  "webdev",
  "css",
] as const;

export const DEFAULT_ARTICLE_TAG = ARTICLE_TAGS[0];
