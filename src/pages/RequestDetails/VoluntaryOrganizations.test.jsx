import "@testing-library/jest-dom";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "#utils/test-utils";
import VoluntaryOrganizations from "./VoluntaryOrganizations";

// ── Mocks ────────────────────────────────────────────────────────────────────

let mockLocationState = {
  id: "REQ-00-000-000-0001",
  requesterId: "SID-00-000-000-111",
  userId: "SID-00-000-000-001",
  category: "Medical",
  subject: "Need help",
  description: "Test description",
  breadcrumbTrail: [],
};

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ state: mockLocationState }),
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
    // Reset to default state with requesterId
    mockLocationState = {
      id: "REQ-00-000-000-0001",
      requesterId: "SID-00-000-000-111",
      userId: "SID-00-000-000-001",
      category: "Medical",
      subject: "Need help",
      description: "Test description",
      breadcrumbTrail: [],
    };
  });

  // 1. Loading state
  it("shows loading indicator while fetching", async () => {
    getOrganizations.mockReturnValue(new Promise(() => {}));
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
    expect(rows[0]).toHaveTextContent("Helping Hands");
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

  // 6. requesterId takes priority as beneficiary_id (All Requests tab)
  it("uses requesterId as beneficiary_id when present (All Requests tab)", async () => {
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    expect(getOrganizations).toHaveBeenCalledWith({
      request_id: "REQ-00-000-000-0001",
      beneficiary_id: "SID-00-000-000-111",
    });
  });

  // 7. Falls back to userId when requesterId is absent
  it("uses userId as beneficiary_id when requesterId is absent", async () => {
    mockLocationState = {
      id: "REQ-00-000-000-0001",
      userId: "SID-00-000-000-001",
      category: "Medical",
      subject: "Need help",
      description: "Test description",
      breadcrumbTrail: [],
    };
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    expect(getOrganizations).toHaveBeenCalledWith({
      request_id: "REQ-00-000-000-0001",
      beneficiary_id: "SID-00-000-000-001",
    });
  });

  // 8. Falls back to userDbId from redux when both requesterId and userId absent
  it("uses userDbId from redux when requesterId and userId are absent", async () => {
    mockLocationState = {
      id: "REQ-00-000-000-0001",
      breadcrumbTrail: [],
    };
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: MOCK_STATE,
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    expect(getOrganizations).toHaveBeenCalledWith({
      request_id: "REQ-00-000-000-0001",
      beneficiary_id: "SID-00-000-000-999",
    });
  });

  // 9. Falls back to localStorage userDbId when redux has no userDbId
  it("uses localStorage userDbId when redux user has no userDbId", async () => {
    mockLocationState = {
      id: "REQ-00-000-000-0001",
      breadcrumbTrail: [],
    };
    localStorage.setItem("userDbId", "SID-FROM-LOCALSTORAGE");
    getOrganizations.mockResolvedValue([]);
    renderWithProviders(<VoluntaryOrganizations />, {
      preloadedState: {
        auth: { user: { userId: "mockUser" }, idToken: "mockToken" },
      },
    });
    await waitFor(() => expect(getOrganizations).toHaveBeenCalledTimes(1));
    expect(getOrganizations).toHaveBeenCalledWith({
      request_id: "REQ-00-000-000-0001",
      beneficiary_id: "SID-FROM-LOCALSTORAGE",
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
