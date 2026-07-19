import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  label: string;
  value: ReactNode;
  delta?: string;
  variant?: "default" | "dark" | "gold";
  hint?: string;
}

/**
 * A Key Performance Indicator card for the dashboard.
 * @param {Props} props
 * @returns {JSX.Element} The KPICard component.
 */
export function KPICard({ eyebrow, label, value, delta, variant = "default", hint }: Props): JSX.Element {
  const base = "rounded-xl p-5 hairline";
  let cls = "bg-surface";
  if (variant === "dark") {
    cls = "bg-charcoal text-charcoal-foreground border-charcoal";
  } else if (variant === "gold") {
    cls = "bg-surface border-2 border-gold";
  }
  const muted = variant === "dark" ? "text-hint" : "text-muted-foreground";
  return (
    <div className={`${base} ${cls}`}>
      {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
      <p className={`text-xs font-medium ${muted}`}>{label}</p>
      <p className="mt-2 font-serif text-4xl leading-none font-light">{value}</p>
      {delta && <p className="mt-2 text-xs font-medium text-gold">{delta}</p>}
      {hint && <p className={`mt-2 text-xs ${muted}`}>{hint}</p>}
    </div>
  );
}
