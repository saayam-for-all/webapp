import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import GrowthLocationAnalytics from "./GrowthLocationAnalytics";
import {
  unwrapBody,
  formatPeriod,
  parseGrowthTrend,
  parseLocation,
} from "./growthLocationUtils";
import { getGrowthTrendAnalytics } from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices", () => ({
  getGrowthTrendAnalytics: jest.fn(),
}));

jest.mock("../../../../utils/isoCountryNames", () => ({
  isoAlpha3ToName: (code) =>
    ({ USA: "United States", JPN: "Japan", IND: "India" })[code] || code,
}));

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const BODY = {
  "7D": {
    growth_trend: { total_organizations: [], collaborators: [] },
    organizations_by_location: [],
  },
  "30D": {
    growth_trend: { total_organizations: [], collaborators: [] },
    organizations_by_location: [],
  },
  "1Y": {
    growth_trend: {
      total_organizations: [{ period: "2026-01", count: 218 }],
      collaborators: [{ period: "2026-01", count: 9 }],
    },
    organizations_by_location: [{ country: "JPN", count: 42 }],
  },
  All: {
    growth_trend: {
      total_organizations: [
        { period: "2025-06", count: 27 },
        { period: "2025-07", count: 46 },
      ],
      collaborators: [
        { period: "2025-06", count: 10 },
        { period: "2025-07", count: 7 },
      ],
    },
    organizations_by_location: [
      { country: "JPN", count: 61 },
      { country: "USA", count: 51 },
      { country: "IND", count: 32 },
    ],
  },
};

// Lambda proxy shape: body is a JSON string
const RESPONSE = { statusCode: 200, body: JSON.stringify(BODY) };

describe("GrowthLocationAnalytics helpers", () => {
  it("unwrapBody parses string bodies and passes objects through", () => {
    expect(unwrapBody(RESPONSE)).toEqual(BODY);
    expect(unwrapBody({ body: BODY })).toEqual(BODY);
    expect(unwrapBody(BODY)).toEqual(BODY);
    expect(unwrapBody({ body: "not json" })).toBeNull();
    expect(unwrapBody(null)).toBeNull();
  });

  it("formatPeriod handles monthly and daily periods", () => {
    expect(formatPeriod("2026-01")).toBe("Jan 2026");
    expect(formatPeriod("2026-01-06")).toBe("Jan 6, 2026");
    expect(formatPeriod("")).toBe("");
  });

  it("parseGrowthTrend merges series by period in order", () => {
    expect(
      parseGrowthTrend({
        total_organizations: [
          { period: "2025-07", count: 46 },
          { period: "2025-06", count: 27 },
        ],
        collaborators: [{ period: "2025-06", count: 10 }],
      }),
    ).toEqual([
      {
        period: "2025-06",
        totalOrganizations: 27,
        collaborators: 10,
        label: "Jun 2025",
      },
      { period: "2025-07", totalOrganizations: 46, label: "Jul 2025" },
    ]);
    expect(parseGrowthTrend(undefined)).toEqual([]);
  });

  it("parseLocation resolves names, sorts and computes share", () => {
    const rows = parseLocation([
      { country: "USA", count: 25 },
      { country: "JPN", count: 75 },
    ]);
    expect(rows[0]).toMatchObject({
      code: "JPN",
      country: "Japan",
      count: 75,
      percentage: 75,
    });
    expect(rows[1]).toMatchObject({ country: "United States", percentage: 25 });
    expect(parseLocation([])).toEqual([]);
  });
});

describe("GrowthLocationAnalytics component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("fetches with an empty payload and renders both charts", async () => {
    getGrowthTrendAnalytics.mockResolvedValue(RESPONSE);
    render(<GrowthLocationAnalytics />);
    expect(screen.getByText("Growth Trend")).toBeInTheDocument();
    expect(screen.getByText("Organizations by Location")).toBeInTheDocument();
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenCalledWith({}),
    );
    await waitFor(() =>
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    );
    expect(
      screen.queryByText("No data available for the selected period."),
    ).not.toBeInTheDocument();
  });

  it("shows empty state for windows with no data", async () => {
    getGrowthTrendAnalytics.mockResolvedValue(RESPONSE);
    render(<GrowthLocationAnalytics />);
    await waitFor(() =>
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument(),
    );
    fireEvent.click(screen.getAllByText("7D")[0]);
    expect(
      screen.getByText("No data available for the selected period."),
    ).toBeInTheDocument();
  });

  it("populates the country filter and sends it with organization_type", async () => {
    getGrowthTrendAnalytics.mockResolvedValue(RESPONSE);
    render(<GrowthLocationAnalytics />);
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Japan" })).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText("Country"), {
      target: { value: "USA" },
    });
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenLastCalledWith({
        country: "USA",
      }),
    );

    fireEvent.change(screen.getByLabelText("Organization Type"), {
      target: { value: "non_profit" },
    });
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenLastCalledWith({
        country: "USA",
        organization_type: "non_profit",
      }),
    );

    fireEvent.click(screen.getByText("Reset"));
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenLastCalledWith({}),
    );
  });

  it("sends start_date/end_date for a custom trend range", async () => {
    getGrowthTrendAnalytics.mockResolvedValue(RESPONSE);
    render(<GrowthLocationAnalytics />);
    await waitFor(() => expect(getGrowthTrendAnalytics).toHaveBeenCalled());

    fireEvent.click(screen.getAllByText("Custom")[0]);
    expect(
      screen.getByText("Select a valid start and end date."),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("trend-start"), {
      target: { value: "2026-01-01" },
    });
    fireEvent.change(screen.getByTestId("trend-end"), {
      target: { value: "2026-03-31" },
    });
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenLastCalledWith({
        start_date: "2026-01-01",
        end_date: "2026-03-31",
      }),
    );
  });

  it("sends location_start_date/location_end_date for a custom location range", async () => {
    getGrowthTrendAnalytics.mockResolvedValue(RESPONSE);
    render(<GrowthLocationAnalytics />);
    await waitFor(() => expect(getGrowthTrendAnalytics).toHaveBeenCalled());

    fireEvent.click(screen.getAllByText("Custom")[1]);
    fireEvent.change(screen.getByTestId("location-start"), {
      target: { value: "2026-04-01" },
    });
    fireEvent.change(screen.getByTestId("location-end"), {
      target: { value: "2026-06-30" },
    });
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenLastCalledWith({
        location_start_date: "2026-04-01",
        location_end_date: "2026-06-30",
      }),
    );
  });

  it("does not request a custom range when start is after end", async () => {
    getGrowthTrendAnalytics.mockResolvedValue(RESPONSE);
    render(<GrowthLocationAnalytics />);
    await waitFor(() =>
      expect(getGrowthTrendAnalytics).toHaveBeenCalledTimes(1),
    );
    fireEvent.click(screen.getAllByText("Custom")[0]);
    fireEvent.change(screen.getByTestId("trend-start"), {
      target: { value: "2026-02-01" },
    });
    fireEvent.change(screen.getByTestId("trend-end"), {
      target: { value: "2026-01-01" },
    });
    expect(getGrowthTrendAnalytics).toHaveBeenCalledTimes(1);
  });

  it("shows the API error message from the body", async () => {
    getGrowthTrendAnalytics.mockResolvedValue({
      statusCode: 400,
      body: JSON.stringify({
        error: "start_date and end_date must be sent together",
      }),
    });
    render(<GrowthLocationAnalytics />);
    expect(
      await screen.findAllByText(
        "start_date and end_date must be sent together",
      ),
    ).toHaveLength(2);
  });

  it("shows a generic error when the request fails", async () => {
    getGrowthTrendAnalytics.mockRejectedValue(new Error("Network"));
    render(<GrowthLocationAnalytics />);
    expect(
      await screen.findAllByText(
        "Could not load data. Please try again later.",
      ),
    ).toHaveLength(2);
  });
});
