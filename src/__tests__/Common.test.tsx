import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "@/components/Common/SkipLink";
import { ScopeTooltip } from "@/components/Common/ScopeTooltip";

describe("<SkipLink />", () => {
  it("targets #main-content", () => {
    render(<SkipLink />);
    const link = screen.getByText("Skip to main content");
    expect(link).toHaveAttribute("href", "#main-content");
  });
});

describe("<ScopeTooltip />", () => {
  it("labels button with scope + explainer for transport", () => {
    render(<ScopeTooltip category="transport" />);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-label")).toMatch(/Scope 1/);
  });
  it("labels energy as Scope 2", () => {
    render(<ScopeTooltip category="energy" />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toMatch(/Scope 2/);
  });
  it("labels food + shopping as Scope 3", () => {
    const { rerender } = render(<ScopeTooltip category="food" />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toMatch(/Scope 3/);
    rerender(<ScopeTooltip category="shopping" />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toMatch(/Scope 3/);
  });
});
