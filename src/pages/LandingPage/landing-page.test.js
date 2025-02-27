import { renderWithProviders } from "#utils/test-utils.jsx";
import LandingPage from "./LandingPage";

// Mock internal dependencies
jest.mock("react-router");

// Mock custom components
jest.mock("./components/HeroSection");
jest.mock("./components/Info");
jest.mock("./components/Dynamic_img");

describe("LandingPage", () => {
  it("renders correctly", () => {
    const tree = renderWithProviders(<LandingPage />);
    expect(tree).toMatchSnapshot();
  });
});
