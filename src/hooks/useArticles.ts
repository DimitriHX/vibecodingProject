"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/domain/article";
import { articlesApi } from "@/lib/api/articles-api";
import { getErrorMessage } from "@/lib/api/http-client";

type Entry = { status: "success"; articles: Article[] } | { status: "error"; message: string };

/**
 * Fetches articles per tag through `/api/articles`, caching each tag's
 * result so switching back to a tag is instant. Loading is derived:
 * a tag without an entry is still loading.
 */
export function useArticles(tag: string, initial: { tag: string; articles: Article[] }) {
  const [entries, setEntries] = useState<Record<string, Entry>>({
    [initial.tag]: { status: "success", articles: initial.articles },
  });

  const entry = entries[tag];

  useEffect(() => {
    if (entry) return;

    const controller = new AbortController();
    articlesApi
      .listByTag(tag, controller.signal)
      .then((articles) => setEntries((prev) => ({ ...prev, [tag]: { status: "success", articles } })))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setEntries((prev) => ({ ...prev, [tag]: { status: "error", message: getErrorMessage(error) } }));
      });

    return () => controller.abort();
  }, [tag, entry]);

  const retry = () =>
    setEntries((prev) => {
      const next = { ...prev };
      delete next[tag];
      return next;
    });

  return {
    articles: entry?.status === "success" ? entry.articles : [],
    isLoading: !entry,
    error: entry?.status === "error" ? entry.message : null,
    retry,
  };
}
