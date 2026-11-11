import "server-only";

function readNumber(name: string, fallback: number, { min, max }: { min: number; max: number }): number {
  const raw = process.env[name];
  const value = raw ? Number.parseInt(raw, 10) : fallback;
  return Number.isFinite(value) ? Math.min(Math.max(value, min), max) : fallback;
}

/** Typed, validated access to server-side environment variables. */
export const serverEnv = {
  devTo: {
    baseUrl: process.env.DEVTO_API_URL || "https://dev.to/api",
    apiKey: process.env.DEVTO_API_KEY || undefined,
    perPage: readNumber("DEVTO_ARTICLES_PER_PAGE", 12, { min: 1, max: 30 }),
    cacheSeconds: readNumber("DEVTO_CACHE_SECONDS", 600, { min: 60, max: 86_400 }),
  },
} as const;
