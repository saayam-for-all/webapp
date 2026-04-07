import { render } from "@testing-library/react";
import VerticalAd from "./VerticalAd";

describe("VerticlaeAd Component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Reset the global adsbygoogle mock before each test
    window.adsbygoogle = { push: jest.fn() };

    // Mock window.location
    delete window.location;
    window.location = { ...originalLocation, hostname: "" };
  });

  afterAll(() => {
    // Restore original window.location after all tests
    window.location = originalLocation;
  });

  test("calls adsbygoogle.push when hostname is saayamforall.org", () => {
    // 1. Set hostname to match production
    window.location.hostname = "saayamforall.org";

    render(<VerticalAd />);

    // 2. Check if push was called
    expect(window.adsbygoogle.push).toHaveBeenCalledTimes(1);
    expect(window.adsbygoogle.push).toHaveBeenCalledWith({});
  });

  test("does NOT call adsbygoogle.push on localhost", () => {
    // 1. Set hostname to localhost
    window.location.hostname = "localhost";

    render(<VerticalAd />);

    // 2. Check that push was never called
    expect(window.adsbygoogle.push).not.toHaveBeenCalled();
  });
});
