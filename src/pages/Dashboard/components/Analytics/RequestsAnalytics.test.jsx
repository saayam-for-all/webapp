import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RequestsAnalytics from "./RequestsAnalytics";
import { getRequestsApplicationAnalytics } from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices", () => ({
  getRequestsApplicationAnalytics: jest.fn(),
}));

jest.mock("./charts/ChartContainer", () => ({
  __esModule: true,
  default: ({ title, children }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

jest.mock("recharts", () => ({
  LineChart: ({ children, data }) => (
    <div data-testid="line-chart" data-points={data?.length || 0}>
      {children}
    </div>
  ),
  Line: () => null,
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart" data-points={data?.length || 0}>
      {children}
    </div>
  ),
  Bar: ({ dataKey }) => <div data-testid={`bar-${String(dataKey)}`} />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: ({ content }) => {
    let rendered = null;
    if (content && typeof content.type === "function") {
      rendered = content.type({
        active: true,
        payload: [{ payload: { date: "2026-06-24", count: 6 } }],
      });
      // Also run inactive path for coverage
      content.type({ active: false, payload: [] });
    }
    return <div data-testid="tooltip">{rendered}</div>;
  },
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  ReferenceLine: () => null,
}));

const BASE_RESPONSE = {
  statusCode: 200,
  body: {
    request_volume_7_days: [
      { date: "2026-06-20T00:00:00", count: 1 },
      { date: "2026-06-24T00:00:00", count: 6 },
    ],
    request_volume_1_month: [
      { date: "2026-06-01T00:00:00", count: 2 },
      { date: "2026-06-24T00:00:00", count: 10 },
    ],
    request_volume_1_year: [
      { date: "2026-01-01T00:00:00", count: 21 },
      { date: "2026-06-01T00:00:00", count: 79 },
    ],
    request_volume_custom_range: [{ date: "2026-05-01T00:00:00", count: 3 }],
    "requests_by_category_region 7 days": [
      { category: "GENERAL_CATEGORY", country: "USA", count: 2 },
      { category: "GENERAL_CATEGORY", country: "AFG", count: 1 },
      { category: "MEDICINE_DELIVERY", country: "USA", count: 4 },
    ],
    "requests_by_category_region 1 month": [
      { category: "GENERAL_CATEGORY", country: "USA", count: 10 },
      { category: "GENERAL_CATEGORY", country: "AFG", count: 5 },
      { category: "DONATE_CLOTHES", country: "USA", count: 3 },
    ],
    "requests_by_category_region 1 year": [
      { category: "GENERAL_CATEGORY", country: "USA", count: 45 },
      { category: "GENERAL_CATEGORY", country: "USA", count: 1 },
      { category: "GENERAL_CATEGORY", country: "AFG", count: 33 },
      { category: "DONATE_CLOTHES", country: "USA", count: 17 },
      { category: "MATH", country: "XXX", count: 2 },
    ],
    "requests_by_category_region custom range": [
      { category: "GENERAL_CATEGORY", country: "USA", count: 1 },
    ],
  },
};

describe("RequestsAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    getRequestsApplicationAnalytics.mockReturnValue(new Promise(() => {}));
    render(<RequestsAnalytics />);
    expect(screen.getAllByText(/Loading data/i).length).toBeGreaterThan(0);
  });

  it("calls API with empty payload on mount and renders charts", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledWith({});
    });

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByText("Request Volume Trend")).toBeInTheDocument();
    expect(
      screen.getByText("Requests by Category & Region"),
    ).toBeInTheDocument();
  });

  it("maps ISO codes to names and falls back to code when unknown", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(screen.getAllByText(/Afghanistan/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/United States/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/XXX/i).length).toBeGreaterThan(0);
    });
  });

  it("does not refetch when switching between preset ranges due to cache", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByText("7D"));
    fireEvent.click(screen.getByText("30D"));
    fireEvent.click(screen.getByText("1Y"));
    fireEvent.click(screen.getByText("All"));

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });
  });

  it("shows custom controls and fetches only when both dates are set", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByText("Custom"));

    // No fetch yet (custom selected, but dates missing)
    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });

    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: "2026-05-01" } });

    // Still no fetch (end date missing)
    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(dateInputs[1], { target: { value: "2026-05-31" } });

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledWith({
        start_date: "2026-05-01",
        end_date: "2026-05-31",
        group_by: "day",
      });
    });
  });

  it("updates custom payload when group_by changes to month", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByText("Custom"));
    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: "2026-01-01" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-06-01" } });

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({ group_by: "day" }),
      );
    });

    fireEvent.change(screen.getByDisplayValue("Group: Day"), {
      target: { value: "month" },
    });

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          start_date: "2026-01-01",
          end_date: "2026-06-01",
          group_by: "month",
        }),
      );
    });
  });

  it("reuses cached default data when switching back to All after custom", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByText("Custom"));
    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[0], { target: { value: "2026-05-01" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-05-31" } });

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(screen.getByText("All"));

    await waitFor(() => {
      expect(getRequestsApplicationAnalytics).toHaveBeenCalledTimes(2);
    });
  });

  it("supports category/country/sort filters and renders matching bars", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue(BASE_RESPONSE);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Top 5:")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue("Sort: Total"), {
      target: { value: "name" },
    });

    fireEvent.change(screen.getByDisplayValue("All Categories"), {
      target: { value: "GENERAL_CATEGORY" },
    });

    fireEvent.change(screen.getByDisplayValue("All Countries"), {
      target: { value: "United States" },
    });

    await waitFor(() => {
      expect(screen.getByTestId("bar-United States")).toBeInTheDocument();
    });
  });

  it("renders error state when API fails", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    getRequestsApplicationAnalytics.mockRejectedValue(
      new Error("Network down"),
    );
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(
        screen.getAllByText(/Error: Network down/i).length,
      ).toBeGreaterThan(0);
    });

    errSpy.mockRestore();
  });

  it("uses fallback error message when error has no message", async () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    getRequestsApplicationAnalytics.mockRejectedValue({});
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(
        screen.getAllByText(/Error: Failed to fetch analytics data/i).length,
      ).toBeGreaterThan(0);
    });

    errSpy.mockRestore();
  });

  it("handles non-array response blocks gracefully", async () => {
    getRequestsApplicationAnalytics.mockResolvedValue({
      statusCode: 200,
      body: {
        request_volume_1_year: null,
        "requests_by_category_region 1 year": { not: "an array" },
      },
    });

    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.queryByText("#1")).not.toBeInTheDocument();
    });
  });

  it("handles direct response shape without body wrapper", async () => {
    const directResponse = {
      request_volume_1_year: [{ date: "2026-06-01T00:00:00", count: 7 }],
      "requests_by_category_region 1 year": [
        { category: "GENERAL_CATEGORY", country: "USA", count: 2 },
      ],
    };

    getRequestsApplicationAnalytics.mockResolvedValue(directResponse);
    render(<RequestsAnalytics />);

    await waitFor(() => {
      expect(screen.getAllByText(/United States/i).length).toBeGreaterThan(0);
    });
  });
});
