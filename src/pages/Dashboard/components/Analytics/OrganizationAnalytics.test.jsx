import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import OrganizationAnalytics from "./OrganizationAnalytics";
import { getOrganizationAnalytics } from "./organizationData";
import { getOrgRatingTypeAnalytics } from "../../../../services/analyticsServices";

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

jest.mock("../../../../services/analyticsServices", () => ({
  getOrgRatingTypeAnalytics: jest.fn(),
}));

const emptyRatingPeriod = {
  rating_distribution: [],
  organization_mix_trend: {
    for_profit: [],
    non_profit: [],
  },
};

const sampleRatingPeriod = {
  rating_distribution: [
    { rating: 1, count: 2 },
    { rating: 2, count: 10 },
    { rating: 3, count: 35 },
    { rating: 4, count: 73 },
    { rating: 5, count: 83 },
  ],
  organization_mix_trend: {
    for_profit: [
      { period: "2025-11", count: 56 },
      { period: "2025-12", count: 66 },
    ],
    non_profit: [
      { period: "2025-11", count: 104 },
      { period: "2025-12", count: 127 },
    ],
  },
};

beforeEach(() => {
  getOrgRatingTypeAnalytics.mockReset();
  getOrgRatingTypeAnalytics.mockResolvedValue({
    statusCode: 200,
    body: JSON.stringify({
      "7D": emptyRatingPeriod,
      "30D": emptyRatingPeriod,
      "1Y": sampleRatingPeriod,
      All: sampleRatingPeriod,
    }),
  });
});

describe("getOrganizationAnalytics", () => {
  it("returns the unfiltered baseline figures", () => {
    const data = getOrganizationAnalytics();
    expect(data.kpis.totalOrganizations).toBe(129);
    expect(data.kpis.activeOrganizations).toBe(94);
    expect(data.kpis.collaboratorOrgs).toBe(33);
    expect(data.kpis.avgRating).toBe(4.2);
    expect(data.growthTrend).toHaveLength(12);
    expect(data.byRating).toHaveLength(5);
  });

  it("narrows the trend window to the selected date range", () => {
    expect(
      getOrganizationAnalytics({ dateRange: "7d" }).growthTrend,
    ).toHaveLength(7);
    expect(
      getOrganizationAnalytics({ dateRange: "30d" }).growthTrend,
    ).toHaveLength(30);
  });

  it("limits a custom range to the chosen days, falling back to all days when nothing matches", () => {
    const custom = (customStartDate, customEndDate) =>
      getOrganizationAnalytics({
        dateRange: "custom",
        customStartDate,
        customEndDate,
      }).growthTrend;

    expect(custom("2025-06-10", "2025-06-12").map((d) => d.date)).toEqual([
      "2025-06-10",
      "2025-06-11",
      "2025-06-12",
    ]);
    expect(custom("2020-01-01", "2020-01-31")).toHaveLength(30);
  });

  it("scales every metric down when a region is selected", () => {
    const all = getOrganizationAnalytics();
    const west = getOrganizationAnalytics({ region: "West" });
    expect(west.kpis.totalOrganizations).toBeLessThan(
      all.kpis.totalOrganizations,
    );
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

    // Series names also appear in chart legends, so scope to the KPI row.
    const kpis = within(screen.getByLabelText("Key metrics"));
    expect(kpis.getByText("Total Organizations")).toBeInTheDocument();
    expect(kpis.getByText("129")).toBeInTheDocument();
    expect(kpis.getByText("Avg. Org Rating")).toBeInTheDocument();
  });

  it("shows Overview first and switches between the three sub-tabs", async () => {
    render(<OrganizationAnalytics />);

    expect(screen.getByText(/Growth Trend/)).toBeInTheDocument();
    expect(screen.getByText(/Organizations by Location/)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Size & Contribution" }),
    );
    expect(screen.getByText(/Organizations by Size/)).toBeInTheDocument();
    expect(screen.getByText(/Collaborator vs Contributor/)).toBeInTheDocument();
    expect(screen.queryByText(/Growth Trend/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));
    await screen.findByText(/Profit vs Non-Profit/);
    expect(screen.getByText(/Rating Distribution/)).toBeInTheDocument();
    expect(screen.getByText(/Profit vs Non-Profit/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Growth & Location" }));
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
    fireEvent.click(
      screen.getByRole("button", { name: "Size & Contribution" }),
    );
    expect(screen.getByText("Collaborator")).toBeInTheDocument();
    expect(
      screen.getByText("Contributor (Non-Collaborator)"),
    ).toBeInTheDocument();
    expect(screen.getByText(/\(27\.1%\)/)).toBeInTheDocument();
  });

  it("keeps legend order matching the order the series are drawn", async () => {
    // Recharts re-sorts its own legend payload, so the legend is rendered by
    // the component. Guards against a regression back to the built-in legend.
    const { container } = render(<OrganizationAnalytics />);
    const overview = [
      ...container.querySelectorAll(".recharts-legend-wrapper li"),
    ].map((li) => li.textContent);
    expect(overview).toEqual([
      "Total Organizations",
      "Total Collaborators",
      "Total Contributors",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));
    await screen.findByText(/Profit vs Non-Profit/);
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
    expect(screen.getAllByText(/vs period start/i)).toHaveLength(4);
    expect(screen.getByText("↑ 65% vs period start")).toBeInTheDocument();
  });

  it("numbers the chart titles and names the chart type", async () => {
    render(<OrganizationAnalytics />);
    expect(
      screen.getByText("1. Growth Trend (Line Chart)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("2. Organizations by Location (Bar Chart)"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));
    await screen.findByText(/Profit vs Non-Profit/);
    expect(
      screen.getByText("6. Profit vs Non-Profit (Stacked Bar Chart)"),
    ).toBeInTheDocument();
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

  it("shows date inputs for a custom range and clears them on reset", () => {
    const { container } = render(<OrganizationAnalytics />);
    const dateInputs = () => container.querySelectorAll('input[type="date"]');
    expect(dateInputs()).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Custom" }));
    const [start, end] = dateInputs();
    fireEvent.change(start, { target: { value: "2025-06-10" } });
    fireEvent.change(end, { target: { value: "2025-06-12" } });
    expect(start).toHaveValue("2025-06-10");
    expect(end).toHaveValue("2025-06-12");
    // Daily data is plotted with MM/DD/YY axis labels.
    expect(screen.getAllByText("06/10/25").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));
    expect(dateInputs()).toHaveLength(0);
  });
});

describe("Rating & Type API integration", () => {
  it("loads rating analytics when the Rating & Type tab is selected", async () => {
    render(<OrganizationAnalytics />);

    expect(getOrgRatingTypeAnalytics).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));

    expect(
      await screen.findByText("5. Rating Distribution (Bar Chart)"),
    ).toBeInTheDocument();

    expect(getOrgRatingTypeAnalytics).toHaveBeenCalledWith({});
  });

  it("shows an empty-data message for an empty preset period", async () => {
    render(<OrganizationAnalytics />);

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));

    await screen.findByText("5. Rating Distribution (Bar Chart)");

    fireEvent.click(screen.getByRole("button", { name: "7 Days" }));

    expect(
      await screen.findByText(
        "No rating distribution data for the selected period.",
      ),
    ).toBeInTheDocument();

    expect(getOrgRatingTypeAnalytics).toHaveBeenCalledTimes(1);
  });

  it("displays an error message when the API fails", async () => {
    getOrgRatingTypeAnalytics.mockRejectedValueOnce(new Error("Network error"));

    render(<OrganizationAnalytics />);

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));

    expect(
      await screen.findByText("Unable to load Rating & Type analytics."),
    ).toBeInTheDocument();
  });

  it("requests analytics for a valid custom date range", async () => {
    getOrgRatingTypeAnalytics.mockResolvedValueOnce({
      Custom: sampleRatingPeriod,
    });

    const { container } = render(<OrganizationAnalytics />);

    fireEvent.click(screen.getByRole("button", { name: "Custom" }));

    fireEvent.click(screen.getByRole("button", { name: "Rating & Type" }));

    expect(getOrgRatingTypeAnalytics).not.toHaveBeenCalled();

    const [start, end] = container.querySelectorAll('input[type="date"]');

    fireEvent.change(start, {
      target: { value: "2026-01-01" },
    });

    fireEvent.change(end, {
      target: { value: "2026-03-31" },
    });

    await screen.findByText("5. Rating Distribution (Bar Chart)");

    expect(getOrgRatingTypeAnalytics).toHaveBeenCalledWith({
      start_date: "2026-01-01",
      end_date: "2026-03-31",
    });
  });
});
