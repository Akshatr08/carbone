import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { KPICard } from "@/components/Dashboard/KPICard";
import { SkipLink } from "@/components/Common/SkipLink";
import { ScopeTooltip } from "@/components/Common/ScopeTooltip";
import { ActionCard } from "@/components/Actions/ActionCard";
import type { Tip } from "@/data/tips";

expect.extend(toHaveNoViolations);

const MOCK_TIP: Tip = {
  id: "test",
  category: "transport",
  title: "Test Tip",
  description: "Desc",
  savingTons: 1,
  difficulty: "Easy",
  costImpact: "Saves money",
};

describe("Accessibility testing", () => {
  it("KPICard has no a11y violations", async () => {
    const { container } = render(<KPICard label="Test" value="100" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SkipLink has no a11y violations", async () => {
    const { container } = render(<SkipLink />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ScopeTooltip has no a11y violations", async () => {
    const { container } = render(<ScopeTooltip category="transport" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ActionCard has no a11y violations", async () => {
    const { container } = render(
      <ActionCard tip={MOCK_TIP} committed={false} onToggle={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
