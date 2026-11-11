"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { ARTICLE_TAGS, type Article } from "@/domain/article";
import { useArticles } from "@/hooks/useArticles";
import { Input } from "@/components/ui/fields";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ArticleGrid, ArticleGridSkeleton } from "./ArticleGrid";
import { TagSelector } from "./TagSelector";

interface ArticleExplorerProps {
  initialTag: string;
  initialArticles: Article[];
}

export function ArticleExplorer({ initialTag, initialArticles }: ArticleExplorerProps) {
  const [tag, setTag] = useState(initialTag);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { articles, isLoading, error, retry } = useArticles(tag, { tag: initialTag, articles: initialArticles });

  const visible = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    if (!needle) return articles;
    return articles.filter((article) => `${article.title} ${article.description}`.toLowerCase().includes(needle));
  }, [articles, deferredQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <TagSelector tags={ARTICLE_TAGS} value={tag} onChange={setTag} />
        <Input
          type="search"
          aria-label="Filtrar artículos"
          placeholder="Filtrar por título…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="lg:max-w-xs"
        />
      </div>

      {isLoading ? (
        <ArticleGridSkeleton />
      ) : error ? (
        <ErrorState title="DEV.to no respondió" message={error} onRetry={retry} />
      ) : visible.length === 0 ? (
        <EmptyState icon={SearchX} title="Sin resultados" description="Prueba con otra etiqueta o cambia el texto de búsqueda." />
      ) : (
        <ArticleGrid articles={visible} />
      )}
    </div>
  );
}
