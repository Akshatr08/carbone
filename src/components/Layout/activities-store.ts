import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Activity } from "@/utils/carbonCalc";

const SEED: Activity[] = [
  {
    id: "s1",
    category: "transport",
    label: "Daily car commute (petrol)",
    kg: 86.4,
    date: new Date(Date.now() - 86400000 * 12).toISOString(),
    details: { mode: "car_petrol", km: 15, frequency: "daily" },
  },
  {
    id: "s2",
    category: "energy",
    label: "Electricity — 220 kWh",
    kg: 180.4,
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
    details: { type: "electricity", units: 220 },
  },
  {
    id: "s3",
    category: "food",
    label: "Mixed diet — 30 days",
    kg: 140.1,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    details: { dietType: "mixed", days: 30 },
  },
  {
    id: "s4",
    category: "shopping",
    label: "Clothing — ₹4,000",
    kg: 0.14,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    details: { category: "clothing", amountInRupees: 4000 },
  },
];

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useActivities(): {
  activities: Activity[];
  add: (a: Omit<Activity, "id" | "date">) => void;
  remove: (id: string) => void;
  clear: () => void;
} {
  const [activities, setActivities] = useLocalStorage<Activity[]>("carbone.activities", SEED);
  const add = (a: Omit<Activity, "id" | "date">) =>
    setActivities([{ ...a, id: uid(), date: new Date().toISOString() }, ...activities]);
  const remove = (id: string) => setActivities(activities.filter((a) => a.id !== id));
  const clear = () => setActivities([]);
  return { activities, add, remove, clear };
}

export function useCommitments(): {
  committed: string[];
  toggle: (id: string) => void;
  streak: number;
  history: Record<string, string[]>;
} {
  const [committed, setCommitted] = useLocalStorage<string[]>("carbone.committed", []);
  const [history, setHistory] = useLocalStorage<Record<string, string[]>>(
    "carbone.commit-history",
    {},
  );

  const todayKey = () => new Date().toISOString().slice(0, 10);

  const toggle = (id: string) => {
    const isOn = committed.includes(id);
    setCommitted(isOn ? committed.filter((x) => x !== id) : [...committed, id]);
    if (!isOn) {
      const today = todayKey();
      const days = history[id] ?? [];
      if (!days.includes(today)) {
        setHistory({ ...history, [id]: [...days, today].sort() });
      }
    }
  };

  /** Consecutive-day streak across ANY committed action. */
  const streak = (() => {
    const allDays = new Set<string>();
    for (const days of Object.values(history)) for (const d of days) allDays.add(d);
    if (allDays.size === 0) return 0;
    let count = 0;
    const cursor = new Date();
    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (allDays.has(key)) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return count;
  })();

  return { committed, toggle, streak, history };
}
