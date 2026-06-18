import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KPICard } from "@/components/Dashboard/KPICard";

describe("<KPICard />", () => {
  it("renders label, value, hint and delta", () => {
    render(
      <KPICard
        eyebrow="Total"
        label="This month"
        value={<>1.20 t</>}
        delta="↓ 5%"
        hint="vs last month"
      />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
    expect(screen.getByText("1.20 t")).toBeInTheDocument();
    expect(screen.getByText("↓ 5%")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("applies dark variant classes", () => {
    const { container } = render(<KPICard variant="dark" label="X" value={<>1</>} />);
    expect(container.firstChild).toHaveClass("bg-charcoal");
  });
});
