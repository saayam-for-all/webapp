import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VoluntaryOrganizations from "./VoluntaryOrganizations";
import { getVolunteerOrgsList } from "../../services/volunteerServices";

jest.mock("../../services/volunteerServices");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    state: {
      category: "FOOD",
      subject: "Food assistance",
      description: "Need food help",
      location: "New York",
    },
  }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockOrganizations = [
  {
    id: "1",
    name: "Food Bank NYC",
    location: "New York, NY",
    contact: "555-1234",
    email: "contact@foodbank.org",
    web_url: "https://foodbank.org",
    db_or_ai: "db",
  },
  {
    id: "2",
    name: "AI Suggested Org",
    location: "Brooklyn, NY",
    contact: "555-5678",
    email: "ai@suggested.org",
    web_url: "https://aisuggested.org",
    db_or_ai: "llm",
  },
];

describe("VoluntaryOrganizations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Lambda response parsing", () => {
    it("parses response when body is an array", async () => {
      getVolunteerOrgsList.mockResolvedValue({
        statusCode: 200,
        body: mockOrganizations,
      });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
      });
    });

    it("parses response when body is stringified JSON", async () => {
      getVolunteerOrgsList.mockResolvedValue({
        statusCode: 200,
        body: JSON.stringify(mockOrganizations),
      });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
      });
    });

    it("parses response when data is a direct array", async () => {
      getVolunteerOrgsList.mockResolvedValue(mockOrganizations);

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
      });
    });
  });

  describe("Card-based UI", () => {
    beforeEach(() => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("renders organization cards with name, location, contact, email", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
        expect(screen.getByText("New York, NY")).toBeInTheDocument();
        expect(screen.getByText("555-1234")).toBeInTheDocument();
        expect(screen.getByText("contact@foodbank.org")).toBeInTheDocument();
      });
    });

    it("renders website links", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        const visitLinks = screen.getAllByText("Visit Website");
        expect(visitLinks.length).toBeGreaterThan(0);
      });
    });

    it("displays source badges for AI and DB organizations", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getAllByText("Registered").length).toBeGreaterThan(0);
        expect(screen.getAllByText("AI Suggested").length).toBeGreaterThan(0);
      });
    });
  });

  describe("Source filtering", () => {
    beforeEach(() => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("shows all organizations by default", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
      });
    });

    it("filters to show only AI suggested organizations", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
      });

      const aiFilterButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent.includes("AI Suggested"));
      fireEvent.click(aiFilterButton);

      await waitFor(() => {
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
        expect(screen.queryByText("Food Bank NYC")).not.toBeInTheDocument();
      });
    });

    it("filters to show only registered organizations", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
      });

      const dbFilterButton = screen
        .getAllByRole("button")
        .find(
          (btn) =>
            btn.textContent.includes("Registered") &&
            !btn.textContent.includes("AI"),
        );
      fireEvent.click(dbFilterButton);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
        expect(screen.queryByText("AI Suggested Org")).not.toBeInTheDocument();
      });
    });
  });

  describe("Search functionality", () => {
    beforeEach(() => {
      getVolunteerOrgsList.mockResolvedValue({ body: mockOrganizations });
    });

    it("filters organizations by search term", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search organizations/i);
      fireEvent.change(searchInput, { target: { value: "Brooklyn" } });

      await waitFor(() => {
        expect(screen.getByText("AI Suggested Org")).toBeInTheDocument();
        expect(screen.queryByText("Food Bank NYC")).not.toBeInTheDocument();
      });
    });

    it("shows no results message when search has no matches", async () => {
      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(screen.getByText("Food Bank NYC")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search organizations/i);
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      await waitFor(() => {
        expect(screen.getByText("No Matching Results")).toBeInTheDocument();
      });
    });
  });

  describe("Loading and error states", () => {
    it("shows loading skeleton while fetching", async () => {
      getVolunteerOrgsList.mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );

      render(<VoluntaryOrganizations />);

      expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("shows error message on API failure", async () => {
      getVolunteerOrgsList.mockRejectedValue(new Error("API Error"));

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load organizations. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("API call", () => {
    it("calls getVolunteerOrgsList with correct payload", async () => {
      getVolunteerOrgsList.mockResolvedValue({ body: [] });

      render(<VoluntaryOrganizations />);

      await waitFor(() => {
        expect(getVolunteerOrgsList).toHaveBeenCalledWith({
          category: "FOOD",
          subject: "Food assistance",
          description: "Need food help",
          location: "New York",
        });
      });
    });
  });
});
