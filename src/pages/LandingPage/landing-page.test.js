import { renderWithProviders } from "#utils/test-utils.jsx";
import LandingPage from "./LandingPage";

// Mock internal dependencies
jest.mock("react-router");

jest.mock("./components/Carousel");

describe("LandingPage", () => {
  it("renders correctly", () => {
    const tree = renderWithProviders(<LandingPage />);
    expect(tree).toMatchSnapshot();
  });
});
