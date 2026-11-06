import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "#utils/test-utils.jsx";
import LandingPage from "./LandingPage";

const mockNavigate = jest.fn();

jest.mock("react-router", () => {
  const actual = jest.requireActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useMatches: jest.fn().mockReturnValue([]),
  };
});
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useMatches: jest.fn().mockReturnValue([]),
  };
});

jest.mock("./components/Carousel");

jest.mock("./components/MetricsTicker", () => () => (
  <div data-testid="metrics-ticker" />
));

describe("LandingPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders correctly", () => {
    const tree = renderWithProviders(<LandingPage />);
    expect(tree).toMatchSnapshot();
  });

  it("displays the main heading", () => {
    renderWithProviders(<LandingPage />);

    expect(
      screen.getByText("mockTranslate(Need help? Here to help?)"),
    ).toBeTruthy();
  });

  it("navigates to login when Join Our Community is clicked", () => {
    renderWithProviders(<LandingPage />);

    const button = screen.getByText("mockTranslate(Join our community)");

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
  it("navigates to Our Mission when Our Mission is clicked", () => {
    renderWithProviders(<LandingPage />);

    const button = screen.getByRole("button", {
      name: /mockTranslate\(Our Mission\)/,
    });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/our-mission");
  });
  it("navigates to How We Operate when Learn More is clicked", () => {
    renderWithProviders(<LandingPage />);

    const button = screen.getByRole("button", {
      name: /mockTranslate\(Learn More\)/,
    });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/how-we-operate");
  });
});
