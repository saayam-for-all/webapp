import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VoluntaryOrganizations from "./VoluntaryOrganizations";
import * as volunteerServices from "../../services/volunteerServices";
import * as reactRouterDom from "react-router-dom";

// Mock the volunteerServices
jest.mock("../../services/volunteerServices");

// Mock react-router-dom hooks
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const defaultLocationState = {
  category: "FOOD",
  description: "Need food assistance",
  location: "Tampa, FL",
};

describe("VoluntaryOrganizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reactRouterDom.useLocation.mockReturnValue({ state: defaultLocationState });
  });

  describe("Lambda response parsing", () => {
    it("parses response with body array from Lambda", async () => {
      const mockOrgs = [
        { name: "Test Org", location: "Tampa", db_or_ai: "db" },
      ];
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        statusCode: 200,
        body: mockOrgs,
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Test Org")).toBeInTheDocument();
      });
    });

    it("parses stringified JSON body from Lambda", async () => {
      const mockOrgs = [{ name: "Stringified Org", location: "Miami" }];
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify(mockOrgs),
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Stringified Org")).toBeInTheDocument();
      });
    });

    it("shows error when body contains invalid JSON string", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        statusCode: 200,
        body: "not valid json {{{",
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load organizations. Please try again."),
        ).toBeInTheDocument();
      });
    });

    it("handles direct array response", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue([
        { name: "Direct Org", location: "Tampa" },
      ]);

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Direct Org")).toBeInTheDocument();
      });
    });

    it("handles empty/invalid response gracefully", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({});

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("No Organizations Found")).toBeInTheDocument();
      });
    });
  });

  describe("API payload construction", () => {
    it("sends correct payload with category, subject, description, location", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({ body: [] });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(volunteerServices.getVolunteerOrgsList).toHaveBeenCalledWith({
          category: "FOOD",
          subject: "FOOD",
          description: "Need food assistance",
          location: "Tampa, FL",
        });
      });
    });

    it("handles category as object with name property", async () => {
      reactRouterDom.useLocation.mockReturnValue({
        state: {
          category: { name: "Food Assistance", catName: "FOOD_CAT" },
          description: "Test description",
        },
      });
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({ body: [] });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(volunteerServices.getVolunteerOrgsList).toHaveBeenCalledWith(
          expect.objectContaining({
            category: "Food Assistance",
          }),
        );
      });
    });
  });

  describe("Organization card UI", () => {
    it("displays organization details in card format", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [
          {
            name: "Help Center",
            location: "Orlando, FL",
            contact: "555-1234",
            email: "help@center.org",
            web_url: "https://helpcenter.org",
            mission: "Serving the community",
            db_or_ai: "db",
          },
        ],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Help Center")).toBeInTheDocument();
        expect(screen.getByText("Orlando, FL")).toBeInTheDocument();
        expect(screen.getByText("555-1234")).toBeInTheDocument();
        expect(screen.getByText("help@center.org")).toBeInTheDocument();
        expect(screen.getByText("Visit Website")).toBeInTheDocument();
        // Mission is displayed in quotes
        expect(screen.getByText('"Serving the community"')).toBeInTheDocument();
      });
    });

    it("renders website link with correct href", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [{ name: "Org", web_url: "https://example.org", db_or_ai: "db" }],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const link = screen.getByText("Visit Website").closest("a");
        expect(link).toHaveAttribute("href", "https://example.org");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("renders clickable phone number link", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [{ name: "Org", contact: "555-123-4567", db_or_ai: "db" }],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const phoneLink = screen.getByText("555-123-4567").closest("a");
        expect(phoneLink).toHaveAttribute("href", "tel:5551234567");
      });
    });

    it("renders clickable email link", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [{ name: "Org", email: "test@org.com", db_or_ai: "db" }],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        const emailLink = screen.getByText("test@org.com").closest("a");
        expect(emailLink).toHaveAttribute("href", "mailto:test@org.com");
      });
    });
  });

  describe("Source filtering (AI vs DB)", () => {
    const mixedOrgs = [
      { name: "DB Org 1", db_or_ai: "db" },
      { name: "DB Org 2", db_or_ai: "database" },
      { name: "AI Org 1", db_or_ai: "llm" },
      { name: "AI Org 2", db_or_ai: "ai" },
      { name: "AI Org 3", db_or_ai: "genai" },
    ];

    beforeEach(() => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: mixedOrgs,
      });
    });

    it("displays all organizations by default", async () => {
      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("DB Org 1")).toBeInTheDocument();
        expect(screen.getByText("DB Org 2")).toBeInTheDocument();
        expect(screen.getByText("AI Org 1")).toBeInTheDocument();
        expect(screen.getByText("AI Org 2")).toBeInTheDocument();
        expect(screen.getByText("AI Org 3")).toBeInTheDocument();
      });
    });

    it("clicking AI filter hides DB organizations", async () => {
      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("AI Org 1")).toBeInTheDocument();
      });

      // Find and click AI filter button (contains "AI Suggested" text and count "3")
      const buttons = screen.getAllByRole("button");
      const aiButton = buttons.find(
        (btn) =>
          btn.textContent.includes("AI Suggested") &&
          btn.textContent.includes("3"),
      );
      fireEvent.click(aiButton);

      await waitFor(() => {
        // AI orgs should still be visible
        expect(screen.getByText("AI Org 1")).toBeInTheDocument();
        expect(screen.getByText("AI Org 2")).toBeInTheDocument();
        expect(screen.getByText("AI Org 3")).toBeInTheDocument();
        // DB orgs should be hidden
        expect(screen.queryByText("DB Org 1")).not.toBeInTheDocument();
        expect(screen.queryByText("DB Org 2")).not.toBeInTheDocument();
      });
    });

    it("clicking DB filter hides AI organizations", async () => {
      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("DB Org 1")).toBeInTheDocument();
      });

      // Find and click Registered filter button (contains "Registered" text and count "2")
      const buttons = screen.getAllByRole("button");
      const dbButton = buttons.find(
        (btn) =>
          btn.textContent.includes("Registered") &&
          btn.textContent.includes("2"),
      );
      fireEvent.click(dbButton);

      await waitFor(() => {
        // DB orgs should still be visible
        expect(screen.getByText("DB Org 1")).toBeInTheDocument();
        expect(screen.getByText("DB Org 2")).toBeInTheDocument();
        // AI orgs should be hidden
        expect(screen.queryByText("AI Org 1")).not.toBeInTheDocument();
        expect(screen.queryByText("AI Org 2")).not.toBeInTheDocument();
        expect(screen.queryByText("AI Org 3")).not.toBeInTheDocument();
      });
    });

    it("shows correct counts for each filter", async () => {
      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        // All button should show 5
        const allButton = screen.getByText("All").closest("button");
        expect(allButton.textContent).toContain("5");

        // AI filter should show 3 (llm, ai, genai)
        const buttons = screen.getAllByRole("button");
        const aiButton = buttons.find((btn) =>
          btn.textContent.includes("AI Suggested"),
        );
        expect(aiButton.textContent).toContain("3");

        // Registered filter should show 2 (db, database)
        const dbButton = buttons.find((btn) =>
          btn.textContent.includes("Registered"),
        );
        expect(dbButton.textContent).toContain("2");
      });
    });
  });

  describe("Search functionality", () => {
    it("filters organizations by name", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [
          { name: "Food Pantry", location: "Tampa" },
          { name: "Shelter", location: "Tampa" },
        ],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Food Pantry")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search organizations/i);
      fireEvent.change(searchInput, { target: { value: "Food" } });

      await waitFor(() => {
        expect(screen.getByText("Food Pantry")).toBeInTheDocument();
        expect(screen.queryByText("Shelter")).not.toBeInTheDocument();
      });
    });

    it("filters organizations by location", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [
          { name: "Org A", location: "Tampa" },
          { name: "Org B", location: "Orlando" },
        ],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Org A")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search organizations/i);
      fireEvent.change(searchInput, { target: { value: "Orlando" } });

      await waitFor(() => {
        expect(screen.queryByText("Org A")).not.toBeInTheDocument();
        expect(screen.getByText("Org B")).toBeInTheDocument();
      });
    });

    it("search is case-insensitive", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [{ name: "FOOD BANK", location: "Tampa" }],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("FOOD BANK")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search organizations/i);
      fireEvent.change(searchInput, { target: { value: "food bank" } });

      await waitFor(() => {
        expect(screen.getByText("FOOD BANK")).toBeInTheDocument();
      });
    });

    it("clear search button resets results", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({
        body: [
          { name: "Org A", location: "Tampa" },
          { name: "Org B", location: "Orlando" },
        ],
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Org A")).toBeInTheDocument();
      });

      // Type in search to filter
      const searchInput = screen.getByPlaceholderText(/Search organizations/i);
      fireEvent.change(searchInput, { target: { value: "Orlando" } });

      await waitFor(() => {
        expect(screen.queryByText("Org A")).not.toBeInTheDocument();
      });

      // Click clear button (✕)
      const clearButton = screen.getByText("✕");
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText("Org A")).toBeInTheDocument();
        expect(screen.getByText("Org B")).toBeInTheDocument();
      });
    });
  });

  describe("Error handling", () => {
    it("shows error message when API fails", async () => {
      volunteerServices.getVolunteerOrgsList.mockRejectedValue(
        new Error("Network error"),
      );

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load organizations. Please try again."),
        ).toBeInTheDocument();
        expect(screen.getByText("Try Again")).toBeInTheDocument();
      });
    });

    it("Try Again button retries the API call", async () => {
      volunteerServices.getVolunteerOrgsList
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ body: [{ name: "Success Org" }] });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Try Again")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Try Again"));

      await waitFor(() => {
        expect(screen.getByText("Success Org")).toBeInTheDocument();
      });

      // API should have been called twice
      expect(volunteerServices.getVolunteerOrgsList).toHaveBeenCalledTimes(2);
    });
  });

  describe("Request data validation", () => {
    it("shows message when no request data is provided", async () => {
      reactRouterDom.useLocation.mockReturnValue({ state: null });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          screen.getByText("Request Details Required"),
        ).toBeInTheDocument();
      });
    });

    it("shows message when category and description are empty", async () => {
      reactRouterDom.useLocation.mockReturnValue({
        state: { category: "", description: "", location: "Tampa" },
      });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(
          screen.getByText("Request Details Required"),
        ).toBeInTheDocument();
      });

      // API should NOT be called when no required data
      expect(volunteerServices.getVolunteerOrgsList).not.toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    it("back button calls navigate(-1)", async () => {
      volunteerServices.getVolunteerOrgsList.mockResolvedValue({ body: [] });

      render(
        <MemoryRouter>
          <VoluntaryOrganizations />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("BACK")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("BACK"));

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
