import { useState } from "react";
import { Box, Container, Tab, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import useRecord from "../../hooks/useRecord";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DataTable } from "../../hooks/useAPI";
import { useParams } from "react-router-dom";
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

type RouteParams = {
  risk_file_id: string;
};

const defaultBreadcrumbs: Breadcrumb[] = [
  { name: "BNRA 2023 - 2026", url: "/" },
  { name: "Risk Catalogue", url: "/risks" },
];

export default function RiskFilePage({}) {
  const params = useParams() as RouteParams;

  const [tab, setTab] = useState(0);

  const { data: riskFile, reloadData: reloadRiskFile } = useRecord<DVRiskFile>({
    table: DataTable.RISK_FILE,
    id: params.risk_file_id,
  });
  const { data: otherRisks, reloadData: reloadRiskFiles } = useRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
    query: `$filter=cr4de_riskfilesid ne ${params.risk_file_id}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
  });

  const { data: participants, reloadData: reloadParticipants } = useRecords<DVParticipation<DVContact>>({
    table: DataTable.PARTICIPATION,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_contact`,
  });

  const { data: cascades, reloadData: reloadCascades } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: `$filter=_cr4de_cause_hazard_value eq ${params.risk_file_id} or _cr4de_effect_hazard_value eq ${params.risk_file_id}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition),cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
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
        {tab === 0 && <OverviewTab riskFile={riskFile} participants={participants} />}
        {tab === 1 && (
          <IdentificationTab
            riskFile={riskFile}
            cascades={cascades}
            otherRisks={otherRisks}
            onUpdateCascades={handleUpdateCascades}
          />
        )}
        {tab === 3 && <InputManagementTab riskFile={riskFile} participants={participants} />}
      </Box>
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={tab}
          onChange={(event, newValue) => {
            setTab(newValue);
          }}
        >
          <BottomNavigationAction label="Overview" icon={<AodIcon />} />
          <BottomNavigationAction label="Risk Identification" icon={<FingerprintIcon />} />
          <BottomNavigationAction label="Risk Analysis" icon={<AssessmentIcon />} />
          <BottomNavigationAction label="Expert Input" icon={<PsychologyIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}
