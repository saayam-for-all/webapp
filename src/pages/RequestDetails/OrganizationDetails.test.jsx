import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import OrganizationDetails from "./OrganizationDetails";

let mockLocationState;
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
}));

describe("OrganizationDetails - Issue #1301", () => {
  beforeEach(() => {
    mockLocationState = undefined;
    mockNavigate.mockClear();
  });

  it("displays the selected organization's Name field", () => {
    mockLocationState = {
      organizationData: {
        Name: "Helping Hands",
      },
    };

    render(<OrganizationDetails />);

    expect(
      screen.getByRole("heading", { name: "Helping Hands" }),
    ).toBeInTheDocument();
  });

  it("supports lowercase name from the API", () => {
    mockLocationState = {
      organizationData: {
        name: "Community Care",
      },
    };

    render(<OrganizationDetails />);

    expect(
      screen.getByRole("heading", { name: "Community Care" }),
    ).toBeInTheDocument();
  });

  it("uses the navigation name when the API record lacks a name", () => {
    mockLocationState = {
      organizationData: {},
      organizationName: "Local Food Bank",
    };

    render(<OrganizationDetails />);

    expect(
      screen.getByRole("heading", { name: "Local Food Bank" }),
    ).toBeInTheDocument();
  });

  it("renders location, contact, email, web_url, and mission from the API payload", () => {
    mockLocationState = {
      organizationData: {
        name: "American Red Cross",
        location: "1000 17th St NW, Washington, DC 20036",
        contact: "(202) 456-4000",
        email: "info@redcross.org",
        web_url: "https://www.redcross.org",
        mission:
          "To prevent and alleviate human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.",
        rating: 4.8,
      },
    };

    render(<OrganizationDetails />);

    expect(
      screen.getByRole("heading", { name: "American Red Cross" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("1000 17th St NW, Washington, DC 20036"),
    ).toBeInTheDocument();
    expect(screen.getByText("(202) 456-4000")).toBeInTheDocument();
    expect(screen.getByText("info@redcross.org")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "https://www.redcross.org" });
    expect(link).toHaveAttribute("href", "https://www.redcross.org");

    expect(
      screen.getByRole("heading", { name: "Organization Mission" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/To prevent and alleviate human suffering/i),
    ).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    mockLocationState = {
      organizationData: {
        name: "American Red Cross",
      },
    };

    render(<OrganizationDetails />);

    const backButton = screen.getByRole("button", {
      name: /Back to Organizations/i,
    });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("shows an error when no organization was provided", () => {
    render(<OrganizationDetails />);

    expect(screen.getByText("Organization not found")).toBeInTheDocument();
  });
});
