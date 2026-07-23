import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import StewardDashboard from "./StewardDashboard";
import { renderWithProviders } from "#utils/test-utils.jsx";
import { getMockVolunteersData } from "../../../services/volunteerServices";

jest.mock("../../../services/volunteerServices", () => ({
  getMockVolunteersData: jest.fn(),
}));

jest.mock("../../../common/components/Loading/Loading", () => {
  const MockLoadingIndicator = () => <div data-testid="loading-indicator" />;

  MockLoadingIndicator.displayName = "MockLoadingIndicator";

  return MockLoadingIndicator;
});

const mockProps = {
  headers: ["Request ID", "Status", "Date"],
  filteredData: [
    {
      "Request ID": "REQ-001",
      Status: "Pending",
      Date: "2024-01-01",
    },
  ],
  isLoading: false,
  currentPage: 1,
  setCurrentPage: jest.fn(),
  totalPages: jest.fn(() => 1),
  rowsPerPage: 10,
  sortConfig: {
    key: null,
    direction: null,
  },
  requestSort: jest.fn(),
  onRowsPerPageChange: jest.fn(),
  getLinkPath: jest.fn(),
  getLinkState: jest.fn(),
  searchFilters: <div>Search Filters</div>,
  serverPaginated: false,
  serverTotalRows: 0,
};

const mockVolunteerOne = {
  userId: "SID-00-000-000-001",
  updatedAt: "2024-01-01T10:00:00Z",
  volunteerRequestId: "req_123",
};

const mockVolunteerTwo = {
  userId: "SID-00-000-000-002",
  updatedAt: "2024-01-02T11:00:00Z",
  volunteerRequestId: "req_456",
};

/**
 * React Router Link may be rendered as:
 * - a real <a href="..."> element, or
 * - a mocked <mock-link to="..."> element.
 *
 * This helper supports both cases.
 */
const expectCorrectLinkDestination = (textElement, expectedPath) => {
  const linkElement = textElement.closest("a, mock-link");

  expect(linkElement).not.toBeNull();

  if (linkElement.tagName.toLowerCase() === "a") {
    expect(linkElement).toHaveAttribute("href", expectedPath);
  } else {
    expect(linkElement).toHaveAttribute("to", expectedPath);
  }
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

    expect(getMockVolunteersData).not.toHaveBeenCalled();
  });

  it("switches to Volunteers tab when clicked", async () => {
    getMockVolunteersData.mockResolvedValue([mockVolunteerOne]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    fireEvent.click(screen.getByText("Volunteers"));

    await waitFor(() => {
      expect(getMockVolunteersData).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("SID-00-000-000-001")).toBeInTheDocument();

    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.queryByText("Search Filters")).not.toBeInTheDocument();
  });

  it("displays volunteer data correctly", async () => {
    getMockVolunteersData.mockResolvedValue([
      mockVolunteerOne,
      mockVolunteerTwo,
    ]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    fireEvent.click(screen.getByText("Volunteers"));

    expect(await screen.findByText("SID-00-000-000-001")).toBeInTheDocument();

    expect(screen.getByText("SID-00-000-000-002")).toBeInTheDocument();

    expect(screen.getAllByText("Review")).toHaveLength(2);
  });

  it("handles API error gracefully", async () => {
    const apiError = new Error("API Error");

    getMockVolunteersData.mockRejectedValue(apiError);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderWithProviders(<StewardDashboard {...mockProps} />);

    fireEvent.click(screen.getByText("Volunteers"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching volunteers:",
        apiError,
      );
    });

    expect(screen.queryByText("SID-00-000-000-001")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("shows loading state initially", () => {
    renderWithProviders(<StewardDashboard {...mockProps} />);

    expect(screen.queryByText("SID-00-000-000-001")).not.toBeInTheDocument();

    expect(getMockVolunteersData).not.toHaveBeenCalled();
  });

  it("renders loading indicator while volunteers data is fetching", async () => {
    let resolveVolunteers;

    getMockVolunteersData.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveVolunteers = resolve;
        }),
    );

    renderWithProviders(<StewardDashboard {...mockProps} />);

    fireEvent.click(screen.getByText("Volunteers"));

    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });

    resolveVolunteers([mockVolunteerOne]);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
    });

    expect(await screen.findByText("SID-00-000-000-001")).toBeInTheDocument();
  });

  it("renders loading indicator when isLoading is true on All Requests", () => {
    renderWithProviders(<StewardDashboard {...mockProps} isLoading={true} />);

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("formats updated time correctly", async () => {
    getMockVolunteersData.mockResolvedValue([mockVolunteerOne]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    fireEvent.click(screen.getByText("Volunteers"));

    await screen.findByText("SID-00-000-000-001");

    const expectedFormattedDate = new Date(
      mockVolunteerOne.updatedAt,
    ).toLocaleString();

    expect(screen.getByText(expectedFormattedDate)).toBeInTheDocument();
  });

  it("returns correct link paths for volunteer table", async () => {
    getMockVolunteersData.mockResolvedValue([mockVolunteerOne]);

    renderWithProviders(<StewardDashboard {...mockProps} />);

    fireEvent.click(screen.getByText("Volunteers"));

    const userId = await screen.findByText("SID-00-000-000-001");

    const review = screen.getByText("Review");

    expectCorrectLinkDestination(userId, "/profile");

    expectCorrectLinkDestination(review, "/promote-to-volunteer?step=5");
  });
});
