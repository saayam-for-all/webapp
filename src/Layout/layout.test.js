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
import { MemoryRouter } from "react-router-dom";
import Layout from "./Layout";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  Suspense: ({ children }) => <mock-suspense>{children}</mock-suspense>,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useMatches: () => [
    { pathname: "/dashboard", params: {}, handle: { leaveAdSpace: true } },
  ],
  Outlet: () => <div>Outlet</div>,
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
    const tree = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Layout />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });

  it("renders both ad rails", () => {
    const { container } = render(<Layout />);

    expect(container.querySelectorAll("aside")).toHaveLength(2);
  });
});
