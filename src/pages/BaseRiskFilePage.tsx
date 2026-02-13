import { useEffect, useMemo } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  DVRiskFile,
  parseRiskFileQuantiResults,
  RISK_TYPE,
  RiskFileQuantiResults,
  SerializedRiskFileQuantiInput,
  SerializedRiskFileQuantiResults,
} from "../types/dataverse/DVRiskFile";
import useAPI, { DataTable } from "../hooks/useAPI";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AodIcon from "@mui/icons-material/Aod";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import usePageTitle from "../hooks/usePageTitle";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";
import satisfies from "../types/satisfies";
import NCCNLoader from "../components/NCCNLoader";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { BasePageContext } from "./BasePage";
import { useQuery } from "@tanstack/react-query";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import { Environment } from "../types/global";
import {
  DVRiskSnapshot,
  parseRiskSnapshot,
  RiskSnapshotResults,
  SerializedRiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import {
  snapshotFromRiskfile,
  summaryFromRiskfileNew,
} from "../functions/snapshot";
import DifferenceIcon from "@mui/icons-material/Difference";
import { SerializedRiskQualis } from "../types/dataverse/Riskfile";

type RouteParams = {
  risk_file_id: string;
};

export interface RiskFilePageContext extends BasePageContext {
  riskSummary: DVRiskSummary;
  riskSnapshot: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  publicRiskSnapshot: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  riskFile: DVRiskFile<unknown, unknown, unknown, RiskFileQuantiResults> | null;
  results: RiskFileQuantiResults | null;
}

export default function BaseRiskFilePage() {
  const { t } = useTranslation();
  const { user, environment, snapshotMap, riskSummaryMap, ...baseContext } =
    useOutletContext<BasePageContext>();
  const navigate = useNavigate();
  const api = useAPI();

  const params = useParams() as RouteParams;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { data: publicRiskSummary } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY, params.risk_file_id],
    queryFn: () =>
      api.getRiskSummary(
        riskSummaryMap[params.risk_file_id]?.cr4de_riskfilesid || "",
      ),
    enabled: Boolean(riskSummaryMap[params.risk_file_id]),
  });
  const { data: riskFile } = useQuery<
    DVRiskFile<
      unknown,
      SerializedRiskFileQuantiInput,
      SerializedRiskQualis,
      SerializedRiskFileQuantiResults
    >,
    Error,
    DVRiskFile<
      unknown,
      SerializedRiskFileQuantiInput,
      SerializedRiskQualis,
      RiskFileQuantiResults
    >
  >({
    queryKey: [DataTable.RISK_FILE, params.risk_file_id],
    queryFn: () => api.getRiskFile(params.risk_file_id),
    enabled: Boolean(
      user && user.roles.analist && environment === Environment.DYNAMIC,
    ),
    select: (data) => ({
      ...data,
      cr4de_quanti_results: parseRiskFileQuantiResults(
        data.cr4de_quanti_results,
      ),
    }),
  });

  const { data: publicRiskSnapshot } = useQuery<
    DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>,
    Error,
    DVRiskSnapshot<unknown, RiskSnapshotResults>
  >({
    queryKey: [DataTable.RISK_SNAPSHOT, params.risk_file_id],
    queryFn: () => api.getRiskSnapshot(snapshotMap[params.risk_file_id] || ""),
    enabled: Boolean(
      user && user.roles.verified && snapshotMap[params.risk_file_id],
    ),
    select: (data) => parseRiskSnapshot(data),
  });

  const riskSummary = useMemo(() => {
    if (environment === Environment.PUBLIC || !riskFile)
      return publicRiskSummary;

    if (!riskFile) return null;

    return summaryFromRiskfileNew(riskFile);
  }, [publicRiskSummary, riskFile, environment]);

  const riskSnapshot = useMemo(() => {
    if (!publicRiskSnapshot) return null;

    if (environment === Environment.PUBLIC || !riskFile)
      return publicRiskSnapshot;

    if (!riskFile) return null;

    return parseRiskSnapshot(snapshotFromRiskfile(riskFile));
  }, [publicRiskSnapshot, riskFile, environment]);

  const isEmerging = riskSummary?.cr4de_risk_type === RISK_TYPE.EMERGING;

  let tab = 0;
  const extraTab = isEmerging ? 0 : 1;
  if (pathname.indexOf("description") >= 0) tab = 1;
  if (pathname.indexOf("analysis") >= 0) tab = 2;
  if (pathname.indexOf("evolution") >= 0) tab = 3;
  if (pathname.indexOf("data") >= 0) tab = 3 + extraTab;
  if (pathname.indexOf("input") >= 0) tab = 4 + extraTab;
  if (pathname.indexOf("log") >= 0) tab = 5 + extraTab;

  usePageTitle(riskSummary ? riskSummary.cr4de_title : "...");
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    {
      name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"),
      url: "/risks",
    },
    {
      name: riskSummary
        ? t(`risk.${riskSummary.cr4de_hazard_id}.name`, riskSummary.cr4de_title)
        : "...",
      url: "",
    },
  ]);

  return (
    <Box sx={{ display: "flex" }}>
      {riskSummary ? (
        <Outlet
          context={satisfies<RiskFilePageContext>({
            user,
            environment,
            snapshotMap,
            riskSummaryMap,
            ...baseContext,
            riskFile: riskFile || null,
            riskSummary,
            riskSnapshot: riskSnapshot || null,
            publicRiskSnapshot: publicRiskSnapshot || null,
            results:
              riskFile && environment === Environment.DYNAMIC
                ? riskFile.cr4de_quanti_results
                : null,
          })}
        />
      ) : (
        <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
          <NCCNLoader />
        </Box>
      )}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
          displayPrint: "none",
        }}
        elevation={3}
      >
        <BottomNavigation showLabels value={tab}>
          <BottomNavigationAction
            label={t("risk.bottombar.summary", "Summary")}
            icon={<AodIcon />}
            onClick={() => navigate(`/risks/${params.risk_file_id}`)}
          />
          {user && user.roles.beReader && (
            <BottomNavigationAction
              label={t(
                "risk.bottombar.riskIdentification",
                "Risk Identification",
              )}
              icon={<FingerprintIcon />}
              onClick={() =>
                navigate(`/risks/${params.risk_file_id}/description`)
              }
            />
          )}
          {user && user.roles.beReader && (
            <BottomNavigationAction
              label={t("risk.bottombar.riskAnalysis", "Risk Analysis")}
              icon={<AssessmentIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/analysis`)}
            />
          )}
          {user && user.roles.beReader && !isEmerging && (
            <BottomNavigationAction
              label={t("risk.bottombar.riskEvolution", "Risk Evolution")}
              icon={<QueryStatsIcon />}
              onClick={() =>
                navigate(`/risks/${params.risk_file_id}/evolution`)
              }
            />
          )}
          {user &&
            (user.roles.analist ||
              (user.roles.expert &&
                user.participations &&
                user.participations.find(
                  (p) => p._cr4de_risk_file_value === params.risk_file_id,
                ))) && (
              <BottomNavigationAction
                label={t("risk.bottombar.rawData", "Raw Data")}
                icon={<PsychologyIcon />}
                onClick={() => navigate(`/risks/${params.risk_file_id}/data`)}
              />
            )}
          {user && user.roles.analist && (
            <BottomNavigationAction
              label={t("risk.bottombar.expertInput", "Expert Input")}
              icon={<GroupsIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/input`)}
            />
          )}
          {user && user.roles.analist && (
            <BottomNavigationAction
              label={"Change Log"}
              icon={<DifferenceIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/log`)}
            />
          )}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
