import { Info } from "lucide-react";
import type { ActivityCategory } from "@/utils/carbonCalc";

const SCOPE_INFO: Record<ActivityCategory, { scope: string; explainer: string }> = {
  transport: {
    scope: "Scope 1",
    explainer: "Direct emissions from fuel burned in vehicles you operate.",
  },
  energy: {
    scope: "Scope 2",
    explainer: "Indirect emissions from purchased electricity (India grid: 0.82 kgCO₂/kWh).",
  },
  food: {
    scope: "Scope 3",
    explainer: "Upstream emissions from producing, processing and transporting food.",
  },
  shopping: {
    scope: "Scope 3",
    explainer: "Embedded emissions in goods you buy — production, packaging, shipping.",
  },
};

export function ScopeTooltip({ category }: { category: ActivityCategory }) {
  const info = SCOPE_INFO[category];
  return (
    <span className="group relative inline-flex items-center align-middle">
      <button
        type="button"
        aria-label={`${info.scope} — ${info.explainer}`}
        className="grid h-5 w-5 place-items-center rounded-full text-muted-foreground hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 w-56 -translate-x-1/2 rounded-md bg-charcoal px-3 py-2 text-xs text-charcoal-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="font-medium text-gold">{info.scope}</span>
        <span className="mt-0.5 block">{info.explainer}</span>
      </span>
    </span>
  );
}
