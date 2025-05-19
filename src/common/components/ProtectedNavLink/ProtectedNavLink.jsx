import React from "react";
import { Link } from "react-router-dom";

const ProtectedNavLink = ({ to, children, className, onClick, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();

    if (onClick) onClick(e);

    if (!e.defaultPrevented && window._checkNavigation) {
      window._checkNavigation(to);
    }
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default ProtectedNavLink;
