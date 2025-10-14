import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScrollableTable from "./ScrollableTable";

// Mock data for testing
const mockHeaders = ["id", "name", "status"];
const mockRows = [
  { id: "1", name: "Request 1", status: "Open" },
  { id: "2", name: "Request 2", status: "Closed" },
];

const defaultProps = {
  headers: mockHeaders,
  rows: mockRows,
  sortConfig: { key: "name", direction: "ascending" },
  requestSort: jest.fn(),
  getLinkPath: jest.fn((request, header) => `/request/${request[header]}`),
  onLoadMore: jest.fn().mockResolvedValue(),
  hasMore: true,
  isLoading: false,
  totalRows: 2,
};

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("ScrollableTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with headers and data", () => {
    renderWithRouter(<ScrollableTable {...defaultProps} />);

    // Check headers
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText("Request 1")).toBeInTheDocument();
    expect(screen.getByText("Request 2")).toBeInTheDocument();
  });

  it("renders empty state when no rows", () => {
    renderWithRouter(
      <ScrollableTable {...defaultProps} rows={[]} isLoading={false} />,
    );

    expect(screen.getByText("No requests found")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    renderWithRouter(<ScrollableTable {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("calls requestSort when header is clicked", () => {
    renderWithRouter(<ScrollableTable {...defaultProps} />);

    const nameHeader = screen.getByText("Name");
    nameHeader.click();

    expect(defaultProps.requestSort).toHaveBeenCalledWith("name");
  });

  it("shows sort indicators correctly", () => {
    renderWithRouter(<ScrollableTable {...defaultProps} />);

    // Check for ascending indicator on name column
    expect(screen.getByText("↑")).toBeInTheDocument();
  });
});
