import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScrollableTable from "./ScrollableTable";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

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

describe("ScrollableTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with headers and data", () => {
    render(<ScrollableTable {...defaultProps} />);

    // Check headers
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText(/Name/)).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText("Request 1")).toBeInTheDocument();
    expect(screen.getByText("Request 2")).toBeInTheDocument();
  });

  it("renders empty state when no rows", () => {
    render(<ScrollableTable {...defaultProps} rows={[]} isLoading={false} />);

    expect(screen.getByText("No requests found")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<ScrollableTable {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("calls requestSort when header is clicked", () => {
    render(<ScrollableTable {...defaultProps} />);

    const nameHeader = screen.getByRole("button", { name: /name/i });
    nameHeader.click();

    expect(defaultProps.requestSort).toHaveBeenCalledWith("name");
  });

  it("shows sort indicators correctly", () => {
    render(<ScrollableTable {...defaultProps} />);

    // Check for ascending indicator on name column
    expect(screen.getByRole("button", { name: /name/i })).toHaveTextContent(
      "↑",
    );
  });
});
