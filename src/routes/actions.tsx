import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ActionCard } from "@/components/Actions/ActionCard";
import { TIPS, type Tip, type TipCategory } from "@/data/tips";
import { useActivities, useCommitments } from "@/components/Layout/activities-store";
import { getSavingsTips } from "@/utils/carbonCalc";

export const Route = createFileRoute("/actions")({
  head: () => ({
    meta: [
      { title: "Actions · carbone" },
      {
        name: "description",
        content:
          "Personalised, India-aware actions you can commit to — with estimated CO₂ savings per year.",
      },
    ],
  }),
  component: Actions,
});

const FILTERS: { id: "all" | TipCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "transport", label: "Transport" },
  { id: "food", label: "Food" },
  { id: "energy", label: "Energy" },
  { id: "shopping", label: "Shopping" },
];

/** Deterministically pick a weekly challenge biased to top-impact categories. */
function pickWeeklyChallenge(topCats: string[]): Tip {
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const pool = TIPS.filter((t) => topCats.includes(t.category));
  const candidates = pool.length > 0 ? pool : TIPS;
  return candidates[weekIndex % candidates.length];
}

function Actions() {
  const [filter, setFilter] = useState<"all" | TipCategory>("all");
  const { committed, toggle } = useCommitments();
  const { activities } = useActivities();

  const shown = useMemo(
    () => (filter === "all" ? TIPS : TIPS.filter((t) => t.category === filter)),
    [filter],
  );

  const committedTips = useMemo(() => TIPS.filter((t) => committed.includes(t.id)), [committed]);
  const totalSaved = committedTips.reduce((s, t) => s + t.savingTons, 0);
  const weekly = useMemo(() => pickWeeklyChallenge(getSavingsTips(activities)), [activities]);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Actions</p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Your action plan</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pick what fits your life. Every commitment compounds.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter actions">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={[
              "min-h-11 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              filter === f.id
                ? "bg-gold text-gold-foreground"
                : "bg-surface text-foreground hairline hover:bg-surface-hover",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <ActionCard
            key={t.id}
            tip={t}
            committed={committed.includes(t.id)}
            onToggle={() => toggle(t.id)}
          />
        ))}
      </div>

      {committedTips.length > 0 && (
        <section className="rounded-xl bg-surface p-5 hairline" aria-labelledby="comm-h">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="eyebrow">Your commitments</p>
              <h2 id="comm-h" className="mt-1 font-serif text-xl">
                Combined impact
              </h2>
            </div>
            <p className="font-serif text-3xl text-gold">
              {totalSaved.toFixed(2)}
              <span className="text-sm text-muted-foreground"> t/yr</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            You're on track to save{" "}
            <span className="font-medium text-foreground">{totalSaved.toFixed(2)} t CO₂</span> this
            year.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {committedTips.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-md bg-accent px-3 py-2 text-sm"
              >
                <span className="truncate">{t.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {t.savingTons.toFixed(2)} t
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        className="rounded-xl bg-charcoal p-6 text-charcoal-foreground"
        aria-labelledby="chal-h"
      >
        <p className="eyebrow">This week's challenge</p>
        <h2 id="chal-h" className="mt-2 font-serif text-2xl">
          {weekly.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-hint">
          {weekly.description}{" "}
          <span className="text-gold">~{weekly.savingTons.toFixed(2)} t CO₂/yr if sustained.</span>
        </p>
        <button
          type="button"
          onClick={() => toggle(weekly.id)}
          className="mt-5 inline-flex min-h-11 items-center rounded-md border-[0.5px] border-gold px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {committed.includes(weekly.id) ? "✓ Accepted" : "Accept challenge"}
        </button>
      </section>
    </div>
  );
}
