import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChartContainer from "./ChartContainer";
import { downloadCsv, downloadPng } from "./chartExport";

jest.mock("./chartExport", () => ({
  downloadCsv: jest.fn(),
  downloadPng: jest.fn(() => Promise.resolve()),
}));

const EXPORT_DATA = {
  filename: "sample",
  columns: [
    { key: "month", label: "Month" },
    { key: "total", label: "Total" },
  ],
  rows: [{ month: "Jul '24", total: 78 }],
  legend: [{ value: "Total", type: "line", color: "#3b82f6" }],
};

describe("ChartContainer", () => {
  beforeEach(() => jest.clearAllMocks());

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

  it("has no options menu unless a chart supplies exportData", () => {
    render(
      <ChartContainer title="Plain">
        <div>Chart</div>
      </ChartContainer>,
    );
    expect(screen.queryByLabelText("Chart options")).not.toBeInTheDocument();
  });

  it("swaps the chart for a data table and back", () => {
    render(
      <ChartContainer title="Sample" exportData={EXPORT_DATA}>
        <div>Chart Body</div>
      </ChartContainer>,
    );

    fireEvent.click(screen.getByLabelText("Chart options"));
    fireEvent.click(screen.getByRole("menuitem", { name: "View as table" }));

    expect(screen.queryByText("Chart Body")).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Jul '24" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Chart options"));
    fireEvent.click(screen.getByRole("menuitem", { name: "View as chart" }));

    expect(screen.getByText("Chart Body")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("exports the chart's own columns and rows as CSV", () => {
    render(
      <ChartContainer title="Sample" exportData={EXPORT_DATA}>
        <div>Chart Body</div>
      </ChartContainer>,
    );

    fireEvent.click(screen.getByLabelText("Chart options"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Export CSV" }));

    expect(downloadCsv).toHaveBeenCalledWith(
      "sample",
      EXPORT_DATA.columns,
      EXPORT_DATA.rows,
    );
  });

  it("passes the legend through to the PNG export", () => {
    const { container } = render(
      <ChartContainer title="Sample" exportData={EXPORT_DATA}>
        <svg className="recharts-surface" />
      </ChartContainer>,
    );
    const svg = container.querySelector("svg.recharts-surface");

    fireEvent.click(screen.getByLabelText("Chart options"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Download PNG" }));

    // The on-screen legend is HTML, so the export needs it handed over.
    expect(downloadPng).toHaveBeenCalledWith(svg, "sample", {
      legend: EXPORT_DATA.legend,
    });
  });

  it("explains why a PNG cannot be produced from the table view", () => {
    render(
      <ChartContainer title="Sample" exportData={EXPORT_DATA}>
        <div>Chart Body</div>
      </ChartContainer>,
    );

    fireEvent.click(screen.getByLabelText("Chart options"));
    fireEvent.click(screen.getByRole("menuitem", { name: "View as table" }));
    fireEvent.click(screen.getByLabelText("Chart options"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Download PNG" }));

    expect(downloadPng).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Switch back to the chart view/i),
    ).toBeInTheDocument();
  });

  it("closes the options menu when clicking outside it", () => {
    render(
      <ChartContainer title="Sample" exportData={EXPORT_DATA}>
        <div>Chart Body</div>
      </ChartContainer>,
    );

    fireEvent.click(screen.getByLabelText("Chart options"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
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
