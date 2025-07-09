import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const rawPathnames = location.pathname.split("/").filter((x) => x);

  const homePath = "/";
  const homeDisplayName = "Home";

  const isEffectivelyHomePage =
    location.pathname === homePath ||
    location.pathname.toLowerCase() === "/home";

  let subsequentPathnames = [...rawPathnames];
  if (
    subsequentPathnames.length > 0 &&
    subsequentPathnames[0].toLowerCase() === "home"
  ) {
    subsequentPathnames.shift();
  }

  const formatSegmentName = (segment) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumbs">
        {/* Home Breadcrumb Item */}
        <li
          className={`breadcrumb-item${isEffectivelyHomePage ? " active" : ""}`}
          aria-current={isEffectivelyHomePage ? "page" : undefined}
        >
          {isEffectivelyHomePage ? (
            homeDisplayName
          ) : (
            <Link to={homePath}>{homeDisplayName}</Link>
          )}
        </li>

        {/* Subsequent Breadcrumb Items */}
        {subsequentPathnames.map((segmentName, index) => {
          const pathSegmentsToJoin = rawPathnames.slice(
            0,
            rawPathnames.length > 0 && rawPathnames[0].toLowerCase() === "home"
              ? index + 2
              : index + 1,
          );
          const routeTo = `/${pathSegmentsToJoin.join("/")}`;
          const isLast = index === subsequentPathnames.length - 1;
          const displayName = formatSegmentName(segmentName);

          return (
            <li
              key={routeTo}
              className={`breadcrumb-item${isLast ? " active" : ""}`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast ? displayName : <Link to={routeTo}>{displayName}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
