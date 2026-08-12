import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ApplicantProfile from "./ApplicantProfile";

const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  useLocation: () => mockUseLocation(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("ApplicantProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays selected applicant information", () => {
    mockUseLocation.mockReturnValue({
      state: {
        applicant: {
          name: "Jane Cooper",
          email: "jane@microsoft.com",
          phone: "(225) 555-0118",
          location: "Boston, USA",
          cause: "Cooking",
          rating: "★★★★★",
          dateAdded: "2023-10-01",
        },
      },
    });

    render(<ApplicantProfile />);

    expect(
      screen.getByRole("heading", { name: "Jane Cooper" }),
    ).toBeInTheDocument();

    expect(screen.getByText("jane@microsoft.com")).toBeInTheDocument();
    expect(screen.getByText("(225) 555-0118")).toBeInTheDocument();
    expect(screen.getByText("Boston, USA")).toBeInTheDocument();
    expect(screen.getByText("Cooking")).toBeInTheDocument();
    expect(screen.getByText("★★★★★")).toBeInTheDocument();
    expect(screen.getByText("2023-10-01")).toBeInTheDocument();
  });

  test("shows unavailable message when applicant data is missing", () => {
    mockUseLocation.mockReturnValue({
      state: null,
    });

    render(<ApplicantProfile />);

    expect(
      screen.getByText("Applicant information is unavailable."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Back to Steward Dashboard",
      }),
    ).toHaveAttribute("href", "/dashboard?view=steward");
  });
});
