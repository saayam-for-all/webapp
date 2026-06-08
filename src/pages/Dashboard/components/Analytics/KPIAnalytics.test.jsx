import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import KPIAnalytics from "./KPIAnalytics";
import * as analyticsServices from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices", () => ({
  getKpiAnalytics: jest.fn(),
}));

const mockData = {
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
  sla: {
    target_days: 10,
    target_hours: 240,
    warning_days: 8.33,
    warning_hours: 200,
  },
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

  it("calls getKpiAnalytics once on mount", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue(mockData);
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(analyticsServices.getKpiAnalytics).toHaveBeenCalledTimes(1);
    });
  });

  it("shows no resolution data message when array is empty", async () => {
    analyticsServices.getKpiAnalytics.mockResolvedValue({
      ...mockData,
      average_resolution_time_by_category: [],
    });
    render(<KPIAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText("No resolution data available"),
      ).toBeInTheDocument();
    });
  });
});
