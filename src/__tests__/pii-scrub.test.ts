import { describe, it, expect } from "vitest";
import { scrubPII } from "@/lib/pii-scrub";

describe("scrubPII", () => {
  it("redacts emails", () => {
    expect(scrubPII("ping me at hello@example.com please")).toBe("ping me at [email] please");
  });
  it("redacts phone numbers", () => {
    const out = scrubPII("call +91 98765 43210 now");
    expect(out).toContain("[phone]");
    expect(out).not.toContain("98765");
  });
  it("redacts Aadhaar-shaped numbers", () => {
    expect(scrubPII("id 1234 5678 9012 is mine")).toBe("id [id] is mine");
  });
  it("redacts PAN-shaped strings", () => {
    expect(scrubPII("PAN ABCDE1234F here")).toBe("PAN [id] here");
  });
  it("leaves clean text alone", () => {
    expect(scrubPII("How can I reduce my CO2?")).toBe("How can I reduce my CO2?");
  });
});
