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
  Tooltip: ({ formatter }) => {
    if (formatter) formatter(5);
    return null;
  },
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock("react-simple-maps", () => ({
  ComposableMap: ({ children }) => <div>{children}</div>,
  Geographies: ({ children }) =>
    children({
      geographies: [{ rsmKey: "geo-1", properties: { name: "Afghanistan" } }],
    }),
  Geography: ({ onMouseEnter, onMouseLeave }) => (
    <div
      data-testid="geography"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  ),
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
    "Custom date range beneficiaries": [
      { Date: "2025-12-10T00:00:00", Count: 7 },
      { Date: "2025-12-20T00:00:00", Count: 3 },
      { Date: "2026-01-05T00:00:00", Count: 9 },
      { Date: "2026-02-15T00:00:00", Count: 4 },
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

  it("renders time range toggle buttons after data loads", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(screen.getByText("7D")).toBeInTheDocument();
      expect(screen.getByText("30D")).toBeInTheDocument();
      expect(screen.getByText("1Y")).toBeInTheDocument();
      expect(screen.getByText("All")).toBeInTheDocument();
    });
  });

  it("activates 7D button when clicked", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("7D"));
    fireEvent.click(screen.getByText("7D"));
    expect(screen.getByText("7D")).toHaveClass("bg-blue-500");
  });

  it("activates 30D button when clicked", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("30D"));
    fireEvent.click(screen.getByText("30D"));
    expect(screen.getByText("30D")).toHaveClass("bg-blue-500");
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("auto-fetches when both custom dates are filled", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Custom"));
    fireEvent.click(screen.getByText("Custom"));
    const inputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: "2026-05-01" } });
    fireEvent.change(inputs[1], { target: { value: "2026-05-31" } });
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          beneficiaries_start_date: "2026-05-01",
          beneficiaries_end_date: "2026-05-31",
        }),
      );
    });
  });

  it("refetches the full history when switching from custom back to All", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Custom"));

    // Pick a custom range first
    fireEvent.click(screen.getByText("Custom"));
    const inputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: "2026-05-01" } });
    fireEvent.change(inputs[1], { target: { value: "2026-05-31" } });
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ beneficiaries_start_date: "2026-05-01" }),
      );
    });

    // Switching back to All requests the full-history range again
    fireEvent.click(screen.getByText("All"));
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ beneficiaries_start_date: "2000-01-01" }),
      );
    });
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

  it("toggles country view between map and bar", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Map"));
    fireEvent.click(screen.getAllByText("Map")[0]);
    expect(screen.getAllByText("Map")[0]).toHaveClass("bg-blue-500");
    fireEvent.click(screen.getAllByText("Bar")[0]);
    expect(screen.getAllByText("Bar")[0]).toHaveClass("bg-blue-500");
  });

  it("fires geography mouseEnter and mouseLeave handlers in map view", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Map"));
    fireEvent.click(screen.getAllByText("Map")[0]);
    const geo = await waitFor(() => screen.getByTestId("geography"));
    fireEvent.mouseEnter(geo);
    fireEvent.mouseLeave(geo);
  });

  it("toggles Top 10 Only checkbox in country bar chart", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByLabelText(/top 10 only/i));
    const checkbox = screen.getByLabelText(/top 10 only/i);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
