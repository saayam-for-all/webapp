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
    "Beneficiaries count 7 days": [
      { Date: "2026-06-16T00:00:00", Count: 1 },
      { Date: "2026-06-17T00:00:00", Count: 2 },
    ],
    "Beneficiaries count 30 days": [
      { Date: "2026-05-27T00:00:00", Count: 1 },
      { Date: "2026-05-28T00:00:00", Count: 4 },
    ],
    "Beneficiaries count 1 year": [
      { Date: "2025-12-15T00:00:00", Count: 3 },
      { Date: "2026-01-05T00:00:00", Count: 1 },
    ],
    "Beneficiaries count all": [
      { Date: "2025-12-01T00:00:00", Count: 48 },
      { Date: "2026-01-01T00:00:00", Count: 21 },
    ],
    "Beneficiaries count custom date range": [],
    // Country data: array of { country: alphaCode, Count: N, rank: N }
    "Beneficiaries count by country 7 days": [
      { country: "AFG", Count: 3, rank: 1 },
      { country: "USA", Count: 3, rank: 2 },
    ],
    "Beneficiaries count by country 30 days": [
      { country: "AFG", Count: 2, rank: 1 },
      { country: "USA", Count: 1, rank: 2 },
    ],
    "Beneficiaries count by country 1 year": [
      { country: "AFG", Count: 47, rank: 1 },
      { country: "USA", Count: 3, rank: 2 },
    ],
    "Beneficiaries count by country all": [
      { country: "AFG", Count: 47, rank: 1 },
      { country: "USA", Count: 3, rank: 2 },
    ],
    "Beneficiaries count by country custom date range": [
      { country: "USA", Count: 32, rank: 1 },
      { country: "AFG", Count: 16, rank: 2 },
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
    expect(screen.getAllByText(/loading beneficiaries data/i)).toHaveLength(2);
  });

  it("calls API with empty payload on mount (All/7D/30D/1Y all use {})", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith({});
    });
  });

  it("renders time range toggle buttons after data loads", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(screen.getAllByText("7D")[0]).toBeInTheDocument();
      expect(screen.getAllByText("30D")[0]).toBeInTheDocument();
      expect(screen.getAllByText("1Y")[0]).toBeInTheDocument();
      expect(screen.getAllByText("All")[0]).toBeInTheDocument();
    });
  });

  it("switches to empty payload when 7D is clicked", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("7D")[0]);
    fireEvent.click(screen.getAllByText("7D")[0]);
    expect(screen.getAllByText("7D")[0]).toHaveClass("bg-blue-500");
    // 7D/30D/1Y all send {} — verify it was called with an empty payload
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith({});
    });
  });

  it("activates 30D button when clicked", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("30D")[0]);
    fireEvent.click(screen.getAllByText("30D")[0]);
    expect(screen.getAllByText("30D")[0]).toHaveClass("bg-blue-500");
    // Clicking 30D triggers a new fetch; wait for the chart to reappear
    await waitFor(() =>
      expect(screen.getByTestId("line-chart")).toBeInTheDocument(),
    );
  });

  it("shows group_by dropdown when Custom is selected", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Custom")[0]);
    fireEvent.click(screen.getAllByText("Custom")[0]);
    expect(screen.getByDisplayValue("Day")).toBeInTheDocument();
  });

  it("auto-fetches with custom payload when both dates and group_by are set", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Custom")[0]);
    fireEvent.click(screen.getAllByText("Custom")[0]);

    const inputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: "2026-05-01" } });
    fireEvent.change(inputs[1], { target: { value: "2026-05-31" } });

    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_start_date: "2026-05-01",
          custom_end_date: "2026-05-31",
          custom_group_by: "day",
        }),
      );
    });
  });

  it("changes group_by in the custom payload when dropdown changes", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Custom")[0]);
    fireEvent.click(screen.getAllByText("Custom")[0]);

    const inputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: "2025-01-01" } });
    fireEvent.change(inputs[1], { target: { value: "2026-05-31" } });

    fireEvent.change(screen.getByDisplayValue("Day"), {
      target: { value: "month" },
    });

    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ custom_group_by: "month" }),
      );
    });
  });

  it("refetches with empty payload when switching back to All after custom", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getAllByText("Custom")[0]);

    fireEvent.click(screen.getAllByText("Custom")[0]);
    const inputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: "2026-05-01" } });
    fireEvent.change(inputs[1], { target: { value: "2026-05-31" } });
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ custom_start_date: "2026-05-01" }),
      );
    });

    fireEvent.click(screen.getAllByText("All")[0]);
    // "All" returns to {} payload; chart should reappear with "All" data
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith({});
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  it("shows an error message when API call fails", async () => {
    getBeneficiariesTrendAnalysis.mockRejectedValue(new Error("Network error"));
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(
        screen.getByText(/could not load data\. please try again later/i),
      ).toBeInTheDocument();
    });
  });

  it("shows no data message when trend API window is empty", async () => {
    const emptyResponse = {
      statusCode: 200,
      body: {
        "Beneficiaries count all": [],
        "Beneficiaries count by country all": [],
      },
    };
    getBeneficiariesTrendAnalysis.mockResolvedValue(emptyResponse);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(
        screen.getAllByText(/no data available for the selected period/i)
          .length,
      ).toBeGreaterThan(0);
    });
  });

  it("renders country bar chart with ISO alpha-3 codes resolved to country names", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    // isoAlpha3ToName resolves AFG → "Afghanistan", USA → "United States"
    await waitFor(() => {
      expect(screen.getByText(/Afghanistan/)).toBeInTheDocument();
      expect(screen.getByText(/United States/)).toBeInTheDocument();
    });
  });

  it("renders country time range selector with Period label", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(screen.getByText("Period:")).toBeInTheDocument();
    });
  });

  it("changes country time range independently of trend time range", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Period:"));

    // Both trend and country "All" buttons exist; click the country-section 7D
    const sevenDButtons = screen.getAllByText("7D");
    fireEvent.click(sevenDButtons[1]); // country section 7D
    expect(sevenDButtons[1]).toHaveClass("bg-blue-500");

    // Trend 7D should remain inactive (trend is still "All")
    expect(sevenDButtons[0]).not.toHaveClass("bg-blue-500");
  });

  it("shows country custom date inputs when country Custom is selected", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Period:"));

    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[customButtons.length - 1]); // country Custom button

    const dateInputs = document.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
    fireEvent.change(dateInputs[dateInputs.length - 2], {
      target: { value: "2026-01-01" },
    });
    fireEvent.change(dateInputs[dateInputs.length - 1], {
      target: { value: "2026-06-01" },
    });
    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_start_date: "2026-01-01",
          custom_end_date: "2026-06-01",
        }),
      );
    });
  });

  it("shows group_by dropdown when country Custom is selected", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Period:"));

    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[customButtons.length - 1]); // country Custom button

    // Trend's group_by dropdown is not shown (trend is still "All") — only country's
    expect(screen.getAllByDisplayValue("Month")).toHaveLength(1);
  });

  it("sends country custom_group_by in the fetch payload", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Period:"));

    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[customButtons.length - 1]); // country Custom button

    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[dateInputs.length - 2], {
      target: { value: "2026-01-01" },
    });
    fireEvent.change(dateInputs[dateInputs.length - 1], {
      target: { value: "2026-06-01" },
    });

    fireEvent.change(screen.getByDisplayValue("Month"), {
      target: { value: "day" },
    });

    await waitFor(() => {
      expect(getBeneficiariesTrendAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          custom_start_date: "2026-01-01",
          custom_end_date: "2026-06-01",
          custom_group_by: "day",
        }),
      );
    });
  });

  it("keeps showing prior country data while custom dates are being entered", async () => {
    getBeneficiariesTrendAnalysis.mockResolvedValue(MOCK_API_RESPONSE);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText(/Afghanistan/));

    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[customButtons.length - 1]); // country Custom button, no dates yet

    // Should still show the previously committed ("All") country data, not an
    // empty state, until both custom dates are filled in.
    expect(screen.getByText(/Afghanistan/)).toBeInTheDocument();
    expect(
      screen.queryByText(/no data available for the selected period/i),
    ).not.toBeInTheDocument();
  });

  it("handles country API fetch error gracefully", async () => {
    getBeneficiariesTrendAnalysis
      .mockResolvedValueOnce(MOCK_API_RESPONSE) // initial {} fetch
      .mockRejectedValue(new Error("Country fetch failed")); // separate country fetch fails
    render(<BeneficiariesAnalytics />);
    await waitFor(() => screen.getByText("Period:"));

    // Country custom range sends a different payload than trend {} → triggers separate fetch
    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[customButtons.length - 1]); // country Custom button
    const dateInputs = document.querySelectorAll('input[type="date"]');
    fireEvent.change(dateInputs[dateInputs.length - 2], {
      target: { value: "2026-01-01" },
    });
    fireEvent.change(dateInputs[dateInputs.length - 1], {
      target: { value: "2026-06-01" },
    });

    // After the separate fetch fails, component falls back to custom key in main apiData
    await waitFor(() => {
      expect(screen.getByText(/United States/)).toBeInTheDocument();
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

  it("shows no data message when country key is missing from API response", async () => {
    // Response has no country keys → parseCountryData(undefined) hits the null guard
    const sparseResponse = {
      statusCode: 200,
      body: {
        "Beneficiaries count all": [{ Date: "2026-01-01T00:00:00", Count: 5 }],
      },
    };
    getBeneficiariesTrendAnalysis.mockResolvedValue(sparseResponse);
    render(<BeneficiariesAnalytics />);
    // Trend chart still renders; country chart shows the empty state instead
    // of falling back to mock data
    await waitFor(() =>
      expect(screen.getByTestId("line-chart")).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/no data available for the selected period/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("handles country entries without Total Count by summing Date entries", async () => {
    // Country entries without a {"Total Count": N} summary — exercises the fallback sum path.
    // Also includes a country with a non-array value to exercise the defensive guard branch.
    const edgeCaseResponse = {
      statusCode: 200,
      body: {
        ...MOCK_API_RESPONSE.body,
        "Beneficiaries count by country all": {
          AFG: [
            { Date: "2026-01-01T00:00:00", Count: 20 },
            { Date: "2026-02-01T00:00:00", Count: 15 },
          ],
          USA: [{ Date: "2026-01-01T00:00:00", Count: 40 }],
          // non-array value exercises the Array.isArray guard → beneficiaryCount 0
          CAN: null,
        },
      },
    };
    getBeneficiariesTrendAnalysis.mockResolvedValue(edgeCaseResponse);
    render(<BeneficiariesAnalytics />);
    await waitFor(() => {
      expect(screen.getByText(/Afghanistan/)).toBeInTheDocument();
      expect(screen.getByText(/United States/)).toBeInTheDocument();
    });
  });
});
