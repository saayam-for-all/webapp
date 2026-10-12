import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fs from "fs";
import path from "path";
import Layout from "./Layout";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  // eslint-disable-next-line react/prop-types -- Test replacement for React's Suspense.
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

  it("uses document scrolling so the scroll-to-top button targets the page", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Layout />
      </MemoryRouter>,
    );

    const main = document.querySelector("main");
    expect(main.classList.contains("overflow-auto")).toBe(false);
    expect(main.classList.contains("min-w-0")).toBe(true);
  });

  it("collapses both side-rail containers below desktop sizes", () => {
    const stylesheet = fs.readFileSync(path.resolve("src/index.css"), "utf8");

    expect(stylesheet).toMatch(/@media\s+\(max-width:\s*1023px\)/);
    expect(stylesheet).toMatch(
      /\.left-ads-panel,\s*\.right-ads-panel\s*\{[^}]*display:\s*none\s*!important;[^}]*width:\s*0\s*!important;[^}]*min-width:\s*0\s*!important;[^}]*flex:\s*0 0 0\s*!important;/s,
    );
  });
});
