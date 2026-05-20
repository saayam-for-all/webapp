import "@testing-library/jest-dom";
import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";
import Dashboard from "./Dashboard";

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
jest.mock("./views/AdminDashboard", () => (props) => (
  <div data-testid="admin-dashboard">
    <button onClick={() => props.handleTabChange("myRequests")}>
      Click All Requests
    </button>
    <button onClick={() => props.setCurrentPage(2)}>Change Page</button>
    <button onClick={() => props.onRowsPerPageChange(25)}>Change Rows</button>
  </div>
));
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

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders beneficiary dashboard by default when user has no groups", () => {
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: [] }, idToken: "tok" },
      },
    });
    expect(getByTestId("beneficiary-dashboard")).toBeInTheDocument();
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
});
