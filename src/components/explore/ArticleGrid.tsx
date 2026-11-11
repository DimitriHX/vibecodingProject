import type { Article } from "@/domain/article";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArticleCard } from "./ArticleCard";

const GRID = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className={GRID}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-80" />
      ))}
    </div>
  );
}
