import { useState } from "react";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideDrawer from "../components/SideDrawer";
import TitleBar from "../components/TitleBar";

const drawerWidth = 320;

export default function BasePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <CssBaseline />
      <TitleBar
        title="BNRA 2023 - 2026 Risk Overview"
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
      />
      <SideDrawer
        open={drawerOpen}
        width={drawerWidth}
        onClose={() => setDrawerOpen(false)}
      />
      <Box>
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
}
