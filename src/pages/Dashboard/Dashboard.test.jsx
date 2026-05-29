import "@testing-library/jest-dom";
import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";

jest.mock("react-router-dom", () => {
  const searchParams = new URLSearchParams();
  return {
    useLocation: () => ({ state: null, pathname: "/dashboard" }),
    useSearchParams: () => [searchParams, jest.fn()],
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../../services/requestServices", () => ({
  getMyRequests: jest.fn(() => Promise.resolve({ body: [] })),
  getOthersRequests: jest.fn(() => Promise.resolve({ body: [] })),
  getManagedRequests: jest.fn(() => Promise.resolve({ body: [] })),
  getAllPaginatedRequests: jest.fn(() =>
    Promise.resolve({
      data: { content: [], totalPages: 1, totalElements: 0 },
    }),
  ),
}));

jest.mock("./views/BeneficiaryDashboard", () => () => (
  <div data-testid="beneficiary-dashboard" />
));
jest.mock("./views/VolunteerDashboard", () => () => (
  <div data-testid="volunteer-dashboard" />
));
let lastAdminDashboardProps = null;
jest.mock("./views/AdminDashboard", () => (props) => {
  lastAdminDashboardProps = props;
  return (
    <div data-testid="admin-dashboard">
      <button onClick={() => props.handleTabChange("myRequests")}>
        Click All Requests
      </button>
      <button onClick={() => props.setCurrentPage(2)}>Change Page</button>
      <button onClick={() => props.onRowsPerPageChange(25)}>Change Rows</button>
    </div>
  );
});
jest.mock("./views/StewardDashboard", () => () => (
  <div data-testid="steward-dashboard" />
));
jest.mock("./views/SuperAdminDashboard", () => () => (
  <div data-testid="super-admin-dashboard" />
));
jest.mock("./components/Analytics/ApplicationAnalytics", () => () => null);
jest.mock("./components/Analytics/BeneficiariesAnalytics", () => () => null);
jest.mock("./components/Analytics/GoogleAnalytics", () => () => null);
jest.mock("./components/Analytics/KPIAnalytics", () => () => null);
jest.mock("./components/Analytics/RequestsAnalytics", () => () => null);
jest.mock("./components/Analytics/VolunteerAnalytics", () => () => null);

import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    lastAdminDashboardProps = null;
  });

  it("renders beneficiary dashboard by default when user has no groups", () => {
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: [] }, idToken: "tok" },
      },
    });
    expect(getByTestId("beneficiary-dashboard")).toBeInTheDocument();
  });

  it("renders steward dashboard when user has steward role", () => {
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Stewards"] }, idToken: "tok" },
      },
    });

    expect(getByTestId("steward-dashboard")).toBeInTheDocument();
  });

  it("applies userPreferences.defaultDashboard when accessible to the user", () => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ defaultDashboard: "steward" }),
    );
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });
    // Admin's role-default is admin; preference of steward should override.
    expect(getByTestId("steward-dashboard")).toBeInTheDocument();
    expect(localStorage.getItem("lastDashboardSelected")).toBe("steward");
  });

  it("ignores userPreferences.defaultDashboard when not accessible", () => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ defaultDashboard: "superAdmin" }),
    );
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: {
          user: { userId: "u1", groups: ["Beneficiaries"] },
          idToken: "tok",
        },
      },
    });
    // Beneficiary cannot access superAdmin; falls back to role default.
    expect(getByTestId("beneficiary-dashboard")).toBeInTheDocument();
  });

  it("falls through to role default when userPreferences JSON is malformed", () => {
    localStorage.setItem("userPreferences", "{not valid json");
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });
    // Malformed JSON is swallowed by the try/catch; Admin role default wins.
    expect(getByTestId("admin-dashboard")).toBeInTheDocument();
  });

  it("maps reqDesc and reqCatId from paginated help-requests response", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");

    const paginatedRow = {
      requestId: "REQ-00-000-000-0360",
      requesterId: "SID-00-000-003-016",
      status: "MATCHING_VOLUNTEER",
      requestCategory: "MEAL_PREP_BASIC",
      reqCatId: "1.3.1",
      reqDesc: "High protein vegetarian meals",
      type: "REMOTE",
      priority: "MEDIUM",
      calamity: false,
      updatedDate: "2026-05-24T17:17:45.999808Z",
    };

    getAllPaginatedRequests.mockResolvedValue({
      data: {
        content: [paginatedRow],
        totalPages: 1,
        totalElements: 1,
      },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));

    await waitFor(() => {
      const row = lastAdminDashboardProps?.filteredData?.find(
        (r) => r.id === "REQ-00-000-000-0360",
      );
      expect(row).toMatchObject({
        description: "High protein vegetarian meals",
        catId: "1.3.1",
        requesterId: "SID-00-000-003-016",
      });
    });

    getAllPaginatedRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });
  });

  it("calls getAllPaginatedRequests when Admin switches to All Requests tab", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));

    await waitFor(() => {
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 5,
      });
    });
  });

  it("calls getAllPaginatedRequests with updated page when handlePageChange is called", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 5,
      }),
    );

    fireEvent.click(getByText("Change Page"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 1,
        size: 5,
      }),
    );
  });

  it("calls getAllPaginatedRequests with updated size when handleRowsPerPageChange is called", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 5,
      }),
    );

    fireEvent.click(getByText("Change Rows"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 25,
      }),
    );
  });

  it("handles api error and logs it to console", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getAllPaginatedRequests.mockRejectedValueOnce(new Error("API Error"));

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching requests:",
        expect.any(Error),
      );
    });
    consoleErrorSpy.mockRestore();
  });

  it("handles top-level content and body in paginated responses", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");

    // Test top-level content
    getAllPaginatedRequests.mockResolvedValueOnce({
      content: [
        { requestId: "req-content", requestCategory: "Category Content" },
      ],
      totalPages: 4,
      totalElements: 20,
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() => {
      expect(getAllPaginatedRequests).toHaveBeenCalled();
    });

    // Test top-level body
    getAllPaginatedRequests.mockResolvedValueOnce({
      body: [{ id: "req-body", category: "Category Body" }],
      totalPages: 3,
      totalElements: 15,
    });

    fireEvent.click(getByText("Change Page"));
    await waitFor(() => {
      expect(getAllPaginatedRequests).toHaveBeenLastCalledWith({
        page: 1,
        size: 5,
      });
    });
  });

  it("does not call API if handlePageChange is called with the current page", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: ["Admins"] }, idToken: "tok" },
      },
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 5,
      }),
    );

    // Call page change with page 1 (which is index 0 under the hood)
    fireEvent.click(getByText("Change Page")); // Note: our mock clicks props.setCurrentPage(2) which is page 2 (index 1)
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 1,
        size: 5,
      }),
    );

    // If we trigger setCurrentPage(2) again, it shouldn't trigger a new API call because 2 - 1 = 1 which equals currentServerPage (1)
    getAllPaginatedRequests.mockClear();
    fireEvent.click(getByText("Change Page"));
    // Since page index 1 is already active, expect no new API calls
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getAllPaginatedRequests).not.toHaveBeenCalled();
  });
});
