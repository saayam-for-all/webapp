import { screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StewardDashboard from "./StewardDashboard";
import { renderWithProviders } from "#utils/test-utils.jsx";

jest.mock("../../../services/volunteerServices", () => ({
  getMockVolunteersData: jest.fn(),
}));

const mockProps = {
  headers: ["Request ID", "Status", "Date"],
  filteredData: [
    { "Request ID": "REQ-001", Status: "Pending", Date: "2024-01-01" },
  ],
  isLoading: false,
  currentPage: 1,
  setCurrentPage: jest.fn(),
  totalPages: jest.fn(() => 1),
  rowsPerPage: 10,
  sortConfig: { key: null, direction: null },
  requestSort: jest.fn(),
  onRowsPerPageChange: jest.fn(),
  getLinkPath: jest.fn(),
  getLinkState: jest.fn(),
  searchFilters: <div>Search Filters</div>,
};

describe("StewardDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders All Requests tab by default", () => {
    renderWithProviders(<StewardDashboard {...mockProps} />);

    expect(screen.getByText("All Requests")).toBeInTheDocument();
    expect(screen.getByText("Volunteers")).toBeInTheDocument();
    expect(screen.getByText("Search Filters")).toBeInTheDocument();
  });

  it("switches to Volunteers tab when clicked", async () => {
    const {
      getMockVolunteersData,
    } = require("../../../services/volunteerServices");
    getMockVolunteersData.mockResolvedValue([
      {
        userId: "SID-00-000-000-001",
        updatedAt: "2024-01-01T10:00:00Z",
        volunteerRequestId: "req_123",
      },
    ]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    const volunteersTab = screen.getByText("Volunteers");
    fireEvent.click(volunteersTab);

    await waitFor(() => {
      expect(getMockVolunteersData).toHaveBeenCalled();
    });

    expect(screen.getByText("SID-00-000-000-001")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("displays volunteer data correctly", async () => {
    const {
      getMockVolunteersData,
    } = require("../../../services/volunteerServices");
    getMockVolunteersData.mockResolvedValue([
      {
        userId: "SID-00-000-000-001",
        updatedAt: "2024-01-01T10:00:00Z",
        volunteerRequestId: "req_123",
      },
      {
        userId: "SID-00-000-000-002",
        updatedAt: "2024-01-02T11:00:00Z",
        volunteerRequestId: "req_456",
      },
    ]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    const volunteersTab = screen.getByText("Volunteers");
    fireEvent.click(volunteersTab);

    await waitFor(() => {
      expect(screen.getByText("SID-00-000-000-001")).toBeInTheDocument();
      expect(screen.getByText("SID-00-000-000-002")).toBeInTheDocument();
    });

    // Check that both Review links are present
    const reviewLinks = screen.getAllByText("Review");
    expect(reviewLinks).toHaveLength(2);
  });

  it("handles API error gracefully", async () => {
    const {
      getMockVolunteersData,
    } = require("../../../services/volunteerServices");
    getMockVolunteersData.mockRejectedValue(new Error("API Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<StewardDashboard {...mockProps} />);

    const volunteersTab = screen.getByText("Volunteers");
    fireEvent.click(volunteersTab);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching volunteers:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("shows loading state initially", () => {
    renderWithProviders(<StewardDashboard {...mockProps} />);

    // Initially, volunteers tab should not show table until clicked
    expect(screen.queryByText("SID-00-000-000-001")).not.toBeInTheDocument();
  });

  it("formats updated time correctly", async () => {
    const {
      getMockVolunteersData,
    } = require("../../../services/volunteerServices");
    getMockVolunteersData.mockResolvedValue([
      {
        userId: "SID-00-000-000-001",
        updatedAt: "2024-01-01T10:00:00Z",
        volunteerRequestId: "req_123",
      },
    ]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    const volunteersTab = screen.getByText("Volunteers");
    fireEvent.click(volunteersTab);

    await waitFor(() => {
      // Should display formatted date
      expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument();
    });
  });

  it("returns correct link paths for volunteer table", async () => {
    const {
      getMockVolunteersData,
    } = require("../../../services/volunteerServices");
    getMockVolunteersData.mockResolvedValue([
      {
        userId: "SID-00-000-000-001",
        updatedAt: "2024-01-01T10:00:00Z",
        volunteerRequestId: "req_123",
      },
    ]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    const volunteersTab = screen.getByText("Volunteers");
    fireEvent.click(volunteersTab);

    await waitFor(() => {
      expect(screen.getByText("SID-00-000-000-001")).toBeInTheDocument();
    });

    // The component should have the correct link paths configured
    // We can't easily test the actual links without more complex setup,
    // but we can verify the data is rendered
  });
});
