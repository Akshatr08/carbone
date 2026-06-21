import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EcoBot } from "@/components/Chat/EcoBot";

describe("<EcoBot />", () => {
  it("renders the AI chat interface", () => {
    render(<EcoBot />);
    expect(screen.getByText("EcoBot")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask EcoBot about your footprint…")).toBeInTheDocument();
  });
});
