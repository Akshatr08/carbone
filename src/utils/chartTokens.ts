/**
 * Single source of truth for chart colors. Pulled from the same palette as
 * the Tailwind theme tokens so visualisations and UI stay in lockstep.
 */
export const CHART_TOKENS = {
  gold: "#B8862A",
  goldDeep: "#9F731C",
  charcoal: "#1A1A18",
  eco: "#C0DD97",
  ecoStrong: "#5A8A2A",
  neutral: "#D3D1C7",
  grid: "#E8E4DC",
  muted: "#6B6B62",
  surface: "#FFFFFF",
} as const;

export const CATEGORY_COLORS = {
  transport: CHART_TOKENS.gold,
  energy: CHART_TOKENS.charcoal,
  food: CHART_TOKENS.eco,
  shopping: CHART_TOKENS.neutral,
} as const;
