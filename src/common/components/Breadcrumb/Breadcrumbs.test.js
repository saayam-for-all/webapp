import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DynamicBreadcrumbs from "./Breadcrumbs";

describe("DynamicBreadcrumbs", () => {
  test("renders Home breadcrumb", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <DynamicBreadcrumbs />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders breadcrumbs for nested routes", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/profile"]}>
        <DynamicBreadcrumbs />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("last breadcrumb should not be a link", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <DynamicBreadcrumbs />
      </MemoryRouter>,
    );

    const dashboard = screen.getByText("Dashboard");
    expect(dashboard.closest("a")).toBeNull();
  });

  test("formats hyphenated route correctly", () => {
    render(
      <MemoryRouter initialEntries={["/promote-to-volunteer"]}>
        <DynamicBreadcrumbs />
      </MemoryRouter>,
    );

    expect(screen.getByText("Promote To Volunteer")).toBeInTheDocument();
  });
});
