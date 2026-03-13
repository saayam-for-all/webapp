import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        px: { xs: 2, md: 10 },
        py: 1.5,
        borderRadius: 1,
      }}
    >
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link
          component={RouterLink}
          to="/"
          sx={{
            color: "#1976d2",
            textDecoration: "none",
            fontWeight: 500,
            "&:hover": { textDecoration: "none" },
          }}
        >
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
    </Box>
  );
}
