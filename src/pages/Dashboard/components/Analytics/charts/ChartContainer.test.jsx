import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChartContainer from "./ChartContainer";

describe("ChartContainer", () => {
  it("renders title, description, and children", () => {
    render(
      <ChartContainer title="Sample Title" description="Sample Description">
        <div>Child Content</div>
      </ChartContainer>,
    );

    expect(screen.getByText("Sample Title")).toBeInTheDocument();
    expect(screen.getByText("Sample Description")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("opens and closes the expanded modal from the close button", () => {
    render(
      <ChartContainer title="Expanded Title" description="Expanded Description">
        <div>Modal Content</div>
      </ChartContainer>,
    );

    fireEvent.click(screen.getByLabelText("Expand chart"));

    expect(screen.getAllByText("Expanded Title")).toHaveLength(2);
    expect(screen.getAllByText("Expanded Description")).toHaveLength(2);
    expect(screen.getAllByText("Modal Content")).toHaveLength(2);

    fireEvent.click(screen.getByLabelText("Close expanded chart"));

    expect(
      screen.queryByLabelText("Close expanded chart"),
    ).not.toBeInTheDocument();
  });

  it("closes the expanded modal when clicking the backdrop", () => {
    const { container } = render(
      <ChartContainer title="Backdrop Title">
        <div>Backdrop Content</div>
      </ChartContainer>,
    );

    fireEvent.click(screen.getByLabelText("Expand chart"));

    fireEvent.click(container.querySelector("div.fixed.inset-0"));

    expect(
      screen.queryByLabelText("Close expanded chart"),
    ).not.toBeInTheDocument();
  });

  it("renders without optional title and description", () => {
    render(
      <ChartContainer>
        <div>Untitled Content</div>
      </ChartContainer>,
    );

    expect(screen.getByText("Untitled Content")).toBeInTheDocument();
    expect(screen.queryByText("Sample Title")).not.toBeInTheDocument();
  });
});
