import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography, Skeleton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export interface Breadcrumb {
  name: string;
  url: string;
}

export default function BreadcrumbNavigation({ breadcrumbs }: { breadcrumbs: (Breadcrumb | null)[] | null }) {
  if (!breadcrumbs) return null;

  return (
    <Breadcrumbs id="bnra-breadcrumbs" aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
      {breadcrumbs.map((b, i) => {
        if (!b) return <Skeleton key={i} variant="text" width="200px" />;

        if (i === breadcrumbs.length - 1)
          return (
            <Typography key={b.name} color="text.primary">
              {b.name}
            </Typography>
          );

        return (
          <Link key={b.name} underline="hover" color="inherit" to={b.url} component={RouterLink}>
            {b.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
