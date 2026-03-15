import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  if (currentPath === "/voluntary-organizations") {
    const trailFromState = location.state?.breadcrumbTrail || [];
    const trailFromSession = JSON.parse(
      sessionStorage.getItem("organizationBreadcrumbTrail") || "[]",
    );

    const effectiveTrail =
      trailFromState.length > 0 ? trailFromState : trailFromSession;

    if (effectiveTrail.length) {
      const normalizedTrail = effectiveTrail.map((item) => {
        if (item.label === "Voluntary Organizations" && !item.path) {
          return {
            ...item,
            path: "/voluntary-organizations",
          };
        }
        return item;
      });

      return (
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumbs">
            {normalizedTrail.map((item, index) => {
              const isLast = index === normalizedTrail.length - 1;

              return (
                <li
                  key={`${item.label}-${item.path || "no-path"}-${index}`}
                  className={`breadcrumb-item${isLast ? " active" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {!isLast && item.path ? (
                    <Link to={item.path} state={item.state}>
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      );
    }
  }

  if (currentPath.startsWith("/organization/")) {
    const storedTrail = JSON.parse(
      sessionStorage.getItem("organizationBreadcrumbTrail") || "[]",
    );

    if (storedTrail.length) {
      const normalizedTrail = storedTrail.map((item) => {
        if (item.label === "Voluntary Organizations" && !item.path) {
          return {
            ...item,
            path: "/voluntary-organizations",
          };
        }

        return item;
      });

      const fullTrail = [...normalizedTrail, { label: "Organization Details" }];

      return (
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumbs">
            {fullTrail.map((item, index) => {
              const isLast = index === fullTrail.length - 1;

              return (
                <li
                  key={`${item.label}-${item.path || "no-path"}-${index}`}
                  className={`breadcrumb-item${isLast ? " active" : ""}`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {!isLast && item.path ? (
                    <Link to={item.path} state={item.state}>
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      );
    }
  }

  const hideBreadcrumbRoutes = [
    "/",
    "/home",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-account",
    "/verify-otp",
  ];
  if (hideBreadcrumbRoutes.includes(currentPath)) {
    return null;
  }

  const sectionConfig = [
    {
      parent: { label: "Dashboard", path: "/dashboard" },
      pages: [
        "/dashboard",
        "/request",
        "/request/",
        "/promote-to-volunteer",
        "/emergency-contact",
        "/voluntary-organizations",
        "/organization/",
      ],
    },
    {
      parent: { label: "About Us", path: null },
      pages: ["/our-team", "/our-mission", "/news-our-stories"],
    },
    {
      parent: { label: "Volunteer Service", path: null },
      pages: ["/how-we-operate", "/collaborators"],
    },
    {
      parent: { label: "Contact", path: "/contact" },
      pages: ["/contact"],
    },
    {
      parent: { label: "Notifications", path: "/notifications" },
      pages: ["/notifications"],
    },
    {
      parent: { label: "Donate", path: "/donate" },
      pages: ["/donate"],
    },
    {
      parent: { label: "Profile", path: "/profile" },
      pages: ["/profile"],
    },
    {
      parent: { label: "Terms And Conditions", path: "/terms-and-conditions" },
      pages: ["/terms-and-conditions"],
    },
    {
      parent: { label: "Privacy Policy", path: "/privacy-policy" },
      pages: ["/privacy-policy"],
    },
    {
      parent: { label: "Sitemap", path: "/sitemap" },
      pages: ["/sitemap"],
    },
    {
      parent: { label: "Thanks", path: "/thanks" },
      pages: ["/thanks"],
    },
    {
      parent: { label: "Forgot Password", path: "/forgot-password" },
      pages: ["/forgot-password"],
    },
    {
      parent: { label: "Signup", path: "/signup" },
      pages: ["/signup"],
    },
    {
      parent: { label: "Verify Account", path: "/verify-account" },
      pages: ["/verify-account"],
    },
    {
      parent: { label: "Verify OTP", path: "/verify-otp" },
      pages: ["/verify-otp"],
    },
    {
      parent: { label: "Benevity", path: "/benevity" },
      pages: ["/benevity"],
    },
  ];

  const matchedSection = sectionConfig.find((section) =>
    section.pages.some(
      (page) => currentPath === page || currentPath.startsWith(page),
    ),
  );

  const getCurrentPageLabel = () => {
    if (currentPath === "/dashboard") return "Dashboard";
    if (currentPath === "/request") return "Request";
    if (currentPath.startsWith("/request/")) return "Request Details";
    if (currentPath === "/promote-to-volunteer") return "Promote To Volunteer";
    if (currentPath === "/emergency-contact") return "Emergency Contact";
    if (currentPath === "/voluntary-organizations")
      return "Voluntary Organizations";
    if (currentPath.startsWith("/organization/")) return "Organization Details";
    if (currentPath === "/our-team") return "Our Team";
    if (currentPath === "/our-mission") return "Our Mission";
    if (currentPath === "/news-our-stories") return "News Our Stories";
    if (currentPath === "/how-we-operate") return "How We Operate";
    if (currentPath === "/collaborators") return "Collaborators";
    if (currentPath === "/contact") return "Contact";
    if (currentPath === "/profile") return "Profile";
    if (currentPath === "/notifications") return "Notifications";
    if (currentPath === "/donate") return "Donate";

    const lastSegment = currentPath.split("/").filter(Boolean).pop();
    if (!lastSegment) return "";

    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const currentPageLabel = getCurrentPageLabel();

  const isDashboardPage = currentPath === "/dashboard";
  const isStandalonePage =
    matchedSection &&
    matchedSection.parent.path &&
    currentPath === matchedSection.parent.path &&
    matchedSection.parent.label === currentPageLabel;

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumbs">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>

        {matchedSection ? (
          <>
            <li
              className={`breadcrumb-item${
                isDashboardPage || isStandalonePage ? " active" : ""
              }`}
              aria-current={
                isDashboardPage || isStandalonePage ? "page" : undefined
              }
            >
              {!isDashboardPage &&
              !isStandalonePage &&
              matchedSection.parent.path ? (
                <Link to={matchedSection.parent.path}>
                  {matchedSection.parent.label}
                </Link>
              ) : (
                matchedSection.parent.label
              )}
            </li>

            {!isDashboardPage &&
              !isStandalonePage &&
              currentPageLabel &&
              currentPageLabel !== matchedSection.parent.label && (
                <li className="breadcrumb-item active" aria-current="page">
                  {currentPageLabel}
                </li>
              )}
          </>
        ) : (
          <li className="breadcrumb-item active" aria-current="page">
            {currentPageLabel}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
