import { describe, it, expect } from "vitest";
import { formatKg, formatNumber, formatINR, formatTons } from "@/utils/format";

describe("format", () => {
  it("formats small kg as kg with en-IN separators", () => {
    expect(formatKg(850)).toBe("850 kg");
  });
  it("formats large kg as tons", () => {
    expect(formatKg(1500)).toBe("1.50 t");
  });
  it("formatNumber uses Indian grouping", () => {
    expect(formatNumber(125000)).toBe("1,25,000");
  });
  it("formatINR adds the ₹ symbol", () => {
    expect(formatINR(4000)).toMatch(/₹/);
  });
  it("formatTons always shows 2 decimals", () => {
    expect(formatTons(1234)).toBe("1.23 t");
  });
  it("handles non-finite gracefully", () => {
    expect(formatKg(NaN)).toBe("—");
  });
});
