import { describe, it } from "vitest";
import fc from "fast-check";
import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateShoppingEmissions,
} from "@/utils/carbonCalc";

const MODES = [
  "car_petrol",
  "car_diesel",
  "car_electric",
  "flight_short",
  "flight_long",
  "metro",
  "bus",
  "bike",
  "walk",
] as const;

describe("carbonCalc — property-based", () => {
  it("transport emissions are non-negative for any valid input", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MODES),
        fc.float({ min: 0, max: 10000, noNaN: true }),
        fc.constantFrom("daily", "weekly", "monthly"),
        (mode, km, freq) => {
          const r = calculateTransportEmissions(mode, km, freq);
          return Number.isFinite(r) && r >= 0;
        },
      ),
    );
  });

  it("transport emissions are monotonic in distance", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("car_petrol", "car_diesel", "bus", "metro"),
        fc.float({ min: 0, max: 500, noNaN: true }),
        fc.float({ min: 0, max: 500, noNaN: true }),
        (mode, a, b) => {
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          return (
            calculateTransportEmissions(mode, lo, "daily") <=
            calculateTransportEmissions(mode, hi, "daily")
          );
        },
      ),
    );
  });

  it("doubling km roughly doubles emissions for emitting modes", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("car_petrol", "car_diesel", "flight_short"),
        fc.float({ min: 1, max: 200, noNaN: true }),
        (mode, km) => {
          const single = calculateTransportEmissions(mode, km, "monthly");
          const dbl = calculateTransportEmissions(mode, km * 2, "monthly");
          return Math.abs(dbl - single * 2) < 0.01;
        },
      ),
    );
  });

  it("energy/food/shopping all non-negative & finite", () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 10000, noNaN: true }), (n) => {
        const a = calculateEnergyEmissions("electricity", n);
        const b = calculateFoodEmissions("vegan", Math.min(365, Math.floor(n)));
        const c = calculateShoppingEmissions("general", n);
        return [a, b, c].every((x) => Number.isFinite(x) && x >= 0);
      }),
    );
  });
});
