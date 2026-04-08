import { renderWithProviders } from "#utils/test-utils.jsx";
import LandingPage from "./LandingPage";

// Mock internal dependencies
jest.mock("react-router");

jest.mock("./components/Carousel");

jest.mock("./components/MetricsTicker", () => () => (
  <div data-testid="metrics-ticker" />
));

// Mock fetch API for MetricsTicker
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        total_requests: 0,
        requests_resolved: 0,
        total_volunteers: 0,
        total_beneficiaries: 0,
      }),
  }),
);

describe("LandingPage", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders correctly", () => {
    const tree = renderWithProviders(<LandingPage />);
    expect(tree).toMatchSnapshot();
  });
});
