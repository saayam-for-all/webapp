import { renderWithProviders } from "#utils/test-utils.jsx";
import LandingPage from "./LandingPage";

// Mock internal dependencies
jest.mock("react-router");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useMatches: jest.fn().mockReturnValue([]),
}));

jest.mock("./components/Carousel");

jest.mock("./components/MetricsTicker", () => () => (
  <div data-testid="metrics-ticker" />
));

describe("LandingPage", () => {
  it("renders correctly", () => {
    const tree = renderWithProviders(<LandingPage />);
    expect(tree).toMatchSnapshot();
  });
});
