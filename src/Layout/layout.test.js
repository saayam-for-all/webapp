//Mock IntersectionObserver for Scroll To Top Button
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    this.callback([{ isIntersecting: false }]);
  }
  unobserve() {}
  disconnect() {}
};

import { render } from "@testing-library/react";
import Layout from "./Layout";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({ children }) => <mock-suspense>{children}</mock-suspense>,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useMatches: () => [{ pathname: "/", params: {} }],
}));

// Mock all the custom components because they have their own snapshot tests
jest.mock("#components/Loader/MainLoader");
jest.mock("#components/Navbar/Navbar");
jest.mock("#components/Footer/Footer");
jest.mock("#components/LeftAds/LeftAds");
jest.mock("#components/RightAds/RightAds");
jest.mock("#components/NavigationGuard/NavigationGuard");

// Must match AD_RAILS_QUERY in Layout.jsx. Asserted explicitly below: the mock
// answers any query, so a regression to a width-only breakpoint would otherwise
// still pass every test here and re-enable rails on touch-oriented tablets.
const AD_RAILS_QUERY =
  "(min-width: 992px) and (hover: hover) and (pointer: fine)";

// Same shape as how-we-operate.test.js, but the match result is driven per test
// so both sides of the ad-rail breakpoint can be asserted.
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe("Layout", () => {
  it("renders correctly", () => {
    mockMatchMedia(true);

    const tree = render(<Layout />);

    expect(tree).toMatchSnapshot();
  });

  it("renders both ad rails at or above the breakpoint", () => {
    mockMatchMedia(true);

    const { container } = render(<Layout />);

    expect(container.querySelectorAll("aside")).toHaveLength(2);
  });

  it("gates the ad rails on the desktop-input media query specifically", () => {
    mockMatchMedia(true);

    render(<Layout />);

    expect(window.matchMedia).toHaveBeenCalledWith(AD_RAILS_QUERY);
  });

  // The rails must be absent from the DOM rather than CSS-hidden: a mounted
  // AdSlot still calls adsbygoogle.push() into a zero-width box, which yields
  // "No slot size for availableWidth=0" and four unfillable ad requests.
  it("does not render the ad rails below the breakpoint", () => {
    mockMatchMedia(false);

    const { container } = render(<Layout />);

    expect(container.querySelectorAll("aside")).toHaveLength(0);
  });
});
