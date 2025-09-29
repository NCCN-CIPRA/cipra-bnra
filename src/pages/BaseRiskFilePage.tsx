import { useEffect, useMemo } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
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
import {
  CascadeSnapshots,
  getCascadesCatalogue,
  getCascadesCatalogueNew,
  getCascadesSnapshotCatalogue,
} from "../functions/cascades";
import {
  getRiskCatalogue,
  getRiskCatalogueFromSnapshots,
  getRiskFileCatalogue,
  RiskCatalogue,
} from "../functions/riskfiles";
import { Environment } from "../types/global";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../types/dataverse/DVRiskSnapshot";
import { summaryFromRiskfile } from "../functions/snapshot";

type RouteParams = {
  risk_file_id: string;
};

export interface RiskFilePageContext extends BasePageContext {
  riskSummary: DVRiskSummary;
  riskSnapshot: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  riskFile: DVRiskFile | null;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot> | null;
}

export default function BaseRiskFilePage() {
  const { t } = useTranslation();
  const { user, environment, ...baseContext } =
    useOutletContext<BasePageContext>();
  const navigate = useNavigate();
  const api = useAPI();

  const params = useParams() as RouteParams;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { data: publicRiskSummary } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY],
    queryFn: () => api.getRiskSummaries(),
    select: (data) =>
      data.find((rf) => rf._cr4de_risk_file_value === params.risk_file_id),
  });
  const { data: riskFiles } = useQuery({
    queryKey: [DataTable.RISK_FILE],
    queryFn: () => api.getRiskFiles(),
    select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
    enabled: Boolean(
      user && user.roles.analist && environment === Environment.DYNAMIC
    ),
  });

  const { data: riskSnapshots } = useQuery({
    queryKey: [DataTable.RISK_SNAPSHOT],
    queryFn: () => api.getRiskSnapshots(),
    select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
    enabled: Boolean(
      user && user.roles.verified && environment === Environment.PUBLIC
    ),
  });

  const { data: cascadeList } = useQuery({
    queryKey: [DataTable.RISK_CASCADE],
    queryFn: () => api.getRiskCascades(),
    enabled: Boolean(
      user && user.roles.analist && environment === Environment.DYNAMIC
    ),
  });

  const { data: cascadeSnapshotList } = useQuery({
    queryKey: [DataTable.CASCADE_SNAPSHOT],
    queryFn: () => api.getCascadeSnapshots(),
    select: (d) => d.map((d) => ({ ...d, cr4de_removed: false })),
    enabled: Boolean(
      user && user.roles.verified && environment === Environment.PUBLIC
    ),
  });

  const rc: RiskCatalogue<unknown, RiskSnapshotResults> | null = useMemo(() => {
    let rcTemp = null;

    if (!riskFiles && !riskSnapshots) return null;

    if (environment === Environment.DYNAMIC && riskFiles)
      rcTemp = getRiskCatalogue(riskFiles);

    if (environment === Environment.PUBLIC && riskSnapshots)
      rcTemp = getRiskCatalogueFromSnapshots(riskSnapshots);

    if (rcTemp) {
      return Object.keys(rcTemp).reduce(
        (acc, rs) => ({
          ...acc,
          [rs]: {
            ...rcTemp[rs],
            cr4de_quanti: JSON.parse(rcTemp[rs].cr4de_quanti),
          },
        }),
        {} as RiskCatalogue<unknown, RiskSnapshotResults>
      );
    }

    return null;
  }, [riskFiles, riskSnapshots, environment]);

  const cascades = useMemo(() => {
    if (!rc) return null;

    let ccTemp = null;
    if (environment === Environment.DYNAMIC && cascadeList && riskFiles) {
      ccTemp = getCascadesCatalogueNew(riskFiles, rc, cascadeList);
    }

    if (
      environment === Environment.PUBLIC &&
      cascadeSnapshotList &&
      riskSnapshots
    )
      ccTemp = getCascadesSnapshotCatalogue(
        Object.values(rc),
        rc,
        cascadeSnapshotList
      );

    return ccTemp;
  }, [
    environment,
    riskFiles,
    cascadeList,
    riskSnapshots,
    cascadeSnapshotList,
    rc,
  ]);

  const riskSummary = useMemo(() => {
    if (environment === Environment.PUBLIC || !riskFiles || !rc || !cascadeList)
      return publicRiskSummary;

    if (!riskFiles) return null;

    const innerRiskFile = riskFiles.find(
      (rf) => rf.cr4de_riskfilesid === params.risk_file_id
    );

    if (!innerRiskFile) return null;

    const realRC = getRiskFileCatalogue(riskFiles);
    const realCascades = getCascadesCatalogue(riskFiles, realRC, cascadeList);
    return summaryFromRiskfile(
      innerRiskFile,
      realCascades[innerRiskFile.cr4de_riskfilesid],
      true
    );
  }, [publicRiskSummary, riskFiles, cascadeList, rc, params, environment]);

  const riskFile = useMemo(() => {
    if (!riskFiles) return null;

    return (
      riskFiles.find((rf) => rf.cr4de_riskfilesid === params.risk_file_id) ||
      null
    );
  }, [riskFiles, params]);

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
  if (pathname.indexOf("description") >= 0) tab = 1;
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
            environment,
            ...baseContext,
            riskFile,
            riskSummary,
            riskSnapshot: rc?.[riskSummary._cr4de_risk_file_value] || null,
            cascades: cascades?.[riskSummary._cr4de_risk_file_value] || null,
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
          {user && user.roles.beReader && (
            <BottomNavigationAction
              label={t(
                "risk.bottombar.riskIdentification",
                "Risk Identification"
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
