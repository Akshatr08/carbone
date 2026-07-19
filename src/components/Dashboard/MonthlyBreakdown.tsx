import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { memo } from "react";
import { CATEGORY_COLORS, CHART_TOKENS } from "@/utils/chartTokens";

interface Row {
  month: string;
  transport: number;
  energy: number;
  food: number;
  shopping: number;
}

function MonthlyBreakdownImpl({ data }: { data: Row[] }) {
  return (
    <div className="h-[300px] w-full" role="img" aria-label="Monthly emissions by category">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
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
            contentStyle={{
              background: CHART_TOKENS.surface,
              border: `0.5px solid ${CHART_TOKENS.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="square" />
          <Bar
            dataKey="transport"
            fill={CATEGORY_COLORS.transport}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="energy"
            fill={CATEGORY_COLORS.energy}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="food"
            fill={CATEGORY_COLORS.food}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="shopping"
            fill={CATEGORY_COLORS.shopping}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const MonthlyBreakdown = memo(MonthlyBreakdownImpl);
