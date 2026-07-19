import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionCard } from "@/components/Actions/ActionCard";
import type { Tip } from "@/data/tips";

const TIP: Tip = {
  id: "t-test",
  category: "transport",
  title: "Test action",
  description: "Test description",
  savingTons: 0.42,
  difficulty: "Easy",
  costImpact: "Saves money",
};

describe("<ActionCard />", () => {
  it("renders title, savings and category", () => {
    render(<ActionCard tip={TIP} committed={false} onToggle={() => {}} />);
    expect(screen.getByText("Test action")).toBeInTheDocument();
    expect(screen.getByText(/Saves 0.42/)).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
  });

  it("toggles aria-pressed and label when committed", () => {
    const onToggle = vi.fn();
    const { rerender } = render(<ActionCard tip={TIP} committed={false} onToggle={onToggle} />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveAccessibleName(/Commit to Test action/);

    rerender(<ActionCard tip={TIP} committed={true} onToggle={onToggle} />);
    const btn2 = screen.getByRole("button");
    expect(btn2).toHaveAttribute("aria-pressed", "true");
    expect(btn2).toHaveAccessibleName(/Uncommit from Test action/);
  });

  it("invokes onToggle on click", async () => {
    const onToggle = vi.fn();
    render(<ActionCard tip={TIP} committed={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
