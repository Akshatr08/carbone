import {
  TRANSPORT_FACTORS,
  ENERGY_FACTORS,
  FOOD_FACTORS,
  SHOPPING_FACTORS,
  FREQUENCY_MULTIPLIER,
  BENCHMARKS,
  type TransportMode,
  type EnergyType,
  type DietType,
  type ShoppingCategory,
  type Frequency,
} from "@/data/emissionFactors";

export type ActivityCategory = "transport" | "energy" | "food" | "shopping";

export interface Activity {
  id: string;
  category: ActivityCategory;
  label: string;
  kg: number; // monthly kgCO2e
  date: string; // ISO
  details?: Record<string, string | number>;
}

/**
 * Calculate monthly kgCO2e for a transport activity.
 */
export function calculateTransportEmissions(
  mode: TransportMode,
  km: number,
  frequency: Frequency,
): number {
  if (!(mode in TRANSPORT_FACTORS)) return 0;
  if (!Number.isFinite(km) || km < 0) return 0;
  const factor = TRANSPORT_FACTORS[mode];
  const mult = FREQUENCY_MULTIPLIER[frequency] ?? 1;
  return +(factor * km * mult).toFixed(3);
}

/**
 * Calculate monthly kgCO2e for home-energy use.
 */
export function calculateEnergyEmissions(type: EnergyType, units: number): number {
  if (!(type in ENERGY_FACTORS)) return 0;
  if (!Number.isFinite(units) || units < 0) return 0;
  return +(ENERGY_FACTORS[type] * units).toFixed(3);
}

/**
 * Calculate kgCO2e for `days` of a given diet pattern.
 */
export function calculateFoodEmissions(dietType: DietType, days: number): number {
  if (!(dietType in FOOD_FACTORS)) return 0;
  if (!Number.isFinite(days) || days < 0) return 0;
  return +(FOOD_FACTORS[dietType] * days).toFixed(3);
}

/**
 * Calculate kgCO2e for retail spend in ₹.
 */
export function calculateShoppingEmissions(
  category: ShoppingCategory,
  amountInRupees: number,
): number {
  if (!(category in SHOPPING_FACTORS)) return 0;
  if (!Number.isFinite(amountInRupees) || amountInRupees < 0) return 0;
  return +(SHOPPING_FACTORS[category] * (amountInRupees / 1000)).toFixed(3);
}

/** Sum total kgCO2e across activities. */
export function getTotalFootprint(activities: Activity[]): number {
  return +activities.reduce((s, a) => s + (a.kg || 0), 0).toFixed(3);
}

/** Sum kg per category. */
export function getByCategory(activities: Activity[]): Record<ActivityCategory, number> {
  const out: Record<ActivityCategory, number> = {
    transport: 0,
    energy: 0,
    food: 0,
    shopping: 0,
  };
  for (const a of activities) out[a.category] = +(out[a.category] + a.kg).toFixed(3);
  return out;
}

/**
 * Compare user's monthly kg vs India / Global / Paris benchmarks.
 */
export function compareToAverage(userKg: number) {
  const vsIndia = +(((userKg - BENCHMARKS.indiaMonthly) / BENCHMARKS.indiaMonthly) * 100).toFixed(
    1,
  );
  const vsGlobal = +(
    ((userKg - BENCHMARKS.globalMonthly) / BENCHMARKS.globalMonthly) *
    100
  ).toFixed(1);
  const vsParis = +(((userKg - BENCHMARKS.parisMonthly) / BENCHMARKS.parisMonthly) * 100).toFixed(
    1,
  );
  // Lower is better — percentile = % of people you beat
  const percentile = Math.max(
    0,
    Math.min(100, Math.round(100 - (userKg / BENCHMARKS.globalMonthly) * 50)),
  );
  return { vsIndia, vsGlobal, vsParis, percentile };
}

/**
 * Eco score 0-100. 100 = at/under Paris target; 0 = >= 2× global avg.
 */
export function getEcoScore(userMonthlyKg: number): number {
  if (!Number.isFinite(userMonthlyKg) || userMonthlyKg <= 0) return 100;
  if (userMonthlyKg <= BENCHMARKS.parisMonthly) return 100;
  const ceiling = BENCHMARKS.globalMonthly * 2;
  if (userMonthlyKg >= ceiling) return 0;
  const span = ceiling - BENCHMARKS.parisMonthly;
  const score = 100 - ((userMonthlyKg - BENCHMARKS.parisMonthly) / span) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Return the 3 highest-impact tip categories for the user.
 */
export function getSavingsTips(activities: Activity[]): ActivityCategory[] {
  const by = getByCategory(activities);
  return (Object.entries(by) as [ActivityCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
}
