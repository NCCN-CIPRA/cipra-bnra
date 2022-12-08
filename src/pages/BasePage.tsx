import { useState } from "react";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppContext from "../functions/AppContext";
import SideDrawer from "../components/SideDrawer";
import TitleBar from "../components/TitleBar";
import BreadcrumbNavigation, { Breadcrumb } from "../components/BreadcrumbNavigation";

const drawerWidth = 320;

export default function BasePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("BNRA 2023 - 2026");
  const [breadcrumbs, setBreadcrumbs] = useState<(Breadcrumb | null)[]>([
    {
      name: "BNRA 2023 - 2026",
      url: "/",
    },
  ]);

  return (
    <AppContext.Provider
      value={{
        setPageTitle,
        setBreadcrumbs,
      }}
    >
      <CssBaseline />
      <TitleBar title={pageTitle} onDrawerToggle={() => setDrawerOpen(!drawerOpen)} />
      <SideDrawer open={drawerOpen} width={drawerWidth} onClose={() => setDrawerOpen(false)} />
      <Box>
        <Toolbar />
        {breadcrumbs && (
          <Box sx={{ m: 2, ml: "76px" }}>
            <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
          </Box>
        )}
        <Outlet />
      </Box>
    </AppContext.Provider>
  );
}
