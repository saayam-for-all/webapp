import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        Home
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        const label = name
          .replace("-", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return isLast ? (
          <Typography key={routeTo} sx={{ color: "text.primary" }}>
            {label}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={routeTo}
            key={routeTo}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
