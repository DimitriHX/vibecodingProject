/** Shared colour tones so every primitive speaks the same palette. */
export type Tone = "primary" | "sage" | "lavender" | "coral" | "amber" | "neutral";

export const TONE_SOFT: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary-strong",
  sage: "bg-sage-soft text-sage-strong",
  lavender: "bg-lavender-soft text-[#6b5a80]",
  coral: "bg-coral-soft text-[#a14f57]",
  amber: "bg-amber-soft text-[#8a6a1f]",
  neutral: "bg-surface-muted text-ink-muted",
};

export const TONE_SOLID: Record<Tone, string> = {
  primary: "bg-primary",
  sage: "bg-sage",
  lavender: "bg-lavender",
  coral: "bg-coral",
  amber: "bg-[#e9c46a]",
  neutral: "bg-ink-muted",
};
