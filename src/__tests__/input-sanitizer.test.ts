import { describe, it, expect } from "vitest";
import { sanitizeInput } from "@/lib/input-sanitizer";

describe("sanitizeInput", () => {
  it("escapes basic HTML characters", () => {
    expect(sanitizeInput("<div>hello</div>")).toBe("&lt;div&gt;hello&lt;&#x2F;div&gt;");
  });

  it("escapes quotes and ampersands", () => {
    expect(sanitizeInput('John & Doe\'s "cool" app')).toBe(
      "John &amp; Doe&#x27;s &quot;cool&quot; app",
    );
  });

  it("handles null or undefined by returning empty string", () => {
    expect(sanitizeInput(undefined)).toBe("");
    expect(sanitizeInput(null)).toBe("");
  });

  it("leaves clean input untouched", () => {
    expect(sanitizeInput("Just normal text 123!")).toBe("Just normal text 123!");
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });
});
