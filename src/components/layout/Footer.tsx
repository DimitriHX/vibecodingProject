import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-semibold text-ink">{siteConfig.name}</span> · Enfócate en lo que importa.
        </p>
        <p>
          Construido con Next.js 16, TypeScript y Tailwind CSS · Artículos por{" "}
          <a href="https://dev.to" target="_blank" rel="noreferrer" className="underline hover:text-ink">
            DEV.to
          </a>
        </p>
      </div>
    </footer>
  );
}
