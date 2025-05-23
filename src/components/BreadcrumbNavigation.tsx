import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography, Skeleton, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useBreadcrumbsValue } from "../hooks/useBreadcrumbs";

export default function BreadcrumbNavigation() {
  const { breadcrumbs } = useBreadcrumbsValue();

  if (!breadcrumbs) return null;

  return (
    <Box sx={{ m: 2, ml: "76px" }}>
      <Breadcrumbs
        id="bnra-breadcrumbs"
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {breadcrumbs.map((b, i) => {
          if (!b) return <Skeleton key={i} variant="text" width="200px" />;

          if (i === breadcrumbs.length - 1)
            return (
              <Typography key={b.name} color="text.primary">
                {b.name}
              </Typography>
            );

          return (
            <Link
              key={b.name}
              underline="hover"
              color="inherit"
              to={b.url}
              component={RouterLink}
            >
              {b.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
