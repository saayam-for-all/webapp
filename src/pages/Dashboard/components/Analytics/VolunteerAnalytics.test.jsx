import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import VolunteerAnalytics from "./VolunteerAnalytics";

jest.mock("../../../../services/analyticsServices", () => ({
  getVolunteerApplicationAnalytics: jest.fn(),
}));

const mockIsoAlpha3ToName = jest.fn((code) => {
  const map = { USA: "United States", AFG: "Afghanistan", IND: "India" };
  return map[code] || code;
});

jest.mock("../../../../utils/isoCountryNames", () => ({
  isoAlpha3ToName: (...args) => mockIsoAlpha3ToName(...args),
}));

// Silence recharts ResizeObserver warnings in jsdom
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { getVolunteerApplicationAnalytics } from "../../../../services/analyticsServices";

const MOCK_API_RESPONSE = {
  "7D": {
    volunteer_activity_trend: {
      new_volunteers: [],
      active_volunteers: [],
      total_volunteers: [],
    },
    volunteers_by_location: [],
  },
  "30D": {
    volunteer_activity_trend: {
      new_volunteers: [],
      active_volunteers: [],
      total_volunteers: [],
    },
    volunteers_by_location: [],
  },
  "1Y": {
    volunteer_activity_trend: {
      new_volunteers: [{ period: "2026-01", count: 2 }],
      active_volunteers: [{ period: "2026-01", count: 2 }],
      total_volunteers: [
        { period: "2026-01", count: 2 },
        { period: "2026-02", count: 5 },
      ],
    },
    volunteers_by_location: [
      { country: "USA", count: 7 },
      { country: "AFG", count: 2 },
    ],
  },
  All: {
    volunteer_activity_trend: {
      new_volunteers: [
        { period: "2025-01", count: 3 },
        { period: "2025-02", count: 5 },
      ],
      active_volunteers: [
        { period: "2025-01", count: 2 },
        { period: "2025-02", count: 4 },
      ],
      total_volunteers: [
        { period: "2025-01", count: 3 },
        { period: "2025-02", count: 8 },
      ],
    },
    volunteers_by_location: [
      { country: "USA", count: 10 },
      { country: "IND", count: 4 },
    ],
  },
  Custom: {
    volunteer_activity_trend: {
      new_volunteers: [],
      active_volunteers: [],
      total_volunteers: [],
    },
    volunteers_by_location: [],
  },
};

describe("VolunteerAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsoAlpha3ToName.mockClear();
  });

  it("shows loading spinner while fetching", () => {
    // Never resolves during this test
    getVolunteerApplicationAnalytics.mockReturnValue(new Promise(() => {}));
    render(<VolunteerAnalytics />);
    expect(screen.getByText(/Loading volunteer data/i)).toBeInTheDocument();
  });

  it("renders both chart containers after successful API fetch", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Volunteer Activity Trend")).toBeInTheDocument();
      expect(screen.getByText("Volunteers by Location")).toBeInTheDocument();
    });
  });

  it("calls API with empty payload on mount", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(getVolunteerApplicationAnalytics).toHaveBeenCalledWith({});
    });
  });

  it("resolves ISO alpha-3 country codes to names via isoAlpha3ToName", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading volunteer data/i),
      ).not.toBeInTheDocument();
    });

    // After render, isoAlpha3ToName should have been called with codes from the API
    expect(mockIsoAlpha3ToName).toHaveBeenCalledWith("USA");
    expect(mockIsoAlpha3ToName).toHaveBeenCalledWith("IND");
  });

  it("shows fallback error banner and fallback data when API fails", async () => {
    getVolunteerApplicationAnalytics.mockRejectedValue(
      new Error("Network error"),
    );
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText(/Could not load data/i)).toBeInTheDocument();
    });
  });

  it("renders time range buttons for trend chart", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      const buttons = screen.getAllByText("7D");
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders independent Period selector for location chart", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Period:")).toBeInTheDocument();
    });
  });

  it("clicking a trend time range button switches the active range", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading volunteer data/i),
      ).not.toBeInTheDocument();
    });

    // "7D" appears twice (trend + location); click the first one (trend)
    const sevenDButtons = screen.getAllByText("7D");
    fireEvent.click(sevenDButtons[0]);

    // The clicked button should now have the active class
    expect(sevenDButtons[0]).toHaveClass("bg-blue-500");
  });

  it("clicking location Period button switches location range", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Period:")).toBeInTheDocument();
    });

    // "30D" appears twice; click the second (location chart)
    const thirtyDButtons = screen.getAllByText("30D");
    fireEvent.click(thirtyDButtons[1]);

    expect(thirtyDButtons[1]).toHaveClass("bg-blue-500");
  });

  it("shows custom date inputs for trend chart when Custom is selected", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading volunteer data/i),
      ).not.toBeInTheDocument();
    });

    // Click the first "Custom" button (trend chart)
    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[0]);

    // Two date inputs appear (start + end) for the trend chart
    const dateInputs = screen.getAllByDisplayValue("");
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("shows custom date inputs for location chart when Custom is selected", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Period:")).toBeInTheDocument();
    });

    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[1]);

    const dateInputs = screen.getAllByDisplayValue("");
    expect(dateInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("triggers custom trend fetch when both dates are filled", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading volunteer data/i),
      ).not.toBeInTheDocument();
    });

    // Select Custom on trend chart
    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[0]);

    // Fill both date inputs (trend chart — first two date inputs)
    const dateInputs = screen.getAllByDisplayValue("");
    await act(async () => {
      fireEvent.change(dateInputs[0], { target: { value: "2026-05-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2026-05-31" } });
    });

    await waitFor(() => {
      expect(getVolunteerApplicationAnalytics).toHaveBeenCalledWith({
        start_date: "2026-05-01",
        end_date: "2026-05-31",
      });
    });
  });

  it("triggers custom location fetch with location_start_date/location_end_date keys", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Period:")).toBeInTheDocument();
    });

    // Select Custom on location chart
    const customButtons = screen.getAllByText("Custom");
    fireEvent.click(customButtons[1]);

    const dateInputs = screen.getAllByDisplayValue("");
    await act(async () => {
      fireEvent.change(dateInputs[0], { target: { value: "2026-06-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2026-06-30" } });
    });

    await waitFor(() => {
      expect(getVolunteerApplicationAnalytics).toHaveBeenCalledWith({
        location_start_date: "2026-06-01",
        location_end_date: "2026-06-30",
      });
    });
  });

  it("shows no data message when API window returns empty arrays", async () => {
    // 7D window has empty arrays — should show empty state, not mock data
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading volunteer data/i),
      ).not.toBeInTheDocument();
    });

    const sevenDButtons = screen.getAllByText("7D");
    fireEvent.click(sevenDButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText("No data available for the selected period."),
      ).toBeInTheDocument();
    });
  });

  it("shows no data message for location chart when API window is empty", async () => {
    getVolunteerApplicationAnalytics.mockResolvedValue(MOCK_API_RESPONSE);
    render(<VolunteerAnalytics />);

    await waitFor(() => {
      expect(screen.getByText("Period:")).toBeInTheDocument();
    });

    const sevenDButtons = screen.getAllByText("7D");
    fireEvent.click(sevenDButtons[1]);

    await waitFor(() => {
      const emptyMessages = screen.getAllByText(
        "No data available for the selected period.",
      );
      expect(emptyMessages.length).toBeGreaterThanOrEqual(1);
    });
  });
});
