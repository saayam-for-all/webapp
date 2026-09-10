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
          <Link to="/">{t("HOME")}</Link>
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
                  {t(item.label)}
                </Link>
              ) : (
                t(item.label)
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
      parent: { label: "DASHBOARD", path: "/dashboard" },
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
      parent: { label: "ABOUT", path: null },
      pages: ["/our-team", "/our-mission", "/news-our-stories"],
    },
    {
      parent: { label: "VOLUNTEER_SERVICES", path: null },
      pages: ["/how-we-operate", "/collaborators"],
    },
    {
      parent: { label: "CONTACT", path: "/contact" },
      pages: ["/contact"],
    },
    {
      parent: { label: "NOTIFICATIONS", path: "/notifications" },
      pages: ["/notifications"],
    },
    {
      parent: { label: "DONATE", path: "/donate" },
      pages: ["/donate"],
    },
    {
      parent: { label: "TERMS_AND_CONDITIONS", path: "/terms-and-conditions" },
      pages: ["/terms-and-conditions"],
    },
    {
      parent: { label: "PRIVACY_POLICY", path: "/privacy-policy" },
      pages: ["/privacy-policy"],
    },
    {
      parent: { label: "SITEMAP", path: "/sitemap" },
      pages: ["/sitemap"],
    },
    {
      parent: { label: "THANKS", path: "/thanks" },
      pages: ["/thanks"],
    },
    {
      parent: { label: "FORGOT_PASSWORD", path: "/forgot-password" },
      pages: ["/forgot-password"],
    },
    {
      parent: { label: "SIGNUP", path: "/signup" },
      pages: ["/signup"],
    },
    {
      parent: { label: "VERIFY_ACCOUNT", path: "/verify-account" },
      pages: ["/verify-account"],
    },
    {
      parent: { label: "VERIFY_OTP", path: "/verify-otp" },
      pages: ["/verify-otp"],
    },
    {
      parent: { label: "BENEVITY", path: "/benevity" },
      pages: ["/benevity"],
    },
  ];

  const matchedSection = sectionConfig.find((section) =>
    section.pages.some(
      (page) => currentPath === page || currentPath.startsWith(page),
    ),
  );

  const getCurrentPageLabel = () => {
    if (currentPath === "/dashboard") return "DASHBOARD";
    if (currentPath === "/request") return "CREATE_HELP_REQUEST";
    if (currentPath.startsWith("/request/")) return "REQUEST_DETAILS";
    if (currentPath === "/promote-to-volunteer") return "BECOME_VOLUNTEER";
    if (currentPath === "/emergency-contact") return "EMERGENCY_CONTACT";
    if (currentPath === "/voluntary-organizations") return "ORGANIZATIONS";
    if (currentPath.startsWith("/organization/")) {
      return location.state?.organizationData?.Name || "ORGANIZATION_DETAILS";
    }
    if (currentPath === "/our-team") return "OUR_TEAM";
    if (currentPath === "/our-mission") return "OUR_MISSION";
    if (currentPath === "/news-our-stories") return "IN_THE_NEWS";
    if (currentPath === "/how-we-operate") return "HOW_WE_OPERATE";
    if (currentPath === "/collaborators") return "OUR_COLLABORATORS";
    if (currentPath === "/contact") return "CONTACT";
    if (currentPath === "/profile") return "PROFILE";
    if (currentPath === "/notifications") return "NOTIFICATIONS";
    if (currentPath === "/donate") return "DONATE";

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
