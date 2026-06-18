import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { memo } from "react";
import { CHART_TOKENS } from "@/utils/chartTokens";

function TrendLineImpl({ data }: { data: { month: string; kg: number }[] }) {
  return (
    <div
      className="h-[240px] w-full"
      role="img"
      aria-label={`6-month CO2 trend: ${data.map((d) => `${d.month} ${d.kg} kg`).join(", ")}`}
    >
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={CHART_TOKENS.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: CHART_TOKENS.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: CHART_TOKENS.muted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            cursor={{ stroke: CHART_TOKENS.gold, strokeWidth: 1, strokeDasharray: "2 2" }}
            contentStyle={{
              background: CHART_TOKENS.surface,
              border: `0.5px solid ${CHART_TOKENS.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${Math.round(v)} kg`, "CO₂"]}
          />
          <Line
            type="monotone"
            dataKey="kg"
            stroke={CHART_TOKENS.gold}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_TOKENS.gold }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const TrendLine = memo(TrendLineImpl);
