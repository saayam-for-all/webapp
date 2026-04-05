import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import MetricsTicker from "./MetricsTicker";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockFetchResponse = (data) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  });

const mockStats = {
  total_requests: 100,
  requests_resolved: 80,
  total_volunteers: 50,
  total_beneficiaries: 200,
};

beforeEach(() => {
  global.fetch = jest.fn(() => mockFetchResponse(mockStats));
  jest.useFakeTimers();

  // Stub RAF so useCountUp's animation loop doesn't run infinitely in jsdom
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0);
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("MetricsTicker", () => {
  it("renders the four metric labels", () => {
    render(<MetricsTicker />);

    expect(screen.getByText(/TOTAL_REQUESTS/i)).toBeInTheDocument();
    expect(screen.getByText(/REQUESTS_RESOLVED/i)).toBeInTheDocument();
    expect(screen.getByText(/TOTAL_VOLUNTEERS/i)).toBeInTheDocument();
    expect(screen.getByText(/TOTAL_BENEFICIARIES/i)).toBeInTheDocument();
  });

  it("fetches stats on mount", async () => {
    render(<MetricsTicker />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("re-fetches stats every 4 hours", async () => {
    render(<MetricsTicker />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    act(() => {
      jest.advanceTimersByTime(4 * 60 * 60 * 1000);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  it("clears the polling interval on unmount", async () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    const { unmount } = render(<MetricsTicker />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("handles fetch errors without crashing", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<MetricsTicker />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch stats:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
