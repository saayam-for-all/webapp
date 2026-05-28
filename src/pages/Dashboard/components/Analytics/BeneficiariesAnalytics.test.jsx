import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BeneficiariesAnalytics from "./BeneficiariesAnalytics";
import { getBeneficiariesTrendAnalysis } from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices");

jest.mock("recharts", () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock("react-simple-maps", () => ({
  ComposableMap: ({ children }) => <div>{children}</div>,
  Geographies: ({ children }) => children({ geographies: [] }),
  Geography: () => null,
  ZoomableGroup: ({ children }) => <div>{children}</div>,
}));

const MOCK_API_RESPONSE = {
  statusCode: 200,
  body: {
    "7 days beneficiaries": [
      { Date: "2026-05-22T00:00:00", Count: 2 },
      { Date: "2026-05-23T00:00:00", Count: 3 },
    ],
    "1 month beneficiaries": [
      { Date: "2026-05-01T00:00:00", Count: 5 },
      { Date: "2026-05-08T00:00:00", Count: 4 },
      { Date: "2026-05-15T00:00:00", Count: 6 },
    ],
    "1 year beneficiaries": [
      { Date: "2026-01-01T00:00:00", Count: 21 },
      { Date: "2026-02-01T00:00:00", Count: 42 },
    ],
    "Country beneficiaries": [
      { country: "UNITED_STATES_OF_AMERICA", Count: 32 },
      { country: "AFGHANISTAN", Count: 16 },
    ],
  },
};

describe("BeneficiariesAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state on mount", () => {
    getBeneficiariesTrendAnalysis.mockReturnValue(new Promise(() => {}));
    render(<BeneficiariesAnalytics />);
    expect(screen.getByText(/loading beneficiaries data/i)).toBeInTheDocument();
  });

  it("calls API with a date range payload on mount", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          beneficiaries_start_date: expect.any(String),
          beneficiaries_end_date: expect.any(String),
          help_requests_start_date: expect.any(String),
          help_requests_end_date: expect.any(String),
        }),
      );
    });
  });

  it("renders granularity toggle buttons after data loads", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(screen.getByText("Daily")).toBeInTheDocument();
      expect(screen.getByText("Weekly")).toBeInTheDocument();
      expect(screen.getByText("Monthly")).toBeInTheDocument();
    });
  });

  it("activates Daily button when clicked", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Daily"));
    fireEvent.click(screen.getByText("Daily"));
    expect(screen.getByText("Daily")).toHaveClass("bg-purple-500");
  });

  it("activates Weekly button when clicked and aggregates data", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Weekly"));
    fireEvent.click(screen.getByText("Weekly"));
    expect(screen.getByText("Weekly")).toHaveClass("bg-purple-500");
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("shows fallback warning when API call fails", async () => {
    getBeneficiariesTrendAnalysis.mockRejectedValue(new Error("Network error"));
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText(/could not load live data from api/i),
      ).toBeInTheDocument();
    });
  });

  it("renders country bar chart with formatted country names", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(screen.getByText(/United States Of America/)).toBeInTheDocument();
      expect(screen.getByText(/Afghanistan/)).toBeInTheDocument();
    });
  });

  it("toggles country view to map when Map button is clicked", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Map"));
    fireEvent.click(screen.getAllByText("Map")[0]);
    expect(screen.getAllByText("Map")[0]).toHaveClass("bg-blue-500");
  });
});
