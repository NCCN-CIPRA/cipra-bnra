import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import useRecords from "../hooks/useRecords";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { DataTable } from "../hooks/useAPI";
import useLazyRecord from "../hooks/useLazyRecord";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import useLazyRecords from "../hooks/useLazyRecords";
import { BottomNavigation, BottomNavigationAction, CircularProgress, Paper, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AodIcon from "@mui/icons-material/Aod";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { RiskPageContext } from "./BaseRisksPage";
import { Breadcrumb } from "../components/BreadcrumbNavigation";
import usePageTitle from "../hooks/usePageTitle";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";
import useBottomBarHeight from "../hooks/useBottomBarHeight";
import { getCauses } from "../functions/cascades";
import satisfies from "../types/satisfies";
import { DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../types/dataverse/DVContact";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import NCCNLoader from "../components/NCCNLoader";
import { DVAttachment } from "../types/dataverse/DVAttachment";

type RouteParams = {
  risk_file_id: string;
};

export interface RiskFilePageContext extends RiskPageContext {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;

  riskFile: DVRiskFile;
  calculation: RiskCalculation;
  causes: DVRiskCascade<SmallRisk>[];
  effects: DVRiskCascade<unknown, SmallRisk>[];
  catalyzingEffects: DVRiskCascade<SmallRisk>[];
  climateChange: DVRiskCascade<SmallRisk> | null;

  participants: DVParticipation<DVContact>[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;

  loadParticipants: () => Promise<unknown>;
  loadDirectAnalyses: () => Promise<unknown>;
  loadCascadeAnalyses: () => Promise<unknown>;
  loadAttachments: () => Promise<unknown>;
}

export default function BaseRiskFilePage() {
  const { t } = useTranslation();
  const riskContext = useOutletContext<RiskPageContext>();
  const navigate = useNavigate();

  const params = useParams() as RouteParams;
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);

  const { data: participants, getData: loadParticipants } = useLazyRecords<DVParticipation<DVContact>>({
    table: DataTable.PARTICIPATION,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_contact`,
  });

  const { data: directAnalyses, getData: loadDirectAnalyses } = useLazyRecords<DVDirectAnalysis<unknown, DVContact>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const { data: cascadeAnalyses, getData: loadCascadeAnalyses } = useLazyRecords<
    DVCascadeAnalysis<unknown, unknown, DVContact>
  >({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const { data: attachments, getData: loadAttachments } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_referencedSource`,
  });

  let tab = 0;
  if (location.pathname.indexOf("identification") >= 0) tab = 1;
  if (location.pathname.indexOf("analysis") >= 0) tab = 2;
  if (location.pathname.indexOf("data") >= 0) tab = 3;
  if (location.pathname.indexOf("input") >= 0) tab = 4;

  useEffect(() => {
    riskContext.loadRiskFile({ id: params.risk_file_id });
  }, [params.risk_file_id]);

  usePageTitle(
    riskContext.riskFiles[params.risk_file_id] ? riskContext.riskFiles[params.risk_file_id].cr4de_title : "..."
  );
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"), url: "/risks" },
    {
      name: riskContext.riskFiles[params.risk_file_id] ? riskContext.riskFiles[params.risk_file_id].cr4de_title : "...",
      url: "",
    },
  ]);

  useBottomBarHeight(riskContext.user ? 56 : 0);

  return (
    <>
      {riskContext.riskFiles[params.risk_file_id] ? (
        <Outlet
          context={satisfies<RiskFilePageContext>({
            ...riskContext,
            isEditing,
            setIsEditing,

            riskFile: riskContext.riskFiles[params.risk_file_id],
            calculation: riskContext.riskFiles[params.risk_file_id].cr4de_latest_calculation?.cr4de_results!,
            causes: riskContext.cascades[params.risk_file_id].causes,
            effects: riskContext.cascades[params.risk_file_id].effects,
            catalyzingEffects: riskContext.cascades[params.risk_file_id].catalyzingEffects,
            climateChange: riskContext.cascades[params.risk_file_id].climateChange,

            participants,
            loadParticipants,
            directAnalyses,
            loadDirectAnalyses,
            cascadeAnalyses,
            loadCascadeAnalyses,
            attachments,
            loadAttachments,
          })}
        />
      ) : (
        <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
          <NCCNLoader />
        </Box>
      )}
      {riskContext.user && (
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation showLabels value={tab}>
            <BottomNavigationAction
              label="Summary"
              icon={<AodIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}`)}
            />
            <BottomNavigationAction
              label="Risk Identification"
              icon={<FingerprintIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/identification`)}
            />
            <BottomNavigationAction
              label="Risk Analysis"
              icon={<AssessmentIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/analysis`)}
            />
            <BottomNavigationAction
              label="Raw Data"
              icon={<PsychologyIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/data`)}
            />
            <BottomNavigationAction
              label="Expert Input"
              icon={<GroupsIcon />}
              onClick={() => navigate(`/risks/${params.risk_file_id}/input`)}
            />
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
}
