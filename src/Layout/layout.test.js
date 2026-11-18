import { render } from "@testing-library/react";
import Layout from "./Layout";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  // eslint-disable-next-line react/prop-types -- Test replacement for React's Suspense.
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

describe("Layout", () => {
  it("renders correctly", () => {
    const tree = render(<Layout />);

    expect(tree).toMatchSnapshot();
  });

  it("preserves both main-branch ad rails", () => {
    const { container } = render(<Layout />);

    expect(container.querySelectorAll("aside")).toHaveLength(2);
    expect(container.querySelector("mock-left-ads")).toBeTruthy();
    expect(container.querySelector("mock-right-ads")).toBeTruthy();
  });

  it("uses document scrolling so the scroll-to-top button targets the page", () => {
    const { container } = render(<Layout />);
    const main = container.querySelector("main");

    expect(main.classList.contains("overflow-auto")).toBe(false);
    expect(main.classList.contains("min-w-0")).toBe(true);
  });
});
