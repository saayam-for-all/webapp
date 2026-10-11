import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import OrganizationDetails from "./OrganizationDetails";

let mockLocationState;

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: mockLocationState }),
}));

describe("OrganizationDetails - Issue #1301", () => {
  beforeEach(() => {
    mockLocationState = undefined;
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

  it("shows an error when no organization was provided", () => {
    render(<OrganizationDetails />);

    expect(screen.getByText("Organization not found")).toBeInTheDocument();
  });
});
