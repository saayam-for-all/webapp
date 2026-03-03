import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VoluntaryOrganizations from "./VoluntaryOrganizations";
import { getVolunteerOrgsList } from "../../services/volunteerServices";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "en", changeLanguage: jest.fn() },
  }),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { state: null };
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock volunteerServices
jest.mock("../../services/volunteerServices", () => ({
  getVolunteerOrgsList: jest.fn(),
}));

// Mock react-icons
jest.mock("react-icons/io5", () => ({
  IoSearchOutline: () => <span data-testid="search-icon" />,
}));

jest.mock("react-icons/fa", () => ({
  FaMapMarkerAlt: () => <span data-testid="location-icon" />,
  FaPhoneAlt: () => <span data-testid="phone-icon" />,
  FaEnvelope: () => <span data-testid="email-icon" />,
  FaGlobe: () => <span data-testid="globe-icon" />,
  FaBuilding: () => <span data-testid="building-icon" />,
  FaArrowLeft: () => <span data-testid="arrow-left-icon" />,
  FaRobot: () => <span data-testid="robot-icon" />,
  FaClipboardList: () => <span data-testid="clipboard-icon" />,
}));

jest.mock("react-icons/hi", () => ({
  HiOutlineExternalLink: () => <span data-testid="external-link-icon" />,
}));

describe("VoluntaryOrganizations", () => {
  const mockOrganizations = [
    {
      name: "Food Bank Tampa",
      location: "Tampa, FL",
      contact: "(813) 555-1234",
      email: "help@foodbanktampa.org",
      web_url: "https://foodbanktampa.org",
      db_or_ai: "db",
    },
    {
      name: "AI Suggested Org",
      location: "Orlando, FL",
      contact: "(407) 555-5678",
      email: "info@aiorg.org",
      web_url: "https://aiorg.org",
      db_or_ai: "ai",
    },
    {
      name: "LLM Recommended",
      location: "Miami, FL",
      contact: "(305) 555-0000",
      email: "contact@llmorg.org",
      web_url: "https://llmorg.org",
      db_or_ai: "llm",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.state = {
      category: "FOOD_ASSISTANCE",
      description: "Need food help",
      location: "Tampa, FL",
    };
  });

  describe("Loading State", () => {
    it("shows loading skeleton while fetching data", async () => {
      getVolunteerOrgsList.mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      render(<VoluntaryOrganizations />);

      // Should show loading skeletons (6 skeleton cards)
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("No Request Data State", () => {
    it("shows no request data message when category and description are empty", async () => {
      mockLocation.state = {};

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(
          screen.getByText("Request Details Required"),
        ).toBeInTheDocument();
      });
    });

    it("shows go to dashboard button when no request data", async () => {
      mockLocation.state = {};

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Data Fetching", () => {
    it("calls getVolunteerOrgsList with correct payload", async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(getVolunteerOrgsList).toHaveBeenCalledWith({
          category: "FOOD_ASSISTANCE",
          subject: "FOOD_ASSISTANCE",
          description: "Need food help",
          location: "Tampa, FL",
        });
      });
    });

    it("handles response with body as array", async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });
    });

    it("handles response with body as stringified JSON", async () => {
      getVolunteerOrgsList.mockResolvedValue({
        body: JSON.stringify(mockOrganizations),
      });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });
    });

    it("handles direct array response", async () => {
      getVolunteerOrgsList.mockResolvedValue(mockOrganizations);

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });
    });

    it("handles category as object", async () => {
      mockLocation.state = {
        category: { name: "Food Help", catName: "FOOD_ASSISTANCE" },
        description: "Need food",
      };
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(getVolunteerOrgsList).toHaveBeenCalledWith(
          expect.objectContaining({
            category: "Food Help",
          }),
        );
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      console.error.mockRestore();
    });

    it("shows error message when API call fails", async () => {
      getVolunteerOrgsList.mockRejectedValue(new Error("Network error"));

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load organizations. Please try again."),
        ).toBeInTheDocument();
      });
    });

    it("shows try again button on error", async () => {
      getVolunteerOrgsList.mockRejectedValue(new Error("Network error"));

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Try Again")).toBeInTheDocument();
      });
    });
  });

  describe("Organization Display", () => {
    beforeEach(async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("displays organization cards", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
        expect(screen.getByText("LLM Recommended")).toBeInTheDocument();
      });
    });

    it("displays organization count", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText(/3.*organizations.*found/)).toBeInTheDocument();
      });
    });

    it("displays organization location", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Tampa, FL")).toBeInTheDocument();
      });
    });

    it("displays organization email", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("help@foodbanktampa.org")).toBeInTheDocument();
      });
    });

    it("displays source badges correctly", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        // Should have Registered (db) and AI Suggested (ai + llm) badges
        // Note: These also appear in the footer legend, so we check for at least the card badges
        const registeredBadges = screen.getAllByText("Registered");
        const aiSuggestedBadges = screen.getAllByText("AI Suggested");

        // At least 1 card badge + 1 footer legend = 2 for Registered
        expect(registeredBadges.length).toBeGreaterThanOrEqual(1);
        // At least 2 card badges + 1 footer legend = 3 for AI Suggested
        expect(aiSuggestedBadges.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Source Filter", () => {
    beforeEach(async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("shows all organizations by default", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
        expect(screen.getByText("LLM Recommended")).toBeInTheDocument();
      });
    });

    it("filters to show only AI suggested organizations", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });

      // Click AI Suggested filter button (find by the text that's part of the button)
      const aiFilterButtons = screen.getAllByRole("button");
      const aiButton = aiFilterButtons.find(
        (btn) =>
          btn.textContent.includes("AI Suggested") &&
          btn.textContent.includes("2"),
      );
      fireEvent.click(aiButton);

      await waitFor(() => {
        expect(screen.queryByText("Food Bank Tampa")).not.toBeInTheDocument();
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
        expect(screen.getByText("LLM Recommended")).toBeInTheDocument();
      });
    });

    it("filters to show only Registered organizations", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });

      // Click Registered filter button
      const filterButtons = screen.getAllByRole("button");
      const registeredButton = filterButtons.find(
        (btn) =>
          btn.textContent.includes("Registered") &&
          btn.textContent.includes("1"),
      );
      fireEvent.click(registeredButton);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
        expect(screen.queryByText("AI Suggested Org")).not.toBeInTheDocument();
        expect(screen.queryByText("LLM Recommended")).not.toBeInTheDocument();
      });
    });

    it("displays correct source counts", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        // All = 3, AI = 2, Registered = 1
        expect(screen.getByText("3")).toBeInTheDocument(); // All count
        expect(screen.getByText("2")).toBeInTheDocument(); // AI count
        expect(screen.getByText("1")).toBeInTheDocument(); // Registered count
      });
    });
  });

  describe("Search Functionality", () => {
    beforeEach(async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("filters organizations by search term", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search organizations/i);
      fireEvent.change(searchInput, { target: { value: "Tampa" } });

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
        expect(screen.queryByText("AI Suggested Org")).not.toBeInTheDocument();
      });
    });

    it("shows no results message when search has no matches", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search organizations/i);
      fireEvent.change(searchInput, { target: { value: "zzzznonexistent" } });

      await waitFor(() => {
        expect(screen.getByText("No Matching Results")).toBeInTheDocument();
      });
    });

    it("has clear search button when search term exists", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank Tampa")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search organizations/i);
      fireEvent.change(searchInput, { target: { value: "test" } });

      expect(screen.getByText("✕")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    beforeEach(async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("navigates back when back button is clicked", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("BACK")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("BACK"));

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it("navigates to dashboard when go to dashboard button is clicked", async () => {
      mockLocation.state = {};

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Go to Dashboard"));

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("Category Display", () => {
    it("displays category name from string", async () => {
      mockLocation.state = {
        category: "FOOD_ASSISTANCE",
        description: "test",
      };
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText(/food assistance/i)).toBeInTheDocument();
      });
    });

    it("displays category name from object with name property", async () => {
      mockLocation.state = {
        category: { name: "Food Help" },
        description: "test",
      };
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText(/food help/i)).toBeInTheDocument();
      });
    });
  });

  describe("Empty Results", () => {
    it("shows no organizations found message when API returns empty array", async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: [] });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("No Organizations Found")).toBeInTheDocument();
      });
    });
  });

  describe("Website Links", () => {
    beforeEach(async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("renders visit website links", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        const visitLinks = screen.getAllByText("Visit Website");
        expect(visitLinks.length).toBe(3);
      });
    });

    it("website links open in new tab", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        const links = document.querySelectorAll('a[target="_blank"]');
        expect(links.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Source Badge Logic", () => {
    it("treats genai as AI source", async () => {
      const orgsWithGenai = [
        { name: "GenAI Org", db_or_ai: "genai", location: "FL" },
      ];
      getVolunteerOrgsList.mockResolvedValue({ body: orgsWithGenai });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        // Check that AI Suggested appears (in badge and/or filter)
        const aiSuggestedElements = screen.getAllByText("AI Suggested");
        expect(aiSuggestedElements.length).toBeGreaterThan(0);
      });
    });

    it("treats missing db_or_ai as db source", async () => {
      const orgsWithoutSource = [
        { name: "Unknown Source Org", location: "FL" },
      ];
      getVolunteerOrgsList.mockResolvedValue({ body: orgsWithoutSource });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        // Check that Registered appears (in badge and/or filter)
        const registeredElements = screen.getAllByText("Registered");
        expect(registeredElements.length).toBeGreaterThan(0);
      });
    });

    it("treats database as db source", async () => {
      const orgsWithDatabase = [
        { name: "Database Org", db_or_ai: "database", location: "FL" },
      ];
      getVolunteerOrgsList.mockResolvedValue({ body: orgsWithDatabase });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        // Check that Registered appears (in badge and/or filter)
        const registeredElements = screen.getAllByText("Registered");
        expect(registeredElements.length).toBeGreaterThan(0);
      });
    });
  });
});
