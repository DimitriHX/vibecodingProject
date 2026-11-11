import Image from "next/image";
import { Clock, Heart, MessageCircle } from "lucide-react";
import type { Article } from "@/domain/article";
import { formatShortDate } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/1] bg-gradient-to-br from-primary-soft via-lavender-soft to-sage-soft">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} tone="lavender">
              #{tag}
            </Badge>
          ))}
        </div>
        <h3 className="line-clamp-2 font-semibold text-ink">
          <a href={article.url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 focus:outline-none">
            {article.title}
          </a>
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-muted">{article.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-ink-muted">
          <span className="flex min-w-0 items-center gap-2">
            {article.author.avatarUrl && (
              <Image src={article.author.avatarUrl} alt="" width={24} height={24} className="rounded-full" />
            )}
            <span className="truncate">
              {article.author.name} · {formatShortDate(article.publishedAt)}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1" title="Reacciones">
              <Heart className="size-3.5" aria-hidden /> {article.reactions}
            </span>
            <span className="flex items-center gap-1" title="Comentarios">
              <MessageCircle className="size-3.5" aria-hidden /> {article.comments}
            </span>
            <span className="flex items-center gap-1" title="Tiempo de lectura">
              <Clock className="size-3.5" aria-hidden /> {article.readingTimeMinutes}m
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
