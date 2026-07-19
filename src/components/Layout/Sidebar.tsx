import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Activity, TrendingUp, Target, MessageCircle } from "lucide-react";
import { useActivities } from "@/components/Layout/activities-store";
import { getTotalFootprint } from "@/utils/carbonCalc";

const ITEMS = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, group: "Overview" },
  { to: "/tracker", label: "Track", Icon: Activity, group: "Overview" },
  { to: "/insights", label: "Insights", Icon: TrendingUp, group: "Analyze" },
  { to: "/actions", label: "Actions", Icon: Target, group: "Analyze" },
  { to: "/chat", label: "EcoBot", Icon: MessageCircle, group: "Advisor" },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { activities } = useActivities();
  const monthlyKg = getTotalFootprint(activities);
  const monthlyT = (monthlyKg / 1000).toFixed(2);

  const groups = Array.from(new Set(ITEMS.map((i) => i.group)));

  return (
    <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[220px] shrink-0 flex-col hairline-r lg:flex">
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Sidebar">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-hint">
              {group}
            </p>
            <ul className="space-y-0.5">
              {ITEMS.filter((i) => i.group === group).map(({ to, label, Icon }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      className={[
                        "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-accent font-medium text-foreground"
                          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-l-full bg-gold" />
                      )}
                      <Icon className={["h-4 w-4", active ? "text-gold" : ""].join(" ")} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-lg bg-charcoal p-4 text-charcoal-foreground">
          <p className="text-[11px] uppercase tracking-wider text-hint">This month</p>
          <p className="mt-2 font-serif text-3xl">
            {monthlyT}
            <span className="text-base text-hint"> tCO₂</span>
          </p>
          <p className="mt-1 text-xs text-gold">↓ tracking your impact</p>
        </div>
      </div>
    </aside>
  );
}
