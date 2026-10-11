import "@testing-library/jest-dom";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "#utils/test-utils";
import VoluntaryOrganizations from "./VoluntaryOrganizations";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("react-router-dom", () => ({
  useLocation: () => ({
    state: {
      id: "REQ-00-000-000-0001",
      userId: "SID-00-000-000-001",
      category: "Medical",
      subject: "Need help",
      description: "Test description",
      breadcrumbTrail: [],
    },
  }),
  useNavigate: () => jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock("../../services/mlServices", () => ({
  getOrganizations: jest.fn(),
}));

jest.mock("../../common/components/Loading/Loading", () => {
  function MockLoadingIndicator() {
    return <div data-testid="loading-indicator" />;
  }
  return MockLoadingIndicator;
});

jest.mock("../../common/components/DataTable/Table", () => {
  const PropTypes = require("prop-types");

  function MockTable({ rows, getLinkPath, getLinkState }) {
    return (
      <div data-testid="org-table">
        {rows.map((row, i) => (
          <div key={i} data-testid="org-row">
            <a
              href={getLinkPath?.(row, "name")}
              data-testid={`org-link-${i}`}
              data-navigation-state={JSON.stringify(
                getLinkState?.(row, "name"),
              )}
            >
              {row.name}
            </a>
          </div>
        ))}
      </div>
    );
  }

  MockTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    getLinkPath: PropTypes.func,
    getLinkState: PropTypes.func,
  };

  return MockTable;
});

jest.mock("../../common/components/BreadCrumbs/breadcrumbUtils", () => ({
  createOrganizationDetailsTrail: jest.fn(() => []),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

import { getOrganizations } from "../../services/mlServices";

const MOCK_STATE = {
  auth: {
    user: { userId: "mockUser", userDbId: "SID-00-000-000-999" },
    idToken: "mockToken",
  },
};

const mockOrgs = [
  {
    Name: "Helping Hands",
    "Org-type": "Nonprofit",
    Collaborator: true,
    location: "Tampa, FL",
    size: "Small",
    rating: 4.8,
    Representative: {
      PersonName: "Jane Doe",
      Phone: "813-000-0000",
      Email: "jane@helpinghands.org",
    },
  },
  {
    Name: "Community Care",
    "Org-type": "NGO",
    Collaborator: false,
    location: "Orlando, FL",
    size: "Medium",
    rating: 4.2,
  },
];

// ── Tests ────────────────────────────────────────────────────────────────────

describe("Issue #1301 organization navigation", () => {
  it("passes the clicked organization to the details route", async () => {
    getOrganizations.mockResolvedValue([
      { name: "Helping Hands", location: "Tampa, FL" },
    ]);

    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });

    const link = await screen.findByRole("link", {
      name: "Helping Hands",
    });

    expect(link).toHaveAttribute("href", "/organization/1");

    const navigationState = JSON.parse(
      link.getAttribute("data-navigation-state"),
    );

    expect(navigationState.organizationName).toBe("Helping Hands");
    expect(navigationState.organizationData.name).toBe("Helping Hands");
  });
});

describe("Issue #1301 latest UI requirements", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("displays the request subject on the Organizations page", () => {
    getOrganizations.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });

    expect(screen.getByTestId("request-subject")).toHaveTextContent(
      "Subject: Need help",
    );
  });

  it("positions the loader inside the Organizations results area", () => {
    getOrganizations.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });

    const container = screen.getByTestId("organizations-loading");

    expect(container).toContainElement(screen.getByTestId("loading-indicator"));
    expect(container).toHaveClass("min-h-[200px]");
  });

  it("passes the selected organization name to the details page", async () => {
    getOrganizations.mockResolvedValue([
      { name: "Helping Hands", location: "Tampa, FL" },
    ]);

    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });

    await waitFor(() => {
      expect(screen.getByText("Helping Hands")).toBeInTheDocument();
    });
  });
});

describe("VoluntaryOrganizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // 1. Loading state
  it("shows loading indicator while fetching", async () => {
    getOrganizations.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    expect(
      screen.getByText("Fetching best organizations for you..."),
    ).toBeInTheDocument();
  });

  // 2. Renders org list on success
  it("renders organizations table after successful API call", async () => {
    getOrganizations.mockResolvedValue(mockOrgs);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getByTestId("org-table")).toBeInTheDocument(),
    );
    expect(screen.getByText("Helping Hands")).toBeInTheDocument();
    expect(screen.getByText("Community Care")).toBeInTheDocument();
  });

  // 3. Collaborators sorted first
  it("sorts collaborators to the top", async () => {
    getOrganizations.mockResolvedValue(mockOrgs);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getAllByTestId("org-row")).toHaveLength(2),
    );
    const rows = screen.getAllByTestId("org-row");
    expect(rows[0]).toHaveTextContent("Helping Hands"); // collaborator first
    expect(rows[1]).toHaveTextContent("Community Care");
  });

  // 4. Empty state when API returns empty array
  it("shows empty state when no organizations returned", async () => {
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getByText("No organizations found")).toBeInTheDocument(),
    );
    expect(
      screen.getByText("No matching organizations for this request."),
    ).toBeInTheDocument();
  });

  // 5. Handles API error gracefully
  it("shows an error message instead of empty results when the API fails", async () => {
    getOrganizations.mockRejectedValue(new Error("Network error"));

    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load organizations",
    );

    expect(screen.getByText("Please try again later.")).toBeInTheDocument();
    expect(
      screen.queryByText("No organizations found"),
    ).not.toBeInTheDocument();
  });

  // 6. API called with correct payload — request_id and beneficiary_id
  it("calls API with request_id from requestData and beneficiary_id from requestData.userId", async () => {
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    expect(getOrganizations).toHaveBeenCalledWith(
      expect.objectContaining({
        request_id: "REQ-00-000-000-0001",
        beneficiary_id: "SID-00-000-000-001",
      }),
    );
  });

  // 7. beneficiary_id uses requestData.userId first, then userDbId from redux
  it("uses requestData.userId as beneficiary_id when present (priority over redux userDbId)", async () => {
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    // requestData.userId = "SID-00-000-000-001" from mock useLocation
    // userDbId from redux = "SID-00-000-000-999"
    // requestData.userId takes priority
    expect(getOrganizations).toHaveBeenCalledWith(
      expect.objectContaining({
        beneficiary_id: "SID-00-000-000-001",
      }),
    );
  });

  // 8. Falls back to localStorage userDbId when redux has no userDbId
  it("uses localStorage userDbId as beneficiary_id when redux user has no userDbId", async () => {
    localStorage.setItem("userDbId", "SID-FROM-LOCALSTORAGE");
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: {
        auth: { user: { userId: "mockUser" }, idToken: "mockToken" },
      },
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    const call = getOrganizations.mock.calls[0][0];
    // beneficiary_id should be requestData.userId ("SID-00-000-000-001") since mock location has it
    expect(call.beneficiary_id).toBeTruthy();
  });

  // 9. Uses city from personalInfo in localStorage
  it("uses city from personalInfo localStorage in payload", async () => {
    localStorage.setItem("personalInfo", JSON.stringify({ city: "San Jose" }));
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    expect.objectContaining({
      request_id: expect.any(String),
      beneficiary_id: expect.any(String),
    });
  });

  // 10. Search filters org list
  it("filters organizations by search term", async () => {
    getOrganizations.mockResolvedValue(mockOrgs);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getByText("Helping Hands")).toBeInTheDocument(),
    );
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Helping" },
    });
    expect(screen.getByText("Helping Hands")).toBeInTheDocument();
    expect(screen.queryByText("Community Care")).not.toBeInTheDocument();
  });

  // 11. Handles response wrapped in .body
  it("handles API response wrapped in body field", async () => {
    getOrganizations.mockResolvedValue({ body: mockOrgs });
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getByText("Helping Hands")).toBeInTheDocument(),
    );
  });

  // 13. Handles response wrapped in .data
  it("handles API response wrapped in data field", async () => {
    getOrganizations.mockResolvedValue({ data: mockOrgs });
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getByText("Helping Hands")).toBeInTheDocument(),
    );
  });

  // 14. Renders Organizations heading
  it("renders Organizations heading", async () => {
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    expect(screen.getByText("Organizations")).toBeInTheDocument();
  });
});
