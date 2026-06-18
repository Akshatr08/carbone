import { useState } from "react";
import { Calculator } from "lucide-react";
import { z } from "zod";
import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateShoppingEmissions,
  type Activity,
  type ActivityCategory,
} from "@/utils/carbonCalc";
import { useActivities } from "@/components/Layout/activities-store";
import { ScopeTooltip } from "@/components/Common/ScopeTooltip";
import { formatINR } from "@/utils/format";

const TABS: { id: ActivityCategory; label: string }[] = [
  { id: "transport", label: "Transport" },
  { id: "energy", label: "Home Energy" },
  { id: "food", label: "Food" },
  { id: "shopping", label: "Shopping" },
];

const TransportSchema = z.object({
  mode: z.enum([
    "car_petrol",
    "car_diesel",
    "car_electric",
    "flight_short",
    "flight_long",
    "metro",
    "bus",
    "bike",
    "walk",
  ]),
  km: z.coerce.number().min(0).max(100000),
  freq: z.enum(["daily", "weekly", "monthly"]),
});

const EnergySchema = z.object({
  type: z.enum(["electricity", "lpg", "natural_gas"]),
  units: z.coerce.number().min(0).max(100000),
});

const FoodSchema = z.object({
  diet: z.enum(["meat_heavy", "mixed", "vegetarian", "vegan"]),
  days: z.coerce.number().int().min(1).max(365),
});

const ShoppingSchema = z.object({
  cat: z.enum(["clothing", "electronics", "general"]),
  amt: z.coerce.number().min(0).max(10_000_000),
});

const fieldCls =
  "h-10 w-full rounded-md bg-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold";
const labelCls = "mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground";

export function ActivityForm() {
  const [tab, setTab] = useState<ActivityCategory>("transport");
  const { add } = useActivities();
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "error" } | null>(null);

  const flash = (msg: string, kind: "ok" | "error" = "ok") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2500);
  };

  function handle<T>(
    e: React.FormEvent<HTMLFormElement>,
    schema: z.ZodType<T>,
    build: (data: T) => Omit<Activity, "id" | "date">,
  ) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      flash(parsed.error.issues[0]?.message ?? "Invalid input", "error");
      return;
    }
    const activity = build(parsed.data);
    add(activity);
    flash(`Added ${activity.kg.toFixed(2)} kg CO₂`);
    form.reset();
  }

  return (
    <div className="rounded-xl bg-surface p-5 hairline">
      <div
        className="hairline-b flex gap-1 -mx-1 px-1 mb-5"
        role="tablist"
        aria-label="Activity category"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={[
              "relative px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md",
              tab === t.id
                ? "font-medium text-gold"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {t.label}
            {tab === t.id && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-gold" />}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "transport" && (
          <form
            onSubmit={(e) =>
              handle(e, TransportSchema, (d) => ({
                category: "transport",
                label: `${d.mode.replace("_", " ")} — ${d.km} km ${d.freq}`,
                kg: calculateTransportEmissions(d.mode, d.km, d.freq),
                details: { mode: d.mode, km: d.km, frequency: d.freq },
              }))
            }
            className="space-y-4"
            noValidate
          >
            <div>
              <label className={labelCls} htmlFor="mode">
                Mode <ScopeTooltip category="transport" />
              </label>
              <select id="mode" name="mode" className={fieldCls} required defaultValue="car_petrol">
                <option value="car_petrol">Car — Petrol</option>
                <option value="car_diesel">Car — Diesel</option>
                <option value="car_electric">Car — Electric</option>
                <option value="flight_short">Flight — Short-haul</option>
                <option value="flight_long">Flight — Long-haul</option>
                <option value="metro">Metro / Train</option>
                <option value="bus">Bus</option>
                <option value="bike">Bicycle</option>
                <option value="walk">Walk</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="km">
                  Distance (km)
                </label>
                <input
                  id="km"
                  name="km"
                  type="number"
                  min="0"
                  max="100000"
                  step="0.1"
                  required
                  className={fieldCls}
                  placeholder="15"
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="freq">
                  Frequency
                </label>
                <select id="freq" name="freq" className={fieldCls} defaultValue="daily">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <SubmitBtn />
          </form>
        )}

        {tab === "energy" && (
          <form
            onSubmit={(e) =>
              handle(e, EnergySchema, (d) => ({
                category: "energy",
                label: `${d.type.replace("_", " ")} — ${d.units} units`,
                kg: calculateEnergyEmissions(d.type, d.units),
                details: { type: d.type, units: d.units },
              }))
            }
            className="space-y-4"
            noValidate
          >
            <div>
              <label className={labelCls} htmlFor="type">
                Energy type <ScopeTooltip category="energy" />
              </label>
              <select id="type" name="type" className={fieldCls} defaultValue="electricity">
                <option value="electricity">Electricity (kWh)</option>
                <option value="lpg">LPG (kg)</option>
                <option value="natural_gas">Natural gas (m³)</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="units">
                Monthly units
              </label>
              <input
                id="units"
                name="units"
                type="number"
                min="0"
                max="100000"
                step="0.1"
                required
                className={fieldCls}
                placeholder="220"
              />
            </div>
            <SubmitBtn />
          </form>
        )}

        {tab === "food" && (
          <form
            onSubmit={(e) =>
              handle(e, FoodSchema, (d) => ({
                category: "food",
                label: `${d.diet.replace("_", " ")} diet — ${d.days} days`,
                kg: calculateFoodEmissions(d.diet, d.days),
                details: { dietType: d.diet, days: d.days },
              }))
            }
            className="space-y-4"
            noValidate
          >
            <div>
              <label className={labelCls} htmlFor="diet">
                Diet type <ScopeTooltip category="food" />
              </label>
              <select id="diet" name="diet" className={fieldCls} defaultValue="mixed">
                <option value="meat_heavy">Meat-heavy</option>
                <option value="mixed">Mixed</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="days">
                Number of days to log
              </label>
              <input
                id="days"
                name="days"
                type="number"
                min="1"
                max="365"
                required
                className={fieldCls}
                placeholder="30"
                defaultValue={30}
              />
            </div>
            <SubmitBtn />
          </form>
        )}

        {tab === "shopping" && (
          <form
            onSubmit={(e) =>
              handle(e, ShoppingSchema, (d) => ({
                category: "shopping",
                label: `${d.cat} — ${formatINR(d.amt)}`,
                kg: calculateShoppingEmissions(d.cat, d.amt),
                details: { category: d.cat, amountInRupees: d.amt },
              }))
            }
            className="space-y-4"
            noValidate
          >
            <div>
              <label className={labelCls} htmlFor="cat">
                Category <ScopeTooltip category="shopping" />
              </label>
              <select id="cat" name="cat" className={fieldCls} defaultValue="clothing">
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="general">General retail</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="amt">
                Spend amount (₹)
              </label>
              <input
                id="amt"
                name="amt"
                type="number"
                min="0"
                max="10000000"
                step="1"
                required
                className={fieldCls}
                placeholder="2500"
              />
            </div>
            <SubmitBtn />
          </form>
        )}
      </div>

      <div aria-live="polite" role="status" className="min-h-[1.5rem]">
        {toast && (
          <div
            className={[
              "mt-4 rounded-md px-3 py-2 text-xs",
              toast.kind === "ok"
                ? "bg-eco/40 text-foreground"
                : "bg-destructive/15 text-destructive",
            ].join(" ")}
          >
            {toast.kind === "ok" ? "✓" : "⚠"} {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmitBtn() {
  return (
    <button
      type="submit"
      aria-label="Calculate and add activity"
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-charcoal px-4 py-2.5 text-sm font-medium text-charcoal-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <Calculator className="h-4 w-4" /> Calculate & Add
    </button>
  );
}
