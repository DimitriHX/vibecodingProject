import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/domain/article";
import { getArticles } from "@/server/queries";

/** Non-critical widget: if DEV.to fails, it degrades gracefully instead of breaking the dashboard. */
export async function FeaturedArticles({ tag = "productivity", limit = 3 }: { tag?: string; limit?: number }) {
  let articles: Article[] | null = null;
  try {
    articles = await getArticles({ tag, perPage: limit });
  } catch (error) {
    unstable_rethrow(error);
  }

  if (!articles) {
    return <p className="text-sm text-ink-muted">Los artículos no están disponibles en este momento.</p>;
  }

  return (
    <>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id}>
            <a href={article.url} target="_blank" rel="noreferrer" className="group block">
              <p className="line-clamp-2 text-sm font-medium text-ink group-hover:text-primary-strong">{article.title}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                {article.author.name} · <Clock className="size-3" aria-hidden /> {article.readingTimeMinutes} min
              </p>
            </a>
          </li>
        ))}
      </ul>
      <Link href="/explore" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-strong hover:underline">
        Explorar más <ArrowRight className="size-4" aria-hidden />
      </Link>
    </>
  );
}
