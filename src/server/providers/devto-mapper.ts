import type { Article } from "@/domain/article";

/** Subset of the DEV.to `/articles` payload this app relies on. */
export interface DevToArticleDto {
  id: number;
  title: string;
  description: string | null;
  url: string;
  cover_image: string | null;
  social_image?: string | null;
  tag_list: string[] | string;
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number;
  published_timestamp: string;
  user: {
    name: string;
    username: string;
    profile_image_90?: string | null;
  };
}

function normalizeTags(tags: DevToArticleDto["tag_list"]): string[] {
  return Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}

/** Anti-corruption layer: translates the DEV.to schema into the domain model. */
export function mapDevToArticle(dto: DevToArticleDto): Article {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    url: dto.url,
    coverImage: dto.cover_image ?? dto.social_image ?? null,
    tags: normalizeTags(dto.tag_list),
    readingTimeMinutes: dto.reading_time_minutes,
    reactions: dto.public_reactions_count,
    comments: dto.comments_count,
    publishedAt: dto.published_timestamp,
    author: {
      name: dto.user.name,
      username: dto.user.username,
      avatarUrl: dto.user.profile_image_90 ?? null,
    },
  };
}
