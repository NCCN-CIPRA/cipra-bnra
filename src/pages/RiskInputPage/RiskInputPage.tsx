import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import Step2APage from "./Step2ATab";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useOutletContext, useSearchParams } from "react-router-dom";
// import Step2BTab from "./Step2BTab";
// import InputOverviewTab from "./InputOverviewTab";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";

export default function RiskInputPage() {
  const api = useAPI();
  const { riskSummary, riskFile, cascades } =
    useOutletContext<RiskFilePageContext>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({
      tab: "input",
      subtab: newValue,
    });
  };

  const { data: participants } = useQuery({
    queryKey: [DataTable.PARTICIPATION],
    queryFn: () =>
      api.getParticipants<DVParticipation<DVContact>>(
        `$filter=_cr4de_risk_file_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_contact`
      ),
  });

  const { data: directAnalyses } = useQuery({
    queryKey: [DataTable.DIRECT_ANALYSIS],
    queryFn: () =>
      api.getDirectAnalyses<DVDirectAnalysis<unknown, DVContact>>(
        `$filter=_cr4de_risk_file_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_expert($select=emailaddress1)`
      ),
  });

  const { data: cascadeAnalyses } = useQuery({
    queryKey: [DataTable.CASCADE_ANALYSIS],
    queryFn: () =>
      api.getCascadeAnalyses<DVCascadeAnalysis<unknown, unknown, DVContact>>(
        `$filter=_cr4de_risk_file_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_expert($select=emailaddress1)`
      ),
  });

  if (
    !riskFile ||
    !cascades ||
    !participants ||
    !directAnalyses ||
    !cascadeAnalyses
  )
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <TabContext value={searchParams.get("subtab") || "0"}>
      <Box sx={{ flexDirection: "column", width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} centered>
            <Tab label="Overview" value="0" />
            <Tab label="Validation" value="1" />
            <Tab
              label="Step 2A"
              value="2"
              disabled={riskFile?.cr4de_risk_type === RISK_TYPE.EMERGING}
            />
            <Tab label="Step 2B" value="3" />
            <Tab label="Feedback" value="4" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {/* <InputOverviewTab
            riskFile={riskFile}
            participants={participants}
            cascades={cascades.all}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
          /> */}
        </TabPanel>
        <TabPanel value="1">Validation</TabPanel>
        <TabPanel value="2">
          <Step2APage riskFile={riskFile} directAnalyses={directAnalyses} />
        </TabPanel>
        <TabPanel value="3">
          {/* <Step2BTab
            riskFile={riskFile}
            cascades={cascades.all}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
          /> */}
        </TabPanel>
        <TabPanel value="4">Feedback</TabPanel>
      </Box>
    </TabContext>
  );
}
