import { useState } from "react";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppContextProvider } from "../functions/AppContext";
import SideDrawer from "../components/SideDrawer";
import TitleBar from "../components/TitleBar";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import useLoggedInUser, { LoggedInUser } from "../hooks/useLoggedInUser";
import satisfies from "../types/satisfies";
import { Environment, Indicators } from "../types/global";
import useSavedState from "../hooks/useSavedState";

export interface BasePageContext {
  user: LoggedInUser | null | undefined;
  environment: Environment;
  indicators: Indicators;
  showDiff: boolean;
  refreshUser: () => void;
  setFakeRole: (role: string) => void;
  setEnvironment: (newEnv: Environment) => void;
  setIndicators: (newInd: Indicators) => void;
  setShowDiff: (newDiff: boolean) => void;
}

const drawerWidth = 320;

export default function BasePage() {
  const { user, refreshUser, setFakeRole } = useLoggedInUser();
  const [environment, setEnvironment] = useSavedState<Environment>(
    "bnraEnvironment",
    Environment.PUBLIC,
    false,
  );
  const [indicators, setIndicators] = useSavedState<Indicators>(
    "bnraIndicatorVersion",
    Indicators.V1,
    false,
  );
  const [diff, setDiff] = useSavedState<boolean>("bnraShowDiff", true, false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppContextProvider>
      <CssBaseline />
      <TitleBar
        user={user}
        environment={environment}
        indicators={indicators}
        showDiff={diff}
        setFakeRole={setFakeRole}
        setEnvironment={setEnvironment}
        setIndicators={setIndicators}
        setShowDiff={setDiff}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
      />
      <SideDrawer
        user={user}
        open={drawerOpen}
        width={drawerWidth}
        onClose={() => setDrawerOpen(false)}
      />
      {/* <Box sx={{ display: "flex", flexFlow: "column nowrap", minHeight: "100vh", mb: `${bottomBarHeight}px` }}> */}
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar />
        <BreadcrumbNavigation />
        <Outlet
          context={satisfies<BasePageContext>({
            user,
            environment: user?.roles.analist ? environment : Environment.PUBLIC,
            indicators,
            showDiff: diff,
            refreshUser,
            setFakeRole,
            setEnvironment,
            setIndicators,
            setShowDiff: setDiff,
          })}
        />
      </Box>
    </AppContextProvider>
  );
}
