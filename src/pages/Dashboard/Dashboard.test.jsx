import "@testing-library/jest-dom";
import { act, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, MOCK_STATE_LOGGED_IN } from "#utils/test-utils";

jest.mock("react-router-dom", () => {
  const searchParams = new URLSearchParams();
  return {
    useLocation: () => ({ state: null, pathname: "/dashboard" }),
    useSearchParams: () => [searchParams, jest.fn()],
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

jest.mock("react-i18next", () => {
  const React = require("react");
  const listeners = new Set();
  const translations = {
    en: require("../../common/i18n/locales/en/common.json"),
    es: require("../../common/i18n/locales/es/common.json"),
  };
  const mockI18n = {
    language: "en",
    changeLanguage: jest.fn((language) => {
      mockI18n.language = language;
      listeners.forEach((listener) => listener());
      return Promise.resolve();
    }),
  };

  return {
    useTranslation: () => {
      const [, rerender] = React.useReducer((count) => count + 1, 0);

      React.useEffect(() => {
        listeners.add(rerender);
        return () => listeners.delete(rerender);
      }, []);

      return {
        t: (key) =>
          translations[mockI18n.language]?.[key] ?? translations.en[key] ?? key,
        i18n: mockI18n,
      };
    },
    mockI18n,
  };
});

jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
  toast: { success: jest.fn(), error: jest.fn(), warn: jest.fn() },
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

let lastBeneficiaryDashboardProps = null;
jest.mock("./views/BeneficiaryDashboard", () => (props) => {
  lastBeneficiaryDashboardProps = props;
  return (
    <div data-testid="beneficiary-dashboard">
      <button onClick={() => props.handleTabChange("othersRequests")}>
        Others Requests
      </button>
      <button onClick={() => props.onRowsPerPageChange?.(20)}>
        Change Beneficiary Rows
      </button>
    </div>
  );
});
let lastVolunteerDashboardProps = null;
jest.mock("./views/VolunteerDashboard", () => (props) => {
  lastVolunteerDashboardProps = props;
  return (
    <div data-testid="volunteer-dashboard">
      <button onClick={() => props.handleTabChange("othersRequests")}>
        Others Requests
      </button>
      <button onClick={() => props.handleTabChange("managedRequests")}>
        Managed Requests
      </button>
    </div>
  );
});
let lastAdminDashboardProps = null;
jest.mock("./views/AdminDashboard", () => (props) => {
  lastAdminDashboardProps = props;
  return (
    <div data-testid="admin-dashboard">
      {props.searchFilters}
      <button onClick={() => props.handleTabChange("myRequests")}>
        Click All Requests
      </button>
      <button onClick={() => props.setCurrentPage(2)}>Change Page</button>
      <button onClick={() => props.onRowsPerPageChange(25)}>Change Rows</button>
      <button onClick={() => props.onRowSelect && props.onRowSelect("REQ-001")}>
        Select Row
      </button>
      <button onClick={() => props.onSelectAll && props.onSelectAll(true)}>
        Select All
      </button>
      <button onClick={() => props.onSelectAll && props.onSelectAll(false)}>
        Deselect All
      </button>
    </div>
  );
});
jest.mock("./views/StewardDashboard", () => () => (
  <div data-testid="steward-dashboard" />
));
let lastSuperAdminDashboardProps = null;
jest.mock("./views/SuperAdminDashboard", () => (props) => {
  lastSuperAdminDashboardProps = props;
  return (
    <div data-testid="super-admin-dashboard">
      <button onClick={() => props.handleTabChange("myRequests")}>
        Click Super Admin All Requests
      </button>
    </div>
  );
});
jest.mock("./components/Analytics/ApplicationAnalytics", () => () => null);
jest.mock("./components/Analytics/BeneficiariesAnalytics", () => () => null);
jest.mock("./components/Analytics/GoogleAnalytics", () => () => null);
jest.mock("./components/Analytics/KPIAnalytics", () => () => null);
jest.mock("./components/Analytics/RequestsAnalytics", () => () => null);
jest.mock("./components/Analytics/VolunteerAnalytics", () => () => null);

import Dashboard from "./Dashboard";
import { mockI18n } from "react-i18next";

const adminAuthState = {
  auth: {
    user: {
      userId: "u1",
      userDbId: "SID-00-000-003-016",
      groups: ["Admins"],
    },
    idToken: "tok",
  },
};

const beneficiaryAuthState = {
  auth: {
    user: {
      userId: "u1",
      userDbId: "SID-00-000-003-016",
      groups: [],
    },
    idToken: "tok",
  },
};

const volunteerAuthState = {
  auth: {
    user: {
      userId: "u1",
      userDbId: "SID-00-000-003-016",
      groups: ["Volunteers"],
    },
    idToken: "tok",
  },
};

const superAdminAuthState = {
  auth: {
    user: {
      userId: "u1",
      userDbId: "SID-00-000-003-016",
      groups: ["SuperAdmins"],
    },
    idToken: "tok",
  },
};

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    mockI18n.language = "en";
    mockI18n.changeLanguage.mockClear();
    lastAdminDashboardProps = null;
    lastBeneficiaryDashboardProps = null;
    lastVolunteerDashboardProps = null;
  });

  it("renders beneficiary dashboard by default when user has no groups", () => {
    const { getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: [] }, idToken: "tok" },
      },
    });
    expect(getByTestId("beneficiary-dashboard")).toBeInTheDocument();
  });

  it("translates the dashboard title and every selector label without changing option values", () => {
    localStorage.setItem("environment", JSON.stringify("dev"));
    const { getByRole } = renderWithProviders(<Dashboard />, {
      preloadedState: superAdminAuthState,
    });

    expect(
      getByRole("heading", { name: "Super Admin Dashboard" }),
    ).toBeInTheDocument();

    const options = Array.from(getByRole("combobox").options).map((option) => ({
      label: option.textContent,
      value: option.value,
    }));
    expect(options).toEqual([
      { label: "Beneficiary Dashboard", value: "beneficiary" },
      { label: "Volunteer Dashboard", value: "volunteer" },
      { label: "Steward Dashboard", value: "steward" },
      { label: "Admin Dashboard", value: "admin" },
      { label: "Super Admin Dashboard", value: "superAdmin" },
    ]);
  });

  it("updates the title and selector labels when the language changes", async () => {
    localStorage.setItem("environment", JSON.stringify("dev"));
    const { getByRole } = renderWithProviders(<Dashboard />, {
      preloadedState: superAdminAuthState,
    });

    await act(async () => {
      await mockI18n.changeLanguage("es");
    });

    expect(
      getByRole("heading", { name: "Panel de Superadministrador" }),
    ).toBeInTheDocument();
    expect(
      Array.from(getByRole("combobox").options).map(
        (option) => option.textContent,
      ),
    ).toEqual([
      "Panel de Beneficiario",
      "Panel de Voluntario",
      "Panel de Supervisor",
      "Panel de Administrador",
      "Panel de Superadministrador",
    ]);
  });

  it("translates dashboard filter labels when the language changes", async () => {
    localStorage.setItem("environment", JSON.stringify("dev"));
    const { findByText, getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: adminAuthState,
    });

    fireEvent.click(getByText("Click All Requests"));

    await act(async () => {
      await mockI18n.changeLanguage("es");
    });

    expect(await findByText("Categoría")).toBeInTheDocument();
    expect(getByText("Estado")).toBeInTheDocument();
    expect(getByText("tipo")).toBeInTheDocument();
    expect(getByText("prioridad")).toBeInTheDocument();
    expect(getByText("¿es una calamidad?")).toBeInTheDocument();
  });

  it("falls back to English dashboard labels for an unsupported language", async () => {
    localStorage.setItem("environment", JSON.stringify("dev"));
    const { getByRole } = renderWithProviders(<Dashboard />, {
      preloadedState: superAdminAuthState,
    });

    await act(async () => {
      await mockI18n.changeLanguage("unsupported");
    });

    expect(
      getByRole("heading", { name: "Super Admin Dashboard" }),
    ).toBeInTheDocument();
    expect(
      Array.from(getByRole("combobox").options).map(
        (option) => option.textContent,
      ),
    ).toEqual([
      "Beneficiary Dashboard",
      "Volunteer Dashboard",
      "Steward Dashboard",
      "Admin Dashboard",
      "Super Admin Dashboard",
    ]);
  });

  it("keeps the selected dashboard identifier stable when changing dashboards", () => {
    localStorage.setItem("environment", JSON.stringify("dev"));
    const { getByRole, getByTestId } = renderWithProviders(<Dashboard />, {
      preloadedState: superAdminAuthState,
    });

    fireEvent.change(getByRole("combobox"), {
      target: { value: "volunteer" },
    });

    expect(getByRole("combobox")).toHaveValue("volunteer");
    expect(localStorage.getItem("lastDashboardSelected")).toBe("volunteer");
    expect(getByTestId("volunteer-dashboard")).toBeInTheDocument();
    expect(
      getByRole("heading", { name: "Volunteer Dashboard" }),
    ).toBeInTheDocument();
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
      preloadedState: adminAuthState,
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

  it("builds the All Requests identity columns from requester flags", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");

    getAllPaginatedRequests.mockResolvedValue({
      data: {
        content: [
          {
            requestId: "REQ-SELF",
            requesterId: "SID-SELF",
            requestCategory: "GENERAL_CATEGORY",
            reqForId: 0,
            reqIsleadId: 1,
          },
          {
            requestId: "REQ-OTHER",
            requesterId: "SID-CREATOR",
            requestCategory: "GENERAL_CATEGORY",
            reqForId: 1,
            reqIsleadId: 0,
          },
          {
            requestId: "REQ-STRING-FLAGS",
            requesterId: "SID-STRING",
            requestCategory: "GENERAL_CATEGORY",
            reqForId: "0",
            reqIsLeadId: "1",
          },
          {
            requestId: "REQ-SPLIT-IDS",
            requesterId: "SID-BEN",
            beneficiaryId: "SID-BEN",
            creatorId: "SID-CREATOR",
            requestCategory: "GENERAL_CATEGORY",
            reqIsleadId: 0,
          },
        ],
        totalPages: 1,
        totalElements: 3,
      },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: adminAuthState,
    });

    fireEvent.click(getByText("Click All Requests"));

    await waitFor(() => {
      expect(lastAdminDashboardProps?.headers).toEqual([
        "requestId",
        "subject",
        "beneficiaryCreatorDisplayId",
        "leadVolunteerDisplayId",
        "category",
        "status",
        "priority",
        "updatedDate",
      ]);

      const selfRequest = lastAdminDashboardProps?.filteredData?.find(
        (row) => row.requestId === "REQ-SELF",
      );
      expect(selfRequest).toMatchObject({
        beneficiaryDisplayId: "SID-SELF",
        creatorDisplayId: "SID-SELF",
        beneficiaryCreatorDisplayId: "SID-SELF",
        leadVolunteerDisplayId: "SID-SELF",
      });

      const otherRequest = lastAdminDashboardProps?.filteredData?.find(
        (row) => row.requestId === "REQ-OTHER",
      );
      expect(otherRequest).toMatchObject({
        beneficiaryDisplayId: "SID-CREATOR",
        creatorDisplayId: "SID-CREATOR",
        beneficiaryCreatorDisplayId: "SID-CREATOR",
        leadVolunteerDisplayId: null,
      });

      const stringFlagRequest = lastAdminDashboardProps?.filteredData?.find(
        (row) => row.requestId === "REQ-STRING-FLAGS",
      );
      expect(stringFlagRequest).toMatchObject({
        beneficiaryDisplayId: "SID-STRING",
        creatorDisplayId: "SID-STRING",
        beneficiaryCreatorDisplayId: "SID-STRING",
        leadVolunteerDisplayId: "SID-STRING",
      });

      const splitIdRequest = lastAdminDashboardProps?.filteredData?.find(
        (row) => row.requestId === "REQ-SPLIT-IDS",
      );
      expect(splitIdRequest).toMatchObject({
        beneficiaryDisplayId: "SID-BEN",
        creatorDisplayId: "SID-CREATOR",
        beneficiaryCreatorDisplayId: "SID-BEN / SID-CREATOR",
        leadVolunteerDisplayId: null,
      });
    });

    getAllPaginatedRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });
  });

  it("links requestId to the request page and creator/lead volunteer IDs to the profile page for Admin", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");

    getAllPaginatedRequests.mockResolvedValue({
      data: {
        content: [
          {
            requestId: "REQ-SELF",
            requesterId: "SID-SELF",
            requestCategory: "GENERAL_CATEGORY",
            reqForId: 0,
            reqIsleadId: 1,
          },
          {
            requestId: "REQ-OTHER",
            requesterId: "SID-CREATOR",
            requestCategory: "GENERAL_CATEGORY",
            reqForId: 1,
            reqIsleadId: 0,
          },
        ],
        totalPages: 1,
        totalElements: 2,
      },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: adminAuthState,
    });

    fireEvent.click(getByText("Click All Requests"));

    await waitFor(() =>
      expect(lastAdminDashboardProps?.filteredData?.length).toBe(2),
    );

    const selfRequest = lastAdminDashboardProps.filteredData.find(
      (row) => row.requestId === "REQ-SELF",
    );
    const otherRequest = lastAdminDashboardProps.filteredData.find(
      (row) => row.requestId === "REQ-OTHER",
    );
    const { getLinkPath, getLinkState } = lastAdminDashboardProps;

    expect(getLinkPath(selfRequest, "requestId")).toBe("/request/REQ-SELF");
    expect(getLinkPath(selfRequest, "beneficiaryCreatorDisplayId")).toBe(
      "/profile",
    );
    expect(getLinkPath(selfRequest, "leadVolunteerDisplayId")).toBe("/profile");
    expect(getLinkPath(otherRequest, "leadVolunteerDisplayId")).toBeNull();
    expect(getLinkPath(selfRequest, "category")).toBeNull();

    expect(getLinkState(selfRequest, "requestId")).toBe(selfRequest);
    expect(getLinkState(selfRequest, "beneficiaryCreatorDisplayId")).toEqual({
      tab: "profile",
    });
    expect(getLinkState(selfRequest, "leadVolunteerDisplayId")).toEqual({
      tab: "profile",
    });

    getAllPaginatedRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });
  });

  it("links requestId to the request page and creator/lead volunteer IDs to the profile page for Super Admin", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");

    getAllPaginatedRequests.mockResolvedValue({
      data: {
        content: [
          {
            requestId: "REQ-SELF",
            requesterId: "SID-SELF",
            requestCategory: "GENERAL_CATEGORY",
            reqForId: 0,
            reqIsleadId: 1,
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: superAdminAuthState,
    });

    fireEvent.click(getByText("Click Super Admin All Requests"));

    await waitFor(() =>
      expect(lastSuperAdminDashboardProps?.filteredData?.length).toBe(1),
    );

    const selfRequest = lastSuperAdminDashboardProps.filteredData.find(
      (row) => row.requestId === "REQ-SELF",
    );
    const { getLinkPath, getLinkState } = lastSuperAdminDashboardProps;

    expect(getLinkPath(selfRequest, "requestId")).toBe("/request/REQ-SELF");
    expect(getLinkPath(selfRequest, "beneficiaryCreatorDisplayId")).toBe(
      "/profile",
    );
    expect(getLinkPath(selfRequest, "leadVolunteerDisplayId")).toBe("/profile");
    expect(getLinkPath(selfRequest, "category")).toBeNull();
    expect(getLinkState(selfRequest, "beneficiaryCreatorDisplayId")).toEqual({
      tab: "profile",
    });
    expect(getLinkState(selfRequest, "leadVolunteerDisplayId")).toEqual({
      tab: "profile",
    });
    expect(getLinkState(selfRequest, "requestId")).toBe(selfRequest);

    getAllPaginatedRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });
  });

  it("calls getAllPaginatedRequests when Admin switches to All Requests tab", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: adminAuthState,
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
      preloadedState: adminAuthState,
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 5,
      }),
    );

    fireEvent.click(getByText("Change Page"));
    await waitFor(() => {
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 1,
        size: 5,
      });
      const pageOneCalls = getAllPaginatedRequests.mock.calls.filter(
        ([options]) => options.page === 1 && options.size === 5,
      );
      expect(pageOneCalls).toHaveLength(1);
    });
  });

  it("calls getAllPaginatedRequests with updated size when handleRowsPerPageChange is called", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");
    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: adminAuthState,
    });

    fireEvent.click(getByText("Click All Requests"));
    await waitFor(() =>
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 5,
      }),
    );

    fireEvent.click(getByText("Change Rows"));
    await waitFor(() => {
      expect(getAllPaginatedRequests).toHaveBeenCalledWith({
        page: 0,
        size: 25,
      });
      const updatedSizeCalls = getAllPaginatedRequests.mock.calls.filter(
        ([options]) => options.page === 0 && options.size === 25,
      );
      expect(updatedSizeCalls).toHaveLength(1);
    });
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
      preloadedState: adminAuthState,
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
      preloadedState: adminAuthState,
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
      preloadedState: adminAuthState,
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

  it("exposes server pagination props to Admin after All Requests fetch", async () => {
    const {
      getAllPaginatedRequests,
    } = require("../../services/requestServices");

    getAllPaginatedRequests.mockResolvedValue({
      data: {
        content: [{ requestId: "REQ-1", requestCategory: "FOOD_ASSISTANCE" }],
        totalPages: 4,
        totalElements: 32,
      },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: adminAuthState,
    });

    fireEvent.click(getByText("Click All Requests"));

    await waitFor(() => {
      expect(lastAdminDashboardProps?.serverPaginated).toBe(true);
      expect(lastAdminDashboardProps?.serverTotalRows).toBe(32);
    });
  });

  it("calls getMyRequests for Beneficiary My Requests with userId, page, and size", async () => {
    const { getMyRequests } = require("../../services/requestServices");

    getMyRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });

    renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() => {
      expect(getMyRequests).toHaveBeenCalledWith({
        userId: "SID-00-000-003-016",
        page: 0,
        size: 5,
      });
    });
  });

  it("maps reqDesc and reqCatId from getMyRequests response for Beneficiary", async () => {
    const { getMyRequests } = require("../../services/requestServices");

    getMyRequests.mockResolvedValue({
      data: {
        content: [
          {
            requestId: "REQ-00-000-000-0999",
            requestCategory: "MEAL_PREP_BASIC",
            reqCatId: "1.3.1",
            reqDesc: "Need meal prep help",
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
    });

    renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() => {
      const row = lastBeneficiaryDashboardProps?.filteredData?.find(
        (r) => r.id === "REQ-00-000-000-0999",
      );
      expect(row).toMatchObject({
        category: "MEAL_PREP_BASIC",
        description: "Need meal prep help",
        catId: "1.3.1",
      });
    });
  });

  it("calls getMyRequests with updated size when Beneficiary rows per page changes", async () => {
    const { getMyRequests } = require("../../services/requestServices");

    getMyRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() =>
      expect(getMyRequests).toHaveBeenCalledWith({
        userId: "SID-00-000-003-016",
        page: 0,
        size: 5,
      }),
    );

    fireEvent.click(getByText("Change Beneficiary Rows"));

    await waitFor(() =>
      expect(getMyRequests).toHaveBeenCalledWith({
        userId: "SID-00-000-003-016",
        page: 0,
        size: 20,
      }),
    );
  });

  it("handles getMyRequests API error and logs it to console", async () => {
    const { getMyRequests } = require("../../services/requestServices");
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    getMyRequests.mockRejectedValueOnce(new Error("My Requests API Error"));

    renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching requests:",
        expect.any(Error),
      );
    });
    consoleErrorSpy.mockRestore();
  });

  it("normalizes getMyRequests records from top-level content", async () => {
    const { getMyRequests } = require("../../services/requestServices");

    getMyRequests.mockResolvedValue({
      content: [
        {
          requestId: "REQ-CONTENT",
          requestCategory: "Category Content",
          reqDesc: "From content",
        },
      ],
      totalPages: 2,
      totalElements: 10,
    });

    renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() => {
      expect(
        lastBeneficiaryDashboardProps?.filteredData?.find(
          (r) => r.id === "REQ-CONTENT",
        ),
      ).toMatchObject({
        category: "Category Content",
        description: "From content",
      });
    });
  });

  it("normalizes getMyRequests records from top-level body", async () => {
    const { getMyRequests } = require("../../services/requestServices");

    getMyRequests.mockResolvedValue({
      body: [
        {
          id: "REQ-BODY",
          category: "Category Body",
          description: "From body",
        },
      ],
      totalPages: 1,
      totalElements: 1,
    });

    renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() => {
      expect(
        lastBeneficiaryDashboardProps?.filteredData?.find(
          (r) => r.id === "REQ-BODY",
        ),
      ).toMatchObject({
        category: "Category Body",
        description: "From body",
      });
    });
  });

  it("calls getOthersRequests when Beneficiary switches to Others Requests tab", async () => {
    const {
      getOthersRequests,
      getMyRequests,
    } = require("../../services/requestServices");
    getOthersRequests.mockResolvedValue({
      body: [{ requestId: "REQ-OTHER-1", subject: "For someone else" }],
    });
    getMyRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: beneficiaryAuthState,
    });

    await waitFor(() => expect(getMyRequests).toHaveBeenCalled());

    fireEvent.click(getByText("Others Requests"));

    await waitFor(() => {
      expect(getOthersRequests).toHaveBeenCalled();
      expect(
        lastBeneficiaryDashboardProps?.filteredData?.find(
          (r) => r.requestId === "REQ-OTHER-1" || r.id === "REQ-OTHER-1",
        ),
      ).toBeDefined();
    });
  });

  it("calls getOthersRequests when Volunteer switches to Others Requests tab", async () => {
    const { getOthersRequests } = require("../../services/requestServices");

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: volunteerAuthState,
    });

    fireEvent.click(getByText("Others Requests"));

    await waitFor(() => {
      expect(getOthersRequests).toHaveBeenCalled();
    });
  });

  it("calls getManagedRequests when Volunteer switches to Managed Requests tab", async () => {
    const { getManagedRequests } = require("../../services/requestServices");

    const { getByText } = renderWithProviders(<Dashboard />, {
      preloadedState: volunteerAuthState,
    });

    fireEvent.click(getByText("Managed Requests"));

    await waitFor(() => {
      expect(getManagedRequests).toHaveBeenCalled();
    });
  });

  it("uses userDbId from localStorage when not in redux state", async () => {
    const { getMyRequests } = require("../../services/requestServices");
    localStorage.setItem("userDbId", "SID-FROM-STORAGE");

    getMyRequests.mockResolvedValue({
      data: { content: [], totalPages: 1, totalElements: 0 },
    });

    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { userId: "u1", groups: [] }, idToken: "tok" },
      },
    });

    await waitFor(() => {
      expect(getMyRequests).toHaveBeenCalledWith(
        expect.objectContaining({ userId: "SID-FROM-STORAGE" }),
      );
    });
  });

  describe("selectedRows and bulk status change", () => {
    const rowData = {
      requestId: "REQ-001",
      requestCategory: "GENERAL",
      status: "CREATED",
      subject: "Test request",
    };

    beforeEach(() => {
      const {
        getAllPaginatedRequests,
      } = require("../../services/requestServices");
      getAllPaginatedRequests.mockResolvedValue({
        data: { content: [rowData], totalPages: 1, totalElements: 1 },
      });
      const { toast } = require("react-toastify");
      toast.warn.mockClear();
    });

    afterEach(() => {
      const {
        getAllPaginatedRequests,
      } = require("../../services/requestServices");
      getAllPaginatedRequests.mockResolvedValue({
        data: { content: [], totalPages: 1, totalElements: 0 },
      });
    });

    it("passes empty selectedRows and onRowSelect to AdminDashboard", async () => {
      const { getByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });
      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).toEqual([]),
      );
      expect(typeof lastAdminDashboardProps?.onRowSelect).toBe("function");
      expect(typeof lastAdminDashboardProps?.onSelectAll).toBe("function");
    });

    it("adds row id to selectedRows when onRowSelect is called", async () => {
      const { getByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });
      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select Row"));
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).toContain("REQ-001"),
      );
    });

    it("removes row id from selectedRows when onRowSelect is called again", async () => {
      const { getByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });
      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select Row")); // select
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).toContain("REQ-001"),
      );
      fireEvent.click(getByText("Select Row")); // deselect
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).not.toContain("REQ-001"),
      );
    });

    it("selects all rows on current page when onSelectAll(true) is called", async () => {
      const { getByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });
      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select All"));
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).toContain("REQ-001"),
      );
    });

    it("deselects all rows on current page when onSelectAll(false) is called", async () => {
      const { getByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });
      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select All")); // select first
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).toContain("REQ-001"),
      );
      fireEvent.click(getByText("Deselect All")); // then deselect
      await waitFor(() =>
        expect(lastAdminDashboardProps?.selectedRows).not.toContain("REQ-001"),
      );
    });

    it("shows bulk action UI with selected count when rows are selected on myRequests tab", async () => {
      const { getByText, queryByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });
      expect(queryByText("1 selected")).not.toBeInTheDocument();

      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select Row"));
      await waitFor(() => expect(getByText("1 selected")).toBeInTheDocument());
    });

    it("shows warning toast when Apply is clicked (backend pending)", async () => {
      const { toast } = require("react-toastify");

      const { getByText, getAllByRole } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });

      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select Row"));
      await waitFor(() => expect(getByText("1 selected")).toBeInTheDocument());

      const selects = getAllByRole("combobox");
      const statusSelect = selects[selects.length - 1];
      fireEvent.change(statusSelect, { target: { value: "CANCELLED" } });

      fireEvent.click(getByText("Apply"));

      await waitFor(() => {
        expect(toast.warn).toHaveBeenCalledWith(
          expect.stringContaining("pending backend API support"),
        );
      });
    });

    it("clears selectedRows and resets bulk status after apply", async () => {
      const { getByText, queryByText, getAllByRole } = renderWithProviders(
        <Dashboard />,
        { preloadedState: adminAuthState },
      );

      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select Row"));
      await waitFor(() => expect(getByText("1 selected")).toBeInTheDocument());

      const selects = getAllByRole("combobox");
      const statusSelect = selects[selects.length - 1];
      fireEvent.change(statusSelect, { target: { value: "CANCELLED" } });
      fireEvent.click(getByText("Apply"));

      await waitFor(() =>
        expect(queryByText("1 selected")).not.toBeInTheDocument(),
      );
    });

    it("does not trigger bulk change when no status is selected", async () => {
      const { toast } = require("react-toastify");

      const { getByText } = renderWithProviders(<Dashboard />, {
        preloadedState: adminAuthState,
      });

      fireEvent.click(getByText("Click All Requests"));
      await waitFor(() => expect(lastAdminDashboardProps).not.toBeNull());

      fireEvent.click(getByText("Select Row"));
      await waitFor(() => expect(getByText("1 selected")).toBeInTheDocument());

      // Apply button should be disabled when no status selected, but test handler guard
      fireEvent.click(getByText("Apply"));
      expect(toast.warn).not.toHaveBeenCalled();
    });
  });
});
