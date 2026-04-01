import { renderWithProviders } from "#utils/test-utils.jsx";
import { waitFor } from "@testing-library/react";
import LandingPage from "./LandingPage";

// Mock internal dependencies
jest.mock("react-router");

jest.mock("./components/Carousel");

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

  it("renders correctly", async () => {
    const view = renderWithProviders(<LandingPage />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    expect(view).toMatchSnapshot();
  });
});
