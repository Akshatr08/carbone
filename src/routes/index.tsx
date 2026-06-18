import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Car, Zap, Apple, ShoppingBag, ChevronRight } from "lucide-react";
import { KPICard } from "@/components/Dashboard/KPICard";
import { EmissionsDonut } from "@/components/Dashboard/EmissionsDonut";
import { CompareChart } from "@/components/Dashboard/CompareChart";
import { TrendLine } from "@/components/Dashboard/TrendLine";
import { EcoBotPreview } from "@/components/Chat/EcoBotPreview";
import { useActivities, useCommitments } from "@/components/Layout/activities-store";
import {
  getByCategory,
  getTotalFootprint,
  compareToAverage,
  type ActivityCategory,
} from "@/utils/carbonCalc";
import { TIPS } from "@/data/tips";
import { formatNumber } from "@/utils/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · carbone" },
      {
        name: "description",
        content:
          "Your monthly CO₂ footprint at a glance — top sources, India comparison, and personalised quick wins.",
      },
    ],
  }),
  component: Dashboard,
});

const TREND = [
  { month: "Jan", kg: 520 },
  { month: "Feb", kg: 495 },
  { month: "Mar", kg: 480 },
  { month: "Apr", kg: 510 },
  { month: "May", kg: 460 },
  { month: "Jun", kg: 407 },
];

const CAT_ICON = {
  transport: Car,
  energy: Zap,
  food: Apple,
  shopping: ShoppingBag,
} as const;

const CAT_LABEL: Record<ActivityCategory, string> = {
  transport: "Transport",
  energy: "Home energy",
  food: "Food",
  shopping: "Shopping",
};

function Dashboard() {
  const { activities } = useActivities();
  const { committed, streak } = useCommitments();

  const { total, byCat, cmp, top, quickWins } = useMemo(() => {
    const total = getTotalFootprint(activities);
    const byCat = getByCategory(activities);
    const cmp = compareToAverage(total);
    const top =
      (Object.entries(byCat) as [ActivityCategory, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "transport";
    const quickWins = TIPS.filter((t) => t.category === top || t.difficulty === "Easy").slice(0, 3);
    return { total, byCat, cmp, top, quickWins };
  }, [activities]);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Your footprint this month</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A quick read on what you emit, where it comes from, and what to do next.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          variant="dark"
          eyebrow="Total"
          label="This month"
          value={
            <>
              {(total / 1000).toFixed(2)}
              <span className="text-base text-hint"> t</span>
            </>
          }
          delta={`${cmp.vsIndia > 0 ? "↑" : "↓"} ${Math.abs(cmp.vsIndia)}% vs India`}
        />
        <KPICard
          label="vs India average"
          value={<>{Math.abs(cmp.vsIndia)}%</>}
          hint={cmp.vsIndia <= 0 ? "Better than average" : "Above average — let's fix that"}
        />
        <KPICard
          label="Top source"
          value={<span className="text-2xl">{CAT_LABEL[top]}</span>}
          hint={`${formatNumber(byCat[top])} kg this month`}
        />
        <KPICard
          label="Actions committed"
          value={
            <>
              {committed.length}
              <span className="text-base text-muted-foreground">/10</span>
            </>
          }
          hint={streak > 0 ? `🔥 ${streak}-day streak` : "Keep building momentum"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl bg-surface p-5 hairline" aria-labelledby="src-h">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="src-h" className="text-sm font-medium">
              Emissions by source
            </h2>
            <Link
              to="/insights"
              className="text-xs font-medium text-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              Details
            </Link>
          </div>
          <EmissionsDonut data={byCat} />
        </section>

        <section className="rounded-xl bg-surface p-5 hairline" aria-labelledby="cmp-h">
          <h2 id="cmp-h" className="mb-4 text-sm font-medium">
            How you compare (kg/month)
          </h2>
          <CompareChart userKg={total} />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl bg-surface p-5 hairline" aria-labelledby="qw-h">
          <h2 id="qw-h" className="mb-4 text-sm font-medium">
            Quick wins for you
          </h2>
          <ul className="space-y-2">
            {quickWins.map((t) => {
              const Icon = CAT_ICON[t.category];
              return (
                <li key={t.id}>
                  <Link
                    to="/actions"
                    className="flex items-center gap-3 rounded-md p-2.5 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-accent">
                      <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      <p className="text-xs" style={{ color: "#5a8a2a" }}>
                        Saves {t.savingTons.toFixed(2)} t CO₂/yr
                      </p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl bg-surface p-5 hairline">
          <EcoBotPreview />
        </section>
      </div>

      <section className="rounded-xl bg-surface p-5 hairline" aria-labelledby="trend-h">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="eyebrow">Trend</p>
            <h2 id="trend-h" className="mt-1 font-serif text-xl">
              Your footprint over time
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">Last 6 months</span>
        </div>
        <TrendLine data={TREND} />
      </section>

      <footer className="text-xs text-muted-foreground pt-4 border-t border-border/40">
        <p>
          Emission factors: <span className="font-medium">CEA India 2023</span> (grid 0.82
          kgCO₂/kWh), IPCC AR6, DEFRA 2023. Benchmarks: Our World in Data — India avg 1.9 t/yr,
          Global 4.7 t/yr, Paris 2030 target 2.0 t/yr.
        </p>
      </footer>
    </div>
  );
}
