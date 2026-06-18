import { Trash2 } from "lucide-react";
import { useActivities } from "@/components/Layout/activities-store";
import { getTotalFootprint, type ActivityCategory } from "@/utils/carbonCalc";

const BADGE: Record<ActivityCategory, string> = {
  transport: "bg-gold/15 text-gold",
  energy: "bg-charcoal text-charcoal-foreground",
  food: "bg-eco/40 text-foreground",
  shopping: "bg-neutral-bar text-foreground",
};

export function ActivityLog() {
  const { activities, remove } = useActivities();
  const total = getTotalFootprint(activities);

  if (activities.length === 0) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl bg-surface p-8 text-center hairline">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-accent">
          <span className="font-serif text-xl text-gold">·</span>
        </div>
        <p className="mt-4 font-serif text-lg">No activities yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start logging above to see your footprint build up.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface hairline">
      <div className="hairline-b flex items-center justify-between px-5 py-3.5">
        <h3 className="text-sm font-medium">Activity log</h3>
        <span className="text-xs text-muted-foreground">{activities.length} entries</span>
      </div>
      <ul className="divide-y divide-border max-h-[480px] overflow-y-auto">
        {activities.map((a) => (
          <li
            key={a.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 hover:bg-surface-hover"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${BADGE[a.category]}`}
                >
                  {a.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="mt-1 truncate text-sm">{a.label}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg tabular-nums">
                {a.kg.toFixed(1)}
                <span className="text-xs text-muted-foreground"> kg</span>
              </span>
              <button
                onClick={() => remove(a.id)}
                aria-label={`Delete ${a.label}`}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="hairline-t flex items-center justify-between px-5 py-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Total</span>
        <span className="font-serif text-2xl">
          {total.toFixed(1)}
          <span className="text-sm text-muted-foreground"> kg CO₂</span>
        </span>
      </div>
    </div>
  );
}
