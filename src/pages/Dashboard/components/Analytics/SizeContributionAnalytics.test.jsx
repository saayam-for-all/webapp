import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SizeContributionAnalytics from "./SizeContributionAnalytics";
import { getSizeContributionAnalytics } from "../../../../services/analyticsServices";

jest.mock("../../../../services/analyticsServices", () => ({
  getSizeContributionAnalytics: jest.fn(),
}));

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mirrors the real v1/ml/size_contribution_analytics response shape.
const MOCK = {
  "7D": { organizations_by_size: [], collaborator_vs_contributor: [] },
  "30D": { organizations_by_size: [], collaborator_vs_contributor: [] },
  "1Y": {
    organizations_by_size: [
      { size: "small", count: 76 },
      { size: "medium", count: 96 },
      { size: "large", count: 68 },
    ],
    collaborator_vs_contributor: [
      { type: "Collaborator", count: 75, percentage: 31.2 },
      { type: "Contributor", count: 140, percentage: 58.3 },
    ],
  },
  All: {
    organizations_by_size: [
      { size: "large", count: 110 },
      { size: "small", count: 122 },
      { size: "medium", count: 168 },
    ],
    collaborator_vs_contributor: [
      { type: "Collaborator", count: 125, percentage: 31.2 },
      { type: "Contributor", count: 224, percentage: 56.0 },
    ],
  },
};

const CUSTOM_MOCK = {
  Custom: {
    organizations_by_size: [{ size: "small", count: 7 }],
    collaborator_vs_contributor: [
      { type: "Collaborator", count: 3, percentage: 42.9 },
    ],
  },
};

describe("SizeContributionAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSizeContributionAnalytics.mockResolvedValue(MOCK);
  });

  it("fetches with {} on mount and renders both chart titles", async () => {
    render(<SizeContributionAnalytics />);
    expect(
      screen.getAllByText(/Loading organization data/i).length,
    ).toBeGreaterThan(0);
    await waitFor(() =>
      expect(getSizeContributionAnalytics).toHaveBeenCalledWith({}),
    );
    expect(screen.getByText("Organizations by Size")).toBeInTheDocument();
    expect(screen.getByText("Collaborator vs Contributor")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("Total Orgs")).toBeInTheDocument(),
    );
    // Total orgs = sum of size bands (122 + 168 + 110)
    expect(screen.getByText("400")).toBeInTheDocument();
    // Legend uses the API's own percentages
    expect(screen.getByText("Collaborator")).toBeInTheDocument();
    expect(screen.getByText("125")).toBeInTheDocument();
    expect(screen.getByText("(31.2%)")).toBeInTheDocument();
    expect(screen.getByText("Contributor")).toBeInTheDocument();
    expect(screen.getByText("(56.0%)")).toBeInTheDocument();
  });

  it("updates the total when switching preset periods", async () => {
    render(<SizeContributionAnalytics />);
    await waitFor(() => screen.getByText("400"));
    fireEvent.click(screen.getByText("1 Year"));
    // 76 + 96 + 68
    expect(screen.getByText("240")).toBeInTheDocument();
  });

  it("shows empty state for a period with no data", async () => {
    render(<SizeContributionAnalytics />);
    await waitFor(() => screen.getByText("Total Orgs"));
    fireEvent.click(screen.getByText("7 Days"));
    expect(
      screen.getAllByText("No data available for the selected period."),
    ).toHaveLength(2);
  });

  it("shows an error banner when the API fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    getSizeContributionAnalytics.mockRejectedValue(new Error("boom"));
    render(<SizeContributionAnalytics />);
    expect(await screen.findByText(/Could not load data/i)).toBeInTheDocument();
    console.error.mockRestore();
  });

  it("fetches custom range only once both dates are set", async () => {
    render(<SizeContributionAnalytics />);
    await waitFor(() => screen.getByText("Total Orgs"));
    fireEvent.click(screen.getByText("Custom"));
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-01-01" },
    });
    expect(getSizeContributionAnalytics).toHaveBeenCalledTimes(1);
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-03-31" },
    });
    await waitFor(() =>
      expect(getSizeContributionAnalytics).toHaveBeenCalledWith({
        start_date: "2026-01-01",
        end_date: "2026-03-31",
      }),
    );
  });

  it("keeps preset data intact after loading a custom range", async () => {
    getSizeContributionAnalytics
      .mockResolvedValueOnce(MOCK)
      .mockResolvedValueOnce(CUSTOM_MOCK);
    render(<SizeContributionAnalytics />);
    await waitFor(() => screen.getByText("400"));

    fireEvent.click(screen.getByText("Custom"));
    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-01-01" },
    });
    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-03-31" },
    });
    expect(await screen.findByText("7")).toBeInTheDocument();

    fireEvent.click(screen.getByText("All"));
    expect(screen.getByText("400")).toBeInTheDocument();
  });
});
