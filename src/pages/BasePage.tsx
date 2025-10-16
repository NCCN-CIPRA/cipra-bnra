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
import { useQueryClient } from "@tanstack/react-query";
import useAPI, { DataTable } from "../hooks/useAPI";
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
    false
  );
  const [indicators, setIndicators] = useSavedState<Indicators>(
    "bnraIndicatorVersion",
    Indicators.V1,
    false
  );
  const [diff, setDiff] = useSavedState<boolean>("bnraShowDiff", true, false);
  const queryClient = useQueryClient();
  const api = useAPI();

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (user && user.roles.analist && environment === Environment.DYNAMIC) {
    queryClient.prefetchQuery({
      queryKey: [DataTable.RISK_FILE],
      queryFn: () => api.getRiskFiles(),
    });
    queryClient.prefetchQuery({
      queryKey: [DataTable.RISK_CASCADE],
      queryFn: () => api.getRiskCascades(),
    });
  } else if (user) {
    queryClient.prefetchQuery({
      queryKey: [DataTable.RISK_SNAPSHOT],
      queryFn: () => api.getRiskSnapshots(),
    });
    queryClient.prefetchQuery({
      queryKey: [DataTable.CASCADE_SNAPSHOT],
      queryFn: () => api.getCascadeSnapshots(),
    });
  }

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
    </AppContextProvider>
  );
}
