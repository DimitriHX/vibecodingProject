"use client";

import { cn } from "@/lib/cn";

interface TagSelectorProps {
  tags: readonly string[];
  value: string;
  onChange: (tag: string) => void;
}

export function TagSelector({ tags, value, onChange }: TagSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Etiqueta">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          role="radio"
          aria-checked={tag === value}
          onClick={() => onChange(tag)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            tag === value
              ? "border-primary bg-primary-soft text-primary-strong"
              : "border-line bg-surface text-ink-muted hover:border-primary/50 hover:text-ink",
          )}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
