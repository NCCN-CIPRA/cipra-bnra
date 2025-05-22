import { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { RISK_TYPE } from "../types/dataverse/DVRiskFile";
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

type RouteParams = {
  risk_file_id: string;
};

export interface RiskFilePageContext extends BasePageContext {
  riskSummary: DVRiskSummary;
}

export default function BaseRiskFilePage() {
  const { t } = useTranslation();
  const { user, ...baseContext } = useOutletContext<BasePageContext>();
  const navigate = useNavigate();
  const api = useAPI();

  const params = useParams() as RouteParams;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { data: riskSummary } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY],
    queryFn: () => api.getRiskSummaries(),
    select: (data) =>
      data.find((rf) => rf.cr4de_bnrariskfilesummaryid === params.risk_file_id),
  });

  // const { data: participants, getData: loadParticipants } = useLazyRecords<
  //   DVParticipation<DVContact>
  // >({
  //   table: DataTable.PARTICIPATION,
  //   query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_contact`,
  // });

  // const { data: directAnalyses, getData: loadDirectAnalyses } = useLazyRecords<
  //   DVDirectAnalysis<unknown, DVContact>
  // >({
  //   table: DataTable.DIRECT_ANALYSIS,
  //   query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  // });

  // const { data: cascadeAnalyses, getData: loadCascadeAnalyses } =
  //   useLazyRecords<DVCascadeAnalysis<unknown, unknown, DVContact>>({
  //     table: DataTable.CASCADE_ANALYSIS,
  //     query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  //   });

  // const { data: attachments, getData: loadAttachments } = useLazyRecords<
  //   DVAttachment<unknown, DVAttachment>
  // >({
  //   table: DataTable.ATTACHMENT,
  //   query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_referencedSource`,
  // });

  const isEmerging = riskSummary?.cr4de_risk_type === RISK_TYPE.EMERGING;

  let tab = 0;
  const extraTab = isEmerging ? 0 : 1;
  if (pathname.indexOf("identification") >= 0) tab = 1;
  if (pathname.indexOf("analysis") >= 0) tab = 2;
  if (pathname.indexOf("evolution") >= 0) tab = 3;
  if (pathname.indexOf("data") >= 0) tab = 3 + extraTab;
  if (pathname.indexOf("input") >= 0) tab = 4 + extraTab;

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
            ...baseContext,
            riskSummary,
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
        }}
        elevation={3}
      >
        <BottomNavigation showLabels value={tab}>
          <BottomNavigationAction
            label={t("risk.bottombar.summary", "Summary")}
            icon={<AodIcon />}
            onClick={() => navigate(`/risks/${params.risk_file_id}`)}
          />
          <BottomNavigationAction
            label={t(
              "risk.bottombar.riskIdentification",
              "Risk Identification"
            )}
            icon={<FingerprintIcon />}
            onClick={() =>
              navigate(`/risks/${params.risk_file_id}/identification`)
            }
          />
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
                  (p) => p._cr4de_risk_file_value === params.risk_file_id
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
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
