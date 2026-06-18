import { BENCHMARKS } from "@/data/emissionFactors";

export function CompareChart({ userKg }: { userKg: number }) {
  const rows = [
    { label: "You", value: userKg, color: "bg-gold" },
    { label: "India avg", value: BENCHMARKS.indiaMonthly, color: "bg-neutral-bar" },
    { label: "Global avg", value: BENCHMARKS.globalMonthly, color: "bg-neutral-bar" },
    { label: "Paris target", value: BENCHMARKS.parisMonthly, color: "bg-eco" },
  ];
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-foreground">{r.label}</span>
            <span className="font-medium tabular-nums text-muted-foreground">
              {Math.round(r.value)} kg
            </span>
          </div>
          <div className="h-2 w-full rounded-sm bg-surface-hover">
            <div
              className={`h-full rounded-sm ${r.color}`}
              style={{ width: `${Math.min(100, (r.value / max) * 100)}%` }}
              role="img"
              aria-label={`${r.label}: ${Math.round(r.value)} kilograms CO2`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
