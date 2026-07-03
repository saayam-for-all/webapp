import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BreadCrumbs.css";

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const passedTrail = Array.isArray(location.state?.breadcrumbTrail)
    ? location.state.breadcrumbTrail
    : [];

  const renderTrail = (trail) => (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumbs">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>

        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

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

  if (passedTrail.length) {
    return renderTrail(passedTrail);
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
        "/profile",
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
    if (currentPath === "/request") return "Create Help Request";
    if (currentPath.startsWith("/request/")) return "Request Details";
    if (currentPath === "/promote-to-volunteer") return "Promote To Volunteer";
    if (currentPath === "/emergency-contact") return "Emergency Contact";
    if (currentPath === "/voluntary-organizations") return "Organizations";
    if (currentPath.startsWith("/organization/")) {
      return location.state?.organizationData?.Name || "Organization Details";
    }
    if (currentPath === "/our-team") return "Our Team";
    if (currentPath === "/our-mission") return "Our Mission";
    if (currentPath === "/news-our-stories") return t("IN_THE_NEWS");
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

  const fallbackTrail = matchedSection
    ? [
        {
          label: matchedSection.parent.label,
          path:
            isDashboardPage || isStandalonePage
              ? null
              : matchedSection.parent.path,
        },
        ...(!isDashboardPage &&
        !isStandalonePage &&
        currentPageLabel &&
        currentPageLabel !== matchedSection.parent.label
          ? [{ label: currentPageLabel }]
          : []),
      ]
    : [{ label: currentPageLabel }];

  return renderTrail(fallbackTrail);
};

export default Breadcrumbs;
