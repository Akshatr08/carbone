import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { memo } from "react";
import type { ActivityCategory } from "@/utils/carbonCalc";
import { CATEGORY_COLORS } from "@/utils/chartTokens";

const LABELS: Record<ActivityCategory, string> = {
  transport: "Transport",
  energy: "Energy",
  food: "Food",
  shopping: "Shopping",
};

function EmissionsDonutImpl({ data }: { data: Record<ActivityCategory, number> }) {
  const entries = (Object.entries(data) as [ActivityCategory, number][]).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const chartData = entries.map(([k, v]) => ({ name: k, value: v }));

  return (
    <div
      className="grid items-center gap-6 sm:grid-cols-2"
      role="img"
      aria-label={`Emissions breakdown: ${entries
        .map(([k, v]) => `${LABELS[k]} ${Math.round(v)} kg`)
        .join(", ")}`}
    >
      <div className="relative h-[200px] w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={62}
              outerRadius={92}
              stroke="none"
              paddingAngle={2}
              isAnimationActive={false}
            >
              {chartData.map((d) => (
                <Cell key={d.name} fill={CATEGORY_COLORS[d.name as ActivityCategory]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[11px] uppercase tracking-wider text-hint">Total</p>
          <p className="font-serif text-2xl">
            {(total / 1000).toFixed(2)}
            <span className="text-sm text-muted-foreground"> t</span>
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {(Object.keys(LABELS) as ActivityCategory[]).map((k) => {
          const v = data[k] || 0;
          const pct = total > 0 ? Math.round((v / total) * 100) : 0;
          return (
            <li key={k} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: CATEGORY_COLORS[k] }}
                  aria-hidden
                />
                <span className="truncate">{LABELS[k]}</span>
              </div>
              <span className="text-muted-foreground tabular-nums">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const EmissionsDonut = memo(EmissionsDonutImpl);
