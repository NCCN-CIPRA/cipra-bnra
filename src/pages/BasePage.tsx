import { useState } from "react";
import { CssBaseline, Box, Toolbar, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppContext from "../functions/AppContext";
import SideDrawer from "../components/SideDrawer";
import TitleBar from "../components/TitleBar";
import BreadcrumbNavigation, { Breadcrumb } from "../components/BreadcrumbNavigation";
import useLoggedInUser, { LoggedInUser } from "../hooks/useLoggedInUser";
import satisfies from "../types/satisfies";

export interface BasePageContext {
  user: LoggedInUser | null | undefined;
  refreshUser: () => void;
  setFakeRole: (role: string) => void;
}

const drawerWidth = 320;

export default function BasePage() {
  const { user, refreshUser, setFakeRole } = useLoggedInUser();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("BNRA 2023 - 2026");
  const [breadcrumbs, setBreadcrumbs] = useState<(Breadcrumb | null)[]>([
    {
      name: "BNRA",
      url: "/",
    },
  ]);
  const [bottomBarHeight, setBottomBarHeight] = useState(0);

  return (
    <AppContext.Provider
      value={{
        setPageTitle,
        setBreadcrumbs,
        setBottomBarHeight,
      }}
    >
      <CssBaseline />
      <TitleBar
        user={user}
        setFakeRole={setFakeRole}
        title={pageTitle}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
      />
      <SideDrawer user={user} open={drawerOpen} width={drawerWidth} onClose={() => setDrawerOpen(false)} />
      {/* <Box sx={{ display: "flex", flexFlow: "column nowrap", minHeight: "100vh", mb: `${bottomBarHeight}px` }}> */}
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar />
        {breadcrumbs && (
          <Box sx={{ m: 2, ml: "76px" }}>
            <BreadcrumbNavigation breadcrumbs={breadcrumbs} />
          </Box>
        )}
        <Outlet
          context={satisfies<BasePageContext>({
            user,
            refreshUser,
            setFakeRole,
          })}
        />
      </Box>
      {/* <Stack
          direction="row"
          sx={{
            justifyContent: "space-evenly",
            py: 2,
            backgroundColor: "white",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <img
            alt="Nationaal Crisiscentrum"
            src="https://bnra.powerappsportals.com/logo_nccn.svg"
            style={{ height: 40 }}
          />
          <img alt="BNRA" src="https://bnra.powerappsportals.com/logo_text.png" style={{ height: 40 }} />
        </Stack> */}
      {/* </Box> */}
    </AppContext.Provider>
  );
}
