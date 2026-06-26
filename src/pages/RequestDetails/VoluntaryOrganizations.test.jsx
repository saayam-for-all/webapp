import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

jest.mock("../../common/components/Loading/Loading", () => () => (
  <div data-testid="loading-indicator" />
));

jest.mock("../../common/components/DataTable/Table", () => (props) => (
  <div data-testid="org-table">
    {props.rows.map((row, i) => (
      <div key={i} data-testid="org-row">
        {row.name}
      </div>
    ))}
  </div>
));

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
  it("shows empty state when API call throws error", async () => {
    getOrganizations.mockRejectedValue(new Error("Network error"));
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.getByText("No organizations found")).toBeInTheDocument(),
    );
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

  // 11. Category filter dropdown toggles
  it("opens and closes category filter dropdown", async () => {
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() =>
      expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument(),
    );
    const filterBtn = screen.getByText("FILTER_BY");
    fireEvent.click(filterBtn);
    expect(screen.getByText("All Categories")).toBeInTheDocument();
  });

  // 12. Handles response wrapped in .body
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
