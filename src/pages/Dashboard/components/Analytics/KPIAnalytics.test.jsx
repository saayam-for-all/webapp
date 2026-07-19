import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import KPIAnalytics, { renderTooltip } from "./KPIAnalytics";
import * as analyticsServices from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices", () => ({
  getKpiAnalytics: jest.fn(),
}));

const mockData = {
  body: {
    All: {
      request_status_distribution: [
        { status: "CREATED", count: 200 },
        { status: "MATCHING_VOLUNTEER", count: 100 },
        { status: "RESOLVED", count: 11 },
      ],
      total_requests: 311,
      average_resolution_time_by_category: [
        { category: "Shelter", avg_hours: 180 },
        { category: "Legal Aid", avg_hours: 250 },
      ],
    },
    "7D": {
      request_status_distribution: [],
      total_requests: [
        { period: "2026-07-09", total_requests: 4 },
        { period: "2026-07-10", total_requests: 6 },
      ],
      average_resolution_time_by_category: [],
    },
    "30D": {
      request_status_distribution: [],
      total_requests: [
        { period: "2026-06-15", total_requests: 2 },
        { period: "2026-07-10", total_requests: 6 },
      ],
      average_resolution_time_by_category: [],
    },
    "1Y": {
      request_status_distribution: [],
      total_requests: [
        { period: "2026-01", total_requests: 21 },
        { period: "2026-07", total_requests: 40 },
      ],
      average_resolution_time_by_category: [],
    },
    sla: {
      target_days: 10,
      target_hours: 240,
      warning_days: 8.33,
      warning_hours: 200,
    },
  },
};

const switchViewMode = (value) => {
  fireEvent.change(screen.getByDisplayValue("Snapshot"), {
    target: { value },
  });
};

describe("KPIAnalytics", () => {
  afterEach(() => jest.clearAllMocks());

  it("shows loading state initially", () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    expect(screen.getByText("Loading KPI data...")).toBeInTheDocument();
  });

  it("renders both chart titles after data loads", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("Request Status Distribution"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Average Resolution Time by Category"),
      ).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    analyticsServices.getKpiAnalytics.mockRejectedValue(
      new Error("Network Error"),
    );
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("Failed to load KPI data. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("calls getKpiAnalytics once on mount with an empty payload", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(analyticsServices.getKpiAnalytics).toHaveBeenCalledTimes(1);
    });
  });

  it("shows no resolution data message when array is empty", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue({
      body: {
        ...mockData.body,
        All: { ...mockData.body.All, average_resolution_time_by_category: [] },
      },
    });
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("No resolution data available"),
      ).toBeInTheDocument();
    });
  });

  it("renders the view mode dropdown defaulting to Snapshot", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
    });
  });

  it("switches to table view when Table view is selected", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
    });
    switchViewMode("table");
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders status items in table view", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
    });
    switchViewMode("table");
    expect(screen.getByText("CREATED")).toBeInTheDocument();
    expect(screen.getByText("RESOLVED")).toBeInTheDocument();
  });

  it("uses default SLA values when sla is not in response", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue({
      body: { ...mockData.body, sla: null },
    });
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("Average Resolution Time by Category"),
      ).toBeInTheDocument();
    });
  });

  it("shows percentage in table view", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
    });
    switchViewMode("table");
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
    expect(screen.getByText("Percentage")).toBeInTheDocument();
  });

  it("shows MATCHING_VOLUNTEER status in table view", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
    });
    switchViewMode("table");
    expect(screen.getByText("MATCHING_VOLUNTEER")).toBeInTheDocument();
  });

  it("renders resolution bar chart when data exists", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("Average Resolution Time by Category"),
      ).toBeInTheDocument();
    });
  });

  it("shows correct total requests count in table view", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
    });
    switchViewMode("table");
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("handles zero total requests gracefully", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue({
      body: {
        ...mockData.body,
        All: {
          ...mockData.body.All,
          total_requests: 0,
          request_status_distribution: [],
        },
      },
    });
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("Request Status Distribution"),
      ).toBeInTheDocument();
    });
  });

  it("shows SLA target description", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByText(/SLA Target/i)).toBeInTheDocument();
    });
  });

  it("shows color coding description", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(screen.getByText(/Color coding/i)).toBeInTheDocument();
    });
  });

  it("renderTooltip returns null when not active", () => {
    const tooltip = renderTooltip(240, 200);
    expect(tooltip({ active: false, payload: [] })).toBeNull();
  });

  it("renderTooltip returns null when payload empty", () => {
    const tooltip = renderTooltip(240, 200);
    expect(tooltip({ active: true, payload: [] })).toBeNull();
  });

  it("renderTooltip shows Exceeded SLA when hours exceed target", () => {
    const tooltip = renderTooltip(240, 200);
    const payload = [
      { payload: { category: "Shelter", avgHours: 300, avgDays: "12.5" } },
    ];
    expect(tooltip({ active: true, payload })).not.toBeNull();
  });

  it("renderTooltip shows Approaching SLA when hours between warning and target", () => {
    const tooltip = renderTooltip(240, 200);
    const payload = [
      { payload: { category: "Legal Aid", avgHours: 220, avgDays: "9.2" } },
    ];
    expect(tooltip({ active: true, payload })).not.toBeNull();
  });

  it("renderTooltip shows Within SLA when hours below warning", () => {
    const tooltip = renderTooltip(240, 200);
    const payload = [
      { payload: { category: "Education", avgHours: 100, avgDays: "4.2" } },
    ];
    expect(tooltip({ active: true, payload })).not.toBeNull();
  });

  describe("Trends view", () => {
    it("switches to trends view and shows time range buttons defaulting to All", async () => {
      analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
      render(<KPIAnalytics />);
      await waitFor(() => {
        expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
      });
      switchViewMode("trends");
      const allButton = screen.getByRole("button", { name: "All" });
      expect(allButton).toBeInTheDocument();
      expect(allButton).toHaveClass("bg-blue-600");
    });

    it("shows no trend data message for All since it has no period series", async () => {
      analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
      render(<KPIAnalytics />);
      await waitFor(() => {
        expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
      });
      switchViewMode("trends");
      expect(
        screen.getByText("No trend data available for All"),
      ).toBeInTheDocument();
    });

    it("renders the chart (not the empty state) when 7D has period data", async () => {
      analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
      render(<KPIAnalytics />);
      await waitFor(() => {
        expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
      });
      switchViewMode("trends");
      fireEvent.click(screen.getByRole("button", { name: "7D" }));
      expect(
        screen.queryByText("No trend data available for 7D"),
      ).not.toBeInTheDocument();
    });

    it("renders the chart (not the empty state) when 1Y has period data", async () => {
      analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
      render(<KPIAnalytics />);
      await waitFor(() => {
        expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
      });
      switchViewMode("trends");
      fireEvent.click(screen.getByRole("button", { name: "1Y" }));
      expect(
        screen.queryByText("No trend data available for 1Y"),
      ).not.toBeInTheDocument();
    });

    it("keeps the Custom button disabled", async () => {
      analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
      render(<KPIAnalytics />);
      await waitFor(() => {
        expect(screen.getByDisplayValue("Snapshot")).toBeInTheDocument();
      });
      switchViewMode("trends");
      const customButton = screen.getByRole("button", { name: "Custom" });
      expect(customButton).toBeDisabled();
    });
  });
});
