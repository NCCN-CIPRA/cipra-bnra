import { useState } from "react";
import { Box, Container, Tab, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import useRecord from "../../hooks/useRecord";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DataTable } from "../../hooks/useAPI";
import { useParams, useSearchParams } from "react-router-dom";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import useRecords from "../../hooks/useRecords";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { Breadcrumb } from "../../components/BreadcrumbNavigation";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import OverviewTab from "./overview/OverviewTab";
import IdentificationTab from "./identification/IdentificationTab";
import AodIcon from "@mui/icons-material/Aod";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import InputManagementTab from "./inputManagement/InputManagementTab";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import AnalysisTab from "./analysis/AnalysisTab";
import LoadingTab from "./LoadingTab";
import { RiskAnalysisResults } from "../../types/dataverse/DVAnalysisRun";
import GroupsIcon from "@mui/icons-material/Groups";
import ConsensusTab from "./consensus/ConsensusTab";

type RouteParams = {
  risk_file_id: string;
};

const TABS = {
  overview: 0,
  identification: 1,
  analysis: 2,
  input: 3,
  consensus: 4,
};

const defaultBreadcrumbs: Breadcrumb[] = [
  { name: "BNRA 2023 - 2026", url: "/" },
  { name: "Risk Catalogue", url: "/risks" },
];

export default function RiskFilePage({}) {
  const params = useParams() as RouteParams;
  const [searchParams, setSearchParams] = useSearchParams();

  const [tab, setTab] = useState(TABS[(searchParams.get("tab") || "overview") as keyof typeof TABS]);

  const {
    data: riskFile,
    reloadData: reloadRiskFile,
    isFetching: loadingRiskFile,
  } = useRecord<DVRiskFile>({
    table: DataTable.RISK_FILE,
    id: params.risk_file_id,
  });
  const {
    data: otherRisks,
    reloadData: reloadRiskFiles,
    isFetching: loadingRiskFiles,
  } = useRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
    query: `$filter=cr4de_riskfilesid ne ${params.risk_file_id}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
  });

  const {
    data: participants,
    reloadData: reloadParticipants,
    isFetching: loadingParticipants,
  } = useRecords<DVParticipation<DVContact>>({
    table: DataTable.PARTICIPATION,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_contact`,
  });

  const {
    data: cascades,
    reloadData: reloadCascades,
    isFetching: loadingCascades,
  } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: `$filter=_cr4de_cause_hazard_value eq ${params.risk_file_id} or _cr4de_effect_hazard_value eq ${params.risk_file_id}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition),cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
  });

  const {
    data: directAnalyses,
    reloadData: reloadDirectAnalyses,
    isFetching: loadingDAs,
  } = useRecords<DVDirectAnalysis<unknown, DVContact>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const {
    data: cascadeAnalyses,
    reloadData: reloadCascadeAnalyses,
    isFetching: loadingCAs,
  } = useRecords<DVCascadeAnalysis<unknown, unknown, DVContact>>({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const { data: calculations, isFetching: loadingCalculations } = useRecords<RiskAnalysisResults>({
    table: DataTable.ANALYSIS_RUN,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$orderby=createdon desc&$top=10`,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleUpdateCascades = async () => {
    return reloadCascades();
  };

  usePageTitle("BNRA 2023 - 2026 Risk File");
  useBreadcrumbs([...defaultBreadcrumbs, riskFile ? { name: riskFile.cr4de_title, url: "" } : null]);

  return (
    <>
      <Box sx={{ mb: 15 }}>
        {tab === 0 && (
          <OverviewTab
            riskFile={riskFile}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            participants={participants}
            calculations={calculations}
          />
        )}
        {riskFile && tab === 1 && (
          <IdentificationTab
            riskFile={riskFile}
            cascades={cascades}
            otherRisks={otherRisks}
            onUpdateCascades={handleUpdateCascades}
          />
        )}
        {riskFile && tab === 2 && <AnalysisTab riskFile={riskFile} calculations={calculations} />}
        {riskFile && tab === 3 && (
          <InputManagementTab
            riskFile={riskFile}
            cascades={cascades}
            directAnalyses={
              directAnalyses?.filter((da) =>
                participants?.some(
                  (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_direct_analysis_finished
                )
              ) || null
            }
            cascadeAnalyses={
              cascadeAnalyses?.filter((ca) =>
                participants?.some(
                  (p) => p._cr4de_contact_value === ca._cr4de_expert_value && p.cr4de_cascade_analysis_finished
                )
              ) || null
            }
            participants={participants}
            reloadRiskFile={reloadRiskFile}
            reloadCascades={reloadCascades}
            reloadDirectAnalyses={reloadDirectAnalyses}
            reloadCascadeAnalyses={reloadCascadeAnalyses}
          />
        )}
        {riskFile && cascades && tab === 4 && <ConsensusTab riskFile={riskFile} cascades={cascades} />}
      </Box>
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={tab}
          onChange={(event, newValue) => {
            setTab(newValue);
          }}
        >
          <BottomNavigationAction
            label="Overview"
            icon={<AodIcon />}
            onClick={() => setSearchParams({ tab: "overview" })}
          />
          <BottomNavigationAction
            label="Risk Identification"
            icon={<FingerprintIcon />}
            onClick={() => setSearchParams({ tab: "identification" })}
          />
          <BottomNavigationAction
            label="Risk Analysis"
            icon={<AssessmentIcon />}
            onClick={() => setSearchParams({ tab: "analysis" })}
          />
          <BottomNavigationAction
            label="Expert Input"
            icon={<PsychologyIcon />}
            onClick={() => setSearchParams({ tab: "input" })}
          />
          <BottomNavigationAction
            label="Consensus Meeting"
            icon={<GroupsIcon />}
            onClick={() => setSearchParams({ tab: "consensus" })}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
