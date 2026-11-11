import type { Metadata } from "next";
import { Suspense } from "react";
import { DEFAULT_ARTICLE_TAG } from "@/domain/article";
import { getArticles } from "@/server/queries";
import { ArticleExplorer } from "@/components/explore/ArticleExplorer";
import { ArticleGridSkeleton } from "@/components/explore/ArticleGrid";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Explorar artículos",
  description: "Artículos técnicos en tiempo real desde DEV.to, filtrados por etiqueta.",
};

/** Server Component: fetches the first tag on the server, then hands off to the client explorer. */
async function ExploreContent() {
  const articles = await getArticles({ tag: DEFAULT_ARTICLE_TAG });
  return <ArticleExplorer initialTag={DEFAULT_ARTICLE_TAG} initialArticles={articles} />;
}

export default function ExplorePage() {
  return (
    <>
      <PageHeader
        title="Explorador de recursos"
        description="Lo último de la comunidad DEV.to sobre las tecnologías que usas cada día."
      />
      <Suspense fallback={<ArticleGridSkeleton />}>
        <ExploreContent />
      </Suspense>
    </>
  );
}
