import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityForm } from "@/components/Tracker/ActivityForm";

describe("<ActivityForm />", () => {
  it("renders correctly with transport tab active", () => {
    render(<ActivityForm />);
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.getByText("Calculate & Add")).toBeInTheDocument();
  });
});
