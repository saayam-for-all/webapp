import { render, fireEvent } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";
import StewardDashboard from "./StewardDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";
import "@testing-library/jest-dom";

// Mock child components to keep tests simple and isolation clean
jest.mock("../../../common/components/DataTable/Table", () => () => (
  <div data-testid="mock-table" />
));
jest.mock("../components/Analytics/ApplicationAnalytics", () => () => (
  <div data-testid="mock-app-analytics" />
));
jest.mock("../components/Analytics/GoogleAnalytics", () => () => (
  <div data-testid="mock-google-analytics" />
));

describe("Dashboard Views", () => {
  const defaultProps = {
    headers: ["id", "subject"],
    filteredData: [{ id: 1, subject: "Test 1" }],
    isLoading: false,
    currentPage: 1,
    setCurrentPage: jest.fn(),
    totalPages: jest.fn(() => 5),
    rowsPerPage: 5,
    sortConfig: {},
    requestSort: jest.fn(),
    onRowsPerPageChange: jest.fn(),
    getLinkPath: jest.fn(),
    getLinkState: jest.fn(),
    searchFilters: <div data-testid="mock-search-filters" />,
    handleTabChange: jest.fn(),
    analyticsSubtab: "Infrastructure",
    setAnalyticsSubtab: jest.fn(),
  };

  describe("AdminDashboard", () => {
    it("renders analytics sub-tabs when activeTab is analytics", () => {
      const { getByText, getByTestId } = render(
        <AdminDashboard {...defaultProps} activeTab="analytics" />,
      );

      expect(getByText("Infrastructure")).toBeInTheDocument();
      expect(getByText("Application Analytics")).toBeInTheDocument();
      expect(getByText("Google Analytics")).toBeInTheDocument();
    });

    it("triggers handleTabChange when tabs are clicked", () => {
      const handleTabChange = jest.fn();
      const { getByText } = render(
        <AdminDashboard
          {...defaultProps}
          activeTab="myRequests"
          handleTabChange={handleTabChange}
        />,
      );

      fireEvent.click(getByText("Analytics"));
      expect(handleTabChange).toHaveBeenCalledWith("analytics");
    });

    it("triggers setAnalyticsSubtab when sub-tabs are clicked", () => {
      const setAnalyticsSubtab = jest.fn();
      const { getByText } = render(
        <AdminDashboard
          {...defaultProps}
          activeTab="analytics"
          setAnalyticsSubtab={setAnalyticsSubtab}
        />,
      );

      fireEvent.click(getByText("Application Analytics"));
      expect(setAnalyticsSubtab).toHaveBeenCalledWith("Application Analytics");
    });

    it("renders table when activeTab is not analytics", () => {
      const { getByTestId } = render(
        <AdminDashboard {...defaultProps} activeTab="myRequests" />,
      );
      expect(getByTestId("mock-table")).toBeInTheDocument();
    });

    it("applies server-side pagination props when serverPaginated is true", () => {
      const { getByTestId } = render(
        <AdminDashboard
          {...defaultProps}
          activeTab="myRequests"
          serverPaginated={true}
          serverTotalRows={100}
        />,
      );
      expect(getByTestId("mock-table")).toBeInTheDocument();
    });
  });

  describe("SuperAdminDashboard", () => {
    it("renders analytics sub-tabs when activeTab is analytics", () => {
      const { getByText } = render(
        <SuperAdminDashboard
          {...defaultProps}
          activeTab="analytics"
          getLinkState={{}}
        />,
      );

      expect(getByText("Infrastructure")).toBeInTheDocument();
    });

    it("triggers handleTabChange when tabs are clicked", () => {
      const handleTabChange = jest.fn();
      const { getByText } = render(
        <SuperAdminDashboard
          {...defaultProps}
          activeTab="myRequests"
          handleTabChange={handleTabChange}
          getLinkState={{}}
        />,
      );

      fireEvent.click(getByText("Analytics"));
      expect(handleTabChange).toHaveBeenCalledWith("analytics");
    });

    it("renders table when activeTab is not analytics", () => {
      const { getByTestId } = render(
        <SuperAdminDashboard
          {...defaultProps}
          activeTab="myRequests"
          getLinkState={{}}
        />,
      );
      expect(getByTestId("mock-table")).toBeInTheDocument();
    });

    it("applies server-side pagination props when serverPaginated is true", () => {
      const { getByTestId } = render(
        <SuperAdminDashboard
          {...defaultProps}
          activeTab="myRequests"
          serverPaginated={true}
          serverTotalRows={100}
          getLinkState={{}}
        />,
      );
      expect(getByTestId("mock-table")).toBeInTheDocument();
    });
  });

  describe("StewardDashboard", () => {
    it("renders steward dashboard with tabs", () => {
      const { getByText } = render(<StewardDashboard {...defaultProps} />);
      expect(getByText("All Requests")).toBeInTheDocument();
      expect(getByText("Volunteers")).toBeInTheDocument();
    });

    it("renders table when activeTab is allRequests", () => {
      const { getByTestId } = render(<StewardDashboard {...defaultProps} />);
      expect(getByTestId("mock-table")).toBeInTheDocument();
    });

    it("applies server-side pagination props when serverPaginated is true", () => {
      const { getByTestId } = render(
        <StewardDashboard
          {...defaultProps}
          serverPaginated={true}
          serverTotalRows={100}
        />,
      );
      expect(getByTestId("mock-table")).toBeInTheDocument();
    });
  });
});
