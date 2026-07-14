import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "./BreadCrumbs";

// The repo-wide __mocks__/react-router-dom.jsx replaces the router; this
// component needs the real useLocation/Link/MemoryRouter to be tested.
jest.mock("react-router-dom", () => jest.requireActual("react-router-dom"));
import {
  DASHBOARD_BREADCRUMB,
  buildBreadcrumbTrail,
  createRequestDetailsCrumb,
  createRequestDetailsTrail,
  createOrganizationsPageState,
  createOrganizationDetailsTrail,
} from "./breadcrumbUtils";

const renderAt = (entry) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );

describe("Breadcrumbs", () => {
  it("renders nothing on hidden routes", () => {
    const hiddenRoutes = [
      "/",
      "/home",
      "/login",
      "/signup",
      "/forgot-password",
      "/verify-account",
      "/verify-otp",
    ];
    hiddenRoutes.forEach((route) => {
      const { container, unmount } = renderAt(route);
      expect(container.querySelector(".breadcrumb-nav")).toBeNull();
      unmount();
    });
  });

  it("renders a translated Home crumb", () => {
    renderAt("/dashboard");
    expect(screen.getByText("mockTranslate(HOME)")).toBeTruthy();
  });

  it("renders the dashboard as a single active crumb", () => {
    renderAt("/dashboard");
    expect(screen.getByText("mockTranslate(DASHBOARD)")).toBeTruthy();
  });

  it.each([
    ["/request", "CREATE_HELP_REQUEST"],
    ["/request/123", "REQUEST_DETAILS"],
    ["/promote-to-volunteer", "PROMOTE_TO_VOLUNTEER"],
    ["/emergency-contact", "EMERGENCY_CONTACT"],
    ["/voluntary-organizations", "ORGANIZATIONS"],
    ["/profile", "PROFILE"],
  ])(
    "renders %s under the Dashboard section with key %s",
    (route, expectedKey) => {
      renderAt(route);
      expect(screen.getByText("mockTranslate(DASHBOARD)")).toBeTruthy();
      expect(screen.getByText(`mockTranslate(${expectedKey})`)).toBeTruthy();
    },
  );

  it.each([
    ["/our-team", "ABOUT", "OUR_TEAM"],
    ["/our-mission", "ABOUT", "OUR_MISSION"],
    ["/news-our-stories", "ABOUT", "IN_THE_NEWS"],
    ["/how-we-operate", "VOLUNTEER_SERVICES", "HOW_WE_OPERATE"],
    ["/collaborators", "VOLUNTEER_SERVICES", "OUR_COLLABORATORS"],
  ])(
    "renders %s under parent key %s with page key %s",
    (route, parent, page) => {
      renderAt(route);
      expect(screen.getByText(`mockTranslate(${parent})`)).toBeTruthy();
      expect(screen.getByText(`mockTranslate(${page})`)).toBeTruthy();
    },
  );

  it.each([
    ["/contact", "CONTACT"],
    ["/notifications", "NOTIFICATIONS"],
    ["/donate", "DONATE"],
  ])(
    "renders standalone page %s as a single crumb with key %s",
    (route, key) => {
      renderAt(route);
      expect(screen.getByText(`mockTranslate(${key})`)).toBeTruthy();
    },
  );

  it.each([
    ["/terms-and-conditions", "TERMS_AND_CONDITIONS"],
    ["/privacy-policy", "PRIVACY_POLICY"],
    ["/sitemap", "SITEMAP"],
    ["/thanks", "THANKS"],
    ["/benevity", "BENEVITY"],
  ])("renders section page %s with key %s", (route, key) => {
    renderAt(route);
    expect(screen.getByText(`mockTranslate(${key})`)).toBeTruthy();
  });

  it("renders the organization name from navigation state on organization routes", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/organization/42",
            state: { organizationData: { Name: "Helping Hands" } },
          },
        ]}
      >
        <Breadcrumbs />
      </MemoryRouter>,
    );
    expect(screen.getByText("mockTranslate(Helping Hands)")).toBeTruthy();
  });

  it("falls back to the ORGANIZATION_DETAILS key when no organization name is passed", () => {
    renderAt("/organization/42");
    expect(
      screen.getByText("mockTranslate(ORGANIZATION_DETAILS)"),
    ).toBeTruthy();
  });

  it("prettifies unknown route segments as a fallback label", () => {
    renderAt("/some-unknown-page");
    expect(screen.getByText("mockTranslate(Some Unknown Page)")).toBeTruthy();
  });

  it("renders a breadcrumb trail passed through navigation state with links", () => {
    const trail = createRequestDetailsTrail({ requestId: "99" });
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/request/99", state: { breadcrumbTrail: trail } },
        ]}
      >
        <Breadcrumbs />
      </MemoryRouter>,
    );
    const dashboardLink = screen.getByText("mockTranslate(DASHBOARD)");
    expect(dashboardLink.closest("a").getAttribute("href")).toBe("/dashboard");
    expect(screen.getByText("mockTranslate(REQUEST_DETAILS)")).toBeTruthy();
  });
});

describe("breadcrumbUtils", () => {
  it("uses the DASHBOARD translation key for the dashboard crumb", () => {
    expect(DASHBOARD_BREADCRUMB).toEqual({
      label: "DASHBOARD",
      path: "/dashboard",
    });
  });

  it("filters out items without labels when building a trail", () => {
    const trail = buildBreadcrumbTrail(
      DASHBOARD_BREADCRUMB,
      null,
      { path: "/no-label" },
      { label: "OK" },
    );
    expect(trail).toEqual([DASHBOARD_BREADCRUMB, { label: "OK" }]);
  });

  it("creates a request details crumb with the REQUEST_DETAILS key by default", () => {
    const crumb = createRequestDetailsCrumb({
      requestId: "7",
      requestData: { breadcrumbTrail: ["stale"], subject: "Food" },
    });
    expect(crumb.label).toBe("REQUEST_DETAILS");
    expect(crumb.path).toBe("/request/7");
    expect(crumb.state).toEqual({ subject: "Food" });
  });

  it("creates the organizations page state with translation keys", () => {
    const state = createOrganizationsPageState({ requestId: "7" });
    expect(state.breadcrumbTrail.map((item) => item.label)).toEqual([
      "DASHBOARD",
      "REQUEST_DETAILS",
      "ORGANIZATIONS",
    ]);
  });

  it("uses the organization name when provided and the key as fallback", () => {
    const named = createOrganizationDetailsTrail({
      organizationName: "Helping Hands",
      requestId: "7",
    });
    expect(named[named.length - 1].label).toBe("Helping Hands");

    const fallback = createOrganizationDetailsTrail({ requestId: "7" });
    expect(fallback[fallback.length - 1].label).toBe("ORGANIZATION_DETAILS");
  });
});
