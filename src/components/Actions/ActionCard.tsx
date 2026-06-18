import { memo } from "react";
import { Check, ArrowRight } from "lucide-react";
import type { Tip } from "@/data/tips";

const DIFF_COLOR: Record<Tip["difficulty"], string> = {
  Easy: "bg-eco/40 text-foreground",
  Medium: "bg-gold/15 text-gold",
  Hard: "bg-destructive/15 text-destructive",
};

const CAT_LABEL: Record<Tip["category"], string> = {
  transport: "Transport",
  food: "Food",
  energy: "Energy",
  shopping: "Shopping",
};

function ActionCardImpl({
  tip,
  committed,
  onToggle,
}: {
  tip: Tip;
  committed: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl bg-surface p-5 hairline">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground">
          {CAT_LABEL[tip.category]}
        </span>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${DIFF_COLOR[tip.difficulty]}`}
        >
          {tip.difficulty}
        </span>
      </div>
      <h3 className="text-base font-medium leading-snug">{tip.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{tip.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="font-medium" style={{ color: "#5a8a2a" }}>
          Saves {tip.savingTons.toFixed(2)} t CO₂/yr
        </span>
        <span className="text-muted-foreground">· {tip.costImpact}</span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={committed}
        aria-label={committed ? `Uncommit from ${tip.title}` : `Commit to ${tip.title}`}
        className={[
          "mt-5 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          committed
            ? "bg-charcoal text-charcoal-foreground"
            : "border-[0.5px] border-gold text-gold hover:bg-gold/10",
        ].join(" ")}
      >
        {committed ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" /> Committed
          </>
        ) : (
          <>
            I'll do this <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </article>
  );
}

export const ActionCard = memo(ActionCardImpl);
