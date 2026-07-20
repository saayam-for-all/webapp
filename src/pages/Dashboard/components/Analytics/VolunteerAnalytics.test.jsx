import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
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
      expect(screen.getByText(/Could not load live data/i)).toBeInTheDocument();
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
});
