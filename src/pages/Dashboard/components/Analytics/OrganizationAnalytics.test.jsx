import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import OrganizationAnalytics from "./OrganizationAnalytics";
import organizationOverviewMock from "../../../../data/analytics/organization_overview";
import {
  getKpiAnalytics,
  getVolunteerApplicationAnalytics,
  getBeneficiariesTrendAnalysis,
} from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices");

jest.mock("recharts", () => ({
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: () => null,
  LineChart: ({ children, data }) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  Cell: () => null,
}));

const KPI_RESPONSE = {
  body: {
    All: { total_requests: 311 },
    "1Y": {
      total_requests: [
        { period: "2026-01", total_requests: 21 },
        { period: "2026-02", total_requests: 40 },
      ],
    },
  },
};

const VOLUNTEER_RESPONSE = {
  body: {
    All: {
      volunteer_activity_trend: {
        total_volunteers: [
          { period: "2026-01", count: 12 },
          { period: "2026-02", count: 18 },
        ],
      },
    },
    "1Y": {
      volunteer_activity_trend: {
        total_volunteers: [
          { period: "2026-01", count: 12 },
          { period: "2026-02", count: 18 },
        ],
      },
    },
  },
};

const BENEFICIARY_RESPONSE = {
  body: {
    "Beneficiaries count all": [
      { Date: "2026-01-01T00:00:00", Count: 5 },
      { Date: "2026-02-01T00:00:00", Count: 7 },
    ],
    "Beneficiaries count 1 year": [
      { Date: "2026-01-01T00:00:00", Count: 5 },
      { Date: "2026-02-01T00:00:00", Count: 7 },
    ],
  },
};

const getBarChartData = () =>
  JSON.parse(screen.getByTestId("bar-chart").dataset.chartData);

const getNameCounts = (chartData) =>
  chartData.map(({ name, count }) => ({ name, count }));

const selectMetric = (metricId) => {
  fireEvent.change(screen.getByLabelText("Select organization metric"), {
    target: { value: metricId },
  });
};

describe("OrganizationAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getKpiAnalytics.mockResolvedValue(KPI_RESPONSE);
    getVolunteerApplicationAnalytics.mockResolvedValue(VOLUNTEER_RESPONSE);
    getBeneficiariesTrendAnalysis.mockResolvedValue(BENEFICIARY_RESPONSE);
  });

  it("renders both chart titles immediately, with Overview not gated on the network fetch", () => {
    getKpiAnalytics.mockReturnValue(new Promise(() => {}));
    getVolunteerApplicationAnalytics.mockReturnValue(new Promise(() => {}));
    getBeneficiariesTrendAnalysis.mockReturnValue(new Promise(() => {}));

    render(<OrganizationAnalytics />);

    expect(screen.getByText("Organization Overview")).toBeInTheDocument();
    expect(screen.getByText("Organization Performance")).toBeInTheDocument();
    expect(screen.getByText(/loading performance data/i)).toBeInTheDocument();
  });

  it("shows the total organizations count from the mock summary", () => {
    render(<OrganizationAnalytics />);
    expect(
      screen.getByText(
        `Total Organizations: ${organizationOverviewMock.summary.total_organizations}`,
      ),
    ).toBeInTheDocument();
  });

  it("defaults to Organizations by Type", () => {
    render(<OrganizationAnalytics />);
    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.organizations_by_type,
    );
  });

  it("switches to Organizations by Size", () => {
    render(<OrganizationAnalytics />);
    selectMetric("size");
    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.organizations_by_size,
    );
  });

  it("switches to Collaborator Distribution", () => {
    render(<OrganizationAnalytics />);
    selectMetric("collaborator");
    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.collaborator_distribution,
    );
  });

  it("switches to Contributor Distribution", () => {
    render(<OrganizationAnalytics />);
    selectMetric("contributor");
    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.contributor_distribution,
    );
  });

  it("shows State/City toggle for location and defaults to State", () => {
    render(<OrganizationAnalytics />);
    selectMetric("location");

    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.organizations_by_location.state,
    );
  });

  it("switches location breakdown to City when City is clicked", () => {
    render(<OrganizationAnalytics />);
    selectMetric("location");
    fireEvent.click(screen.getByText("City"));

    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.organizations_by_location.city,
    );
  });

  it("shows Daily/Weekly/Monthly/Yearly toggle for registration trend and defaults to Monthly", () => {
    render(<OrganizationAnalytics />);
    selectMetric("registrationTrend");

    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();

    // Overview's line-chart is the first one rendered in DOM order (before Performance's).
    const [overviewTrendData] = screen
      .getAllByTestId("line-chart")
      .map((el) => JSON.parse(el.dataset.chartData));

    const rawTotal =
      organizationOverviewMock.organization_activity_trend.reduce(
        (sum, item) => sum + item.count,
        0,
      );
    // Full history spans exactly Jul 2024 - Jun 2026 -> 24 monthly buckets.
    expect(overviewTrendData).toHaveLength(24);
    expect(overviewTrendData.reduce((sum, item) => sum + item.count, 0)).toBe(
      rawTotal,
    );
  });

  it("aggregates registration trend by Year with one bucket per calendar year", () => {
    render(<OrganizationAnalytics />);
    selectMetric("registrationTrend");
    fireEvent.click(screen.getByText("Yearly"));

    const [overviewTrendData] = screen
      .getAllByTestId("line-chart")
      .map((el) => JSON.parse(el.dataset.chartData));

    expect(overviewTrendData.map((item) => item.label)).toEqual([
      "2024",
      "2025",
      "2026",
    ]);
    const rawTotal =
      organizationOverviewMock.organization_activity_trend.reduce(
        (sum, item) => sum + item.count,
        0,
      );
    expect(overviewTrendData.reduce((sum, item) => sum + item.count, 0)).toBe(
      rawTotal,
    );
  });

  it("caps the Daily registration trend view to the most recent 30 points", () => {
    render(<OrganizationAnalytics />);
    selectMetric("registrationTrend");
    fireEvent.click(screen.getByText("Daily"));

    const [overviewTrendData] = screen
      .getAllByTestId("line-chart")
      .map((el) => JSON.parse(el.dataset.chartData));

    const last30Raw =
      organizationOverviewMock.organization_activity_trend.slice(-30);
    expect(overviewTrendData).toHaveLength(30);
    expect(overviewTrendData.map((item) => item.count)).toEqual(
      last30Raw.map((item) => item.count),
    );
  });

  it("merges the 1-year trends into a single monthly performance series", async () => {
    render(<OrganizationAnalytics />);

    await waitFor(() => {
      // Performance's line-chart is the only one rendered while Overview shows Type (bar chart).
      const chartData = JSON.parse(
        screen.getByTestId("line-chart").dataset.chartData,
      );
      expect(chartData).toEqual([
        {
          month: "2026-01",
          label: "Jan 2026",
          requests: 21,
          volunteers: 12,
          beneficiaries: 5,
        },
        {
          month: "2026-02",
          label: "Feb 2026",
          requests: 40,
          volunteers: 18,
          beneficiaries: 7,
        },
      ]);
    });
  });

  it("shows an error banner in Performance only when every source fails", async () => {
    getKpiAnalytics.mockRejectedValue(new Error("kpi down"));
    getVolunteerApplicationAnalytics.mockRejectedValue(new Error("vol down"));
    getBeneficiariesTrendAnalysis.mockRejectedValue(new Error("ben down"));

    render(<OrganizationAnalytics />);

    await waitFor(() => {
      expect(
        screen.getByText(/could not load organization data/i),
      ).toBeInTheDocument();
    });
    // Overview is unaffected — it's driven by local mock data, not the network calls.
    expect(getNameCounts(getBarChartData())).toEqual(
      organizationOverviewMock.organizations_by_type,
    );
  });

  it("does not show the error banner when only one source fails", async () => {
    getVolunteerApplicationAnalytics.mockRejectedValue(new Error("vol down"));

    render(<OrganizationAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Organization Performance")).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/could not load organization data/i),
    ).not.toBeInTheDocument();
  });
});
