import { describe, it, expect } from "vitest";
import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateShoppingEmissions,
  getTotalFootprint,
  compareToAverage,
  getEcoScore,
  getSavingsTips,
  type Activity,
} from "@/utils/carbonCalc";
import { BENCHMARKS } from "@/data/emissionFactors";

describe("carbonCalc", () => {
  describe("calculateTransportEmissions", () => {
    it("petrol car daily 20km ≈ 115.2 kg/month", () => {
      expect(calculateTransportEmissions("car_petrol", 20, "daily")).toBeCloseTo(115.2, 1);
    });
    it("returns 0 for unknown mode", () => {
      // @ts-expect-error – test invalid input
      expect(calculateTransportEmissions("teleport", 100, "daily")).toBe(0);
    });
    it("returns 0 for negative km", () => {
      expect(calculateTransportEmissions("car_petrol", -5, "daily")).toBe(0);
    });
    it("walking/cycling is zero", () => {
      expect(calculateTransportEmissions("walk", 50, "weekly")).toBe(0);
      expect(calculateTransportEmissions("bike", 50, "weekly")).toBe(0);
    });
  });

  describe("calculateEnergyEmissions", () => {
    it("100 kWh electricity = 82 kg", () => {
      expect(calculateEnergyEmissions("electricity", 100)).toBe(82);
    });
    it("zero units = 0", () => {
      expect(calculateEnergyEmissions("electricity", 0)).toBe(0);
    });
  });

  describe("calculateFoodEmissions", () => {
    it("mixed diet x 30 days ≈ 140.1", () => {
      expect(calculateFoodEmissions("mixed", 30)).toBeCloseTo(140.1, 1);
    });
    it("vegan < meat_heavy", () => {
      expect(calculateFoodEmissions("vegan", 30)).toBeLessThan(
        calculateFoodEmissions("meat_heavy", 30),
      );
    });
  });

  describe("calculateShoppingEmissions", () => {
    it("₹10000 clothing = 0.34", () => {
      expect(calculateShoppingEmissions("clothing", 10000)).toBeCloseTo(0.34, 2);
    });
  });

  describe("getTotalFootprint", () => {
    it("sums activities", () => {
      const acts: Activity[] = [
        { id: "1", category: "transport", label: "x", kg: 100, date: "" },
        { id: "2", category: "food", label: "y", kg: 50.5, date: "" },
      ];
      expect(getTotalFootprint(acts)).toBe(150.5);
    });
    it("empty array = 0", () => {
      expect(getTotalFootprint([])).toBe(0);
    });
  });

  describe("compareToAverage", () => {
    it("at India avg returns 0% vs India", () => {
      const r = compareToAverage(BENCHMARKS.indiaMonthly);
      expect(r.vsIndia).toBe(0);
    });
    it("percentile within 0-100", () => {
      const r = compareToAverage(50);
      expect(r.percentile).toBeGreaterThanOrEqual(0);
      expect(r.percentile).toBeLessThanOrEqual(100);
    });
  });

  describe("getEcoScore", () => {
    it("under Paris = 100", () => {
      expect(getEcoScore(50)).toBe(100);
    });
    it("very high = 0", () => {
      expect(getEcoScore(10000)).toBe(0);
    });
    it("zero = 100", () => {
      expect(getEcoScore(0)).toBe(100);
    });
  });

  describe("getSavingsTips", () => {
    it("returns 3 categories sorted by impact", () => {
      const acts: Activity[] = [
        { id: "1", category: "transport", label: "", kg: 200, date: "" },
        { id: "2", category: "food", label: "", kg: 80, date: "" },
        { id: "3", category: "energy", label: "", kg: 150, date: "" },
        { id: "4", category: "shopping", label: "", kg: 20, date: "" },
      ];
      expect(getSavingsTips(acts)).toEqual(["transport", "energy", "food"]);
    });
  });
});
