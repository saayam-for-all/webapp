import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import fs from "fs";
import path from "path";
import Layout from "./Layout";

const ROUTER_FUTURE_FLAGS = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
};

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

const NavigationControls = () => {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate("/contact")}>
        Go to Contact Us
      </button>
      <button type="button" onClick={() => navigate("/?source=test")}>
        Change query
      </button>
    </>
  );
};

describe("Layout", () => {
  it("renders correctly", () => {
    const tree = render(
      <MemoryRouter
        initialEntries={["/dashboard"]}
        future={ROUTER_FUTURE_FLAGS}
      >
        <Layout />
      </MemoryRouter>,
    );
    expect(tree).toMatchSnapshot();
  });

  it("uses document scrolling so the scroll-to-top button targets the page", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard"]}
        future={ROUTER_FUTURE_FLAGS}
      >
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

  it("remounts both side rails when the route pathname changes", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]} future={ROUTER_FUTURE_FLAGS}>
        <NavigationControls />
        <Layout />
      </MemoryRouter>,
    );
    const initialLeftRail = container.querySelector("mock-left-ads");
    const initialRightRail = container.querySelector("mock-right-ads");

    fireEvent.click(screen.getByRole("button", { name: "Go to Contact Us" }));

    expect(container.querySelector("mock-left-ads")).not.toBe(initialLeftRail);
    expect(container.querySelector("mock-right-ads")).not.toBe(
      initialRightRail,
    );
  });

  it("keeps both side rails mounted when only query parameters change", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]} future={ROUTER_FUTURE_FLAGS}>
        <NavigationControls />
        <Layout />
      </MemoryRouter>,
    );
    const initialLeftRail = container.querySelector("mock-left-ads");
    const initialRightRail = container.querySelector("mock-right-ads");

    fireEvent.click(screen.getByRole("button", { name: "Change query" }));

    expect(container.querySelector("mock-left-ads")).toBe(initialLeftRail);
    expect(container.querySelector("mock-right-ads")).toBe(initialRightRail);
  });
});
