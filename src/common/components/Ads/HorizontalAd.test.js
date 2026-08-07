import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import useShowAds from "../../../hooks/useShowAds";
import HorizontalAd from "./HorizontalAd";

jest.mock("../../../hooks/useShowAds", () => jest.fn());

describe("HorizontalAd Component", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    window.adsbygoogle = { push: jest.fn() };
    delete window.location;
    window.location = { ...originalLocation, hostname: "" };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  describe("when ads are disabled (useShowAds returns false)", () => {
    beforeEach(() => {
      useShowAds.mockReturnValue(false);
    });

    it("renders nothing", () => {
      const { container } = render(<HorizontalAd />);
      expect(container.firstChild).toBeNull();
    });

    it("does not call adsbygoogle.push even on production hostname", () => {
      window.location.hostname = "saayamforall.org";
      render(<HorizontalAd />);
      expect(window.adsbygoogle.push).not.toHaveBeenCalled();
    });
  });

  describe("when ads are enabled (useShowAds returns true)", () => {
    beforeEach(() => {
      useShowAds.mockReturnValue(true);
    });

    it("renders the ad element", () => {
      const { container } = render(<HorizontalAd />);
      expect(container.querySelector(".adsbygoogle")).toBeInTheDocument();
    });

    it("calls adsbygoogle.push when hostname is saayamforall.org", () => {
      window.location.hostname = "saayamforall.org";
      render(<HorizontalAd />);
      expect(window.adsbygoogle.push).toHaveBeenCalledTimes(1);
      expect(window.adsbygoogle.push).toHaveBeenCalledWith({});
    });

    it("does NOT call adsbygoogle.push on localhost", () => {
      window.location.hostname = "localhost";
      render(<HorizontalAd />);
      expect(window.adsbygoogle.push).not.toHaveBeenCalled();
    });
  });
});
