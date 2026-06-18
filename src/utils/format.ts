/**
 * India-aware number/currency formatters.
 * Centralised here so every screen renders numbers consistently.
 */

const numFmt = new Intl.NumberFormat("en-IN");
const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatNumber = (n: number): string => numFmt.format(Math.round(n));
export const formatINR = (n: number): string => inrFmt.format(n);

/** Format kg → either "850 kg" or "1.20 t" depending on magnitude. */
export function formatKg(kg: number): string {
  if (!Number.isFinite(kg)) return "—";
  if (Math.abs(kg) >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${formatNumber(kg)} kg`;
}

export const formatTons = (kg: number): string => `${(kg / 1000).toFixed(2)} t`;
