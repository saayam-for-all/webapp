import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import OrganizationAnalytics from "./OrganizationAnalytics";
import { getOrganizationAnalytics } from "./organizationData";

// Silence recharts ResizeObserver warnings in jsdom
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom reports a zero-size container, so recharts renders no chart at all.
// Give ResponsiveContainer fixed dimensions so marks, axes and the legend
// actually render and can be asserted on. Spreading the module here would
// trip recharts' lazy getters mid-require, so delegate through a Proxy.
jest.mock("recharts", () => {
  const actual = jest.requireActual("recharts");
  // Required inside the factory — jest.mock forbids out-of-scope references.
  const types = jest.requireActual("prop-types");
  const Sized = ({ children, height }) => (
    <actual.ResponsiveContainer width={800} height={height || 240}>
      {children}
    </actual.ResponsiveContainer>
  );
  Sized.propTypes = {
    children: types.node,
    height: types.oneOfType([types.number, types.string]),
  };
  return new Proxy(actual, {
    get: (target, prop) =>
      prop === "ResponsiveContainer" ? Sized : target[prop],
  });
});

describe("getOrganizationAnalytics", () => {
  it("returns the unfiltered baseline figures", () => {
    const data = getOrganizationAnalytics();
    expect(data.kpis.totalOrganizations).toBe(129);
    expect(data.kpis.activeOrganizations).toBe(94);
    expect(data.kpis.collaboratorOrgs).toBe(33);
    expect(data.kpis.avgRating).toBe(4.2);
    expect(data.kpis.totalProfit).toBe(1240000);
    expect(data.growthTrend).toHaveLength(12);
    expect(data.byRating).toHaveLength(5);
  });

  it("narrows the trend window to the selected date range", () => {
    expect(
      getOrganizationAnalytics({ dateRange: "6m" }).growthTrend,
    ).toHaveLength(6);
    expect(
      getOrganizationAnalytics({ dateRange: "3m" }).growthTrend,
    ).toHaveLength(3);
  });

  it("scales every metric down when a region is selected", () => {
    const all = getOrganizationAnalytics();
    const west = getOrganizationAnalytics({ region: "West" });
    expect(west.kpis.totalOrganizations).toBeLessThan(
      all.kpis.totalOrganizations,
    );
    expect(west.kpis.totalProfit).toBeLessThan(all.kpis.totalProfit);
    // West rolls up California + Other only
    expect(west.byLocation.map((r) => r.location)).toEqual([
      "California",
      "Other",
    ]);
  });

  it("zeroes the opposing series when an org type is selected", () => {
    const profit = getOrganizationAnalytics({ orgType: "Profit" });
    expect(profit.profitTrend.every((m) => m.nonProfit === 0)).toBe(true);
    expect(profit.profitTrend.some((m) => m.profit > 0)).toBe(true);

    const nonProfit = getOrganizationAnalytics({ orgType: "Non-Profit" });
    expect(nonProfit.profitTrend.every((m) => m.profit === 0)).toBe(true);
  });

  it("sorts locations by size and keeps 'Other' last, with percents summing to ~100", () => {
    const { byLocation } = getOrganizationAnalytics();
    expect(byLocation[byLocation.length - 1].location).toBe("Other");
    const named = byLocation.filter((r) => r.location !== "Other");
    const descending = named.every(
      (r, i) => i === 0 || named[i - 1].organizations >= r.organizations,
    );
    expect(descending).toBe(true);
    const sum = byLocation.reduce((s, r) => s + r.percent, 0);
    expect(sum).toBeGreaterThan(99);
    expect(sum).toBeLessThan(101);
  });

  it("splits collaborators and contributors to the org total", () => {
    const { kpis, collaboratorSplit } = getOrganizationAnalytics();
    expect(collaboratorSplit.reduce((s, e) => s + e.value, 0)).toBe(
      kpis.totalOrganizations,
    );
  });
});

describe("OrganizationAnalytics", () => {
  it("renders the header, filters and KPI tiles", () => {
    render(<OrganizationAnalytics />);
    expect(screen.getByText("ORGANIZATION DASHBOARD")).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization Type/i)).toBeInTheDocument();

    // Series names also appear in chart legends, so scope to the KPI row.
    const kpis = within(screen.getByLabelText("Key metrics"));
    expect(kpis.getByText("Total Organizations")).toBeInTheDocument();
    expect(kpis.getByText("129")).toBeInTheDocument();
    expect(kpis.getByText("Avg. Org Rating")).toBeInTheDocument();
    expect(kpis.getByText("$1.24M")).toBeInTheDocument();
  });

  it("shows Overview first and switches between the three sub-tabs", () => {
    render(<OrganizationAnalytics />);

    expect(screen.getByText(/Growth Trend/)).toBeInTheDocument();
    expect(screen.getByText(/Organizations by Location/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Performance" }));
    expect(screen.getByText(/Organizations by Size/)).toBeInTheDocument();
    expect(screen.getByText(/Collaborator vs Contributor/)).toBeInTheDocument();
    expect(screen.queryByText(/Growth Trend/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Distribution" }));
    expect(screen.getByText(/Rating Distribution/)).toBeInTheDocument();
    expect(screen.getByText(/Profit vs Non-Profit/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Overview" }));
    expect(screen.getByText(/Growth Trend/)).toBeInTheDocument();
  });

  it("re-renders KPIs when a filter changes and restores them on reset", () => {
    render(<OrganizationAnalytics />);
    const reset = screen.getByRole("button", { name: /Reset/i });
    expect(reset).toBeDisabled();

    const kpis = () => within(screen.getByLabelText("Key metrics"));
    expect(kpis().getByText("129")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Region/i), {
      target: { value: "West" },
    });
    expect(kpis().queryByText("129")).not.toBeInTheDocument();
    expect(reset).toBeEnabled();

    fireEvent.click(reset);
    expect(kpis().getByText("129")).toBeInTheDocument();
    expect(reset).toBeDisabled();
  });

  it("labels the donut with counts and percentages, not colour alone", () => {
    render(<OrganizationAnalytics />);
    fireEvent.click(screen.getByRole("button", { name: "Performance" }));
    expect(screen.getByText("Collaborator")).toBeInTheDocument();
    expect(
      screen.getByText("Contributor (Non-Collaborator)"),
    ).toBeInTheDocument();
    expect(screen.getByText(/\(25\.6%\)/)).toBeInTheDocument();
  });

  it("keeps legend order matching the order the series are drawn", () => {
    // Recharts re-sorts its own legend payload, so the legend is rendered by
    // the component. Guards against a regression back to the built-in legend.
    const { container } = render(<OrganizationAnalytics />);
    const overview = [
      ...container.querySelectorAll(".recharts-legend-wrapper li"),
    ].map((li) => li.textContent);
    expect(overview).toEqual([
      "Total Organizations",
      "Active Organizations",
      "Collaborator Orgs",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Distribution" }));
    const distribution = [
      ...container.querySelectorAll(".recharts-legend-wrapper li"),
    ].map((li) => li.textContent);
    expect(distribution).toEqual([
      "Profit Organizations",
      "Non-Profit Organizations",
    ]);
  });

  it("labels the KPI delta as growth since the start of the window", () => {
    render(<OrganizationAnalytics />);
    // 78 -> 129 total organizations across the default 12-month window
    expect(screen.getAllByText(/vs period start/i)).toHaveLength(5);
    expect(screen.getByText("↑ 65% vs period start")).toBeInTheDocument();
  });

  it("numbers the chart titles and names the chart type", () => {
    render(<OrganizationAnalytics />);
    expect(
      screen.getByText("1. Growth Trend (Line Chart)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("2. Organizations by Location (Bar Chart)"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Distribution" }));
    expect(
      screen.getByText("6. Profit vs Non-Profit (Stacked Bar Chart)"),
    ).toBeInTheDocument();
  });

  it("steps through the sub-tabs with the prev/next arrows", () => {
    render(<OrganizationAnalytics />);
    const prev = screen.getByRole("button", { name: "Previous tab" });
    const next = screen.getByRole("button", { name: "Next tab" });

    // First tab: there is nothing before it.
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();

    fireEvent.click(next);
    expect(screen.getByText(/Organizations by Size/)).toBeInTheDocument();
    expect(prev).toBeEnabled();

    fireEvent.click(next);
    expect(screen.getByText(/Rating Distribution/)).toBeInTheDocument();
    expect(next).toBeDisabled();

    fireEvent.click(prev);
    expect(screen.getByText(/Organizations by Size/)).toBeInTheDocument();
  });

  it("swaps a chart for its data table from the kebab menu", () => {
    render(<OrganizationAnalytics />);
    // Two charts on the Overview tab, so two menus.
    const menus = screen.getAllByRole("button", { name: "Chart options" });
    expect(menus).toHaveLength(2);

    fireEvent.click(menus[0]);
    fireEvent.click(screen.getByRole("menuitem", { name: "View as table" }));

    // The growth trend's own columns and first row.
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Month" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Jul '24" })).toBeInTheDocument();

    fireEvent.click(menus[0]);
    fireEvent.click(screen.getByRole("menuitem", { name: "View as chart" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("closes the kebab menu on Escape", () => {
    render(<OrganizationAnalytics />);
    const menu = screen.getAllByRole("button", { name: "Chart options" })[0];

    fireEvent.click(menu);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders the indicative-data footer", () => {
    render(<OrganizationAnalytics />);
    expect(
      screen.getByText(
        /All values are indicative and for dashboard purposes only/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Data as of Jun 30, 2025/i)).toBeInTheDocument();
  });
});
