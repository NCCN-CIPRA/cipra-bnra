import { useMemo, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../hooks/useAPI";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";

export interface BasePageContext {
  user: LoggedInUser | null | undefined;
  environment: Environment;
  indicators: Indicators;
  showDiff: boolean;
  snapshotMap: Record<string, string>;
  riskSummaryMap: Record<string, SmallRisk>;
  refreshUser: () => void;
  setFakeRole: (role: string) => void;
  setEnvironment: (newEnv: Environment) => void;
  setIndicators: (newInd: Indicators) => void;
  setShowDiff: (newDiff: boolean) => void;
}

const drawerWidth = 320;

export default function BasePage() {
  const api = useAPI();
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

  const { data: riskSummaries } = useQuery<DVRiskSummary[], Error, SmallRisk[]>(
    {
      queryKey: [DataTable.RISK_SUMMARY],
      queryFn: () =>
        api.getRiskSummaries(
          "$select=_cr4de_risk_file_value,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_category",
        ),
      select: (data) =>
        data.map(
          (rf) =>
            ({
              cr4de_riskfilesid: rf._cr4de_risk_file_value,
              cr4de_hazard_id: rf.cr4de_hazard_id,

              cr4de_title: rf.cr4de_title,
              cr4de_risk_type: rf.cr4de_risk_type,
              cr4de_risk_category: rf.cr4de_category,
            } as SmallRisk),
        ),
    },
  );
  const riskSummaryMap = useMemo(() => {
    if (!riskSummaries) return {};
    return riskSummaries.reduce((acc, summary) => {
      acc[summary.cr4de_riskfilesid] = summary;
      return acc;
    }, {} as Record<string, SmallRisk>);
  }, [riskSummaries]);

  const { data: riskSnapshots } = useQuery({
    queryKey: [DataTable.RISK_SNAPSHOT, "mapping"],
    queryFn: () => api.getRiskSnapshots("$select=_cr4de_risk_file_value"),
    enabled: Boolean(user),
  });

  const snapshotMap = useMemo(() => {
    if (!riskSnapshots) return {};
    return riskSnapshots.reduce((acc, snapshot) => {
      acc[snapshot._cr4de_risk_file_value] =
        snapshot.cr4de_bnrariskfilesnapshotid;
      return acc;
    }, {} as Record<string, string>);
  }, [riskSnapshots]);

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
            snapshotMap,
            riskSummaryMap,
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
