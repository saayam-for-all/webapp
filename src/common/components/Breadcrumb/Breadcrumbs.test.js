import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DynamicBreadcrumbs from "#components/Breadcrumb/Breadcrumbs";
import * as router from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  Link: ({ children }) => <a>{children}</a>,
}));

jest.mock("@mui/material/Breadcrumbs", () => ({ children }) => (
  <nav>{children}</nav>
));
jest.mock("@mui/material/Typography", () => ({ children }) => (
  <span>{children}</span>
));
jest.mock("@mui/material/Link", () => ({ children }) => <a>{children}</a>);
jest.mock("@mui/icons-material/NavigateNext", () => () => <span>/</span>);

describe("DynamicBreadcrumbs", () => {
  test("renders Home breadcrumb", () => {
    router.useLocation.mockReturnValue({ pathname: "/" });

    render(<DynamicBreadcrumbs />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders nested breadcrumbs", () => {
    router.useLocation.mockReturnValue({
      pathname: "/dashboard/profile",
    });

    render(<DynamicBreadcrumbs />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("formats hyphenated route correctly", () => {
    router.useLocation.mockReturnValue({
      pathname: "/promote-to-volunteer",
    });

    render(<DynamicBreadcrumbs />);

    expect(screen.getByText("Promote To-Volunteer")).toBeInTheDocument();
  });
});
