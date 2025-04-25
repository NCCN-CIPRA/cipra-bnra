import { useEffect } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import Step2APage from "./Step2ATab";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useOutletContext, useSearchParams } from "react-router-dom";
import Step2BTab from "./Step2BTab";
import InputOverviewTab from "./InputOverviewTab";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";

export default function RiskInputPage() {
  const {
    riskFile,
    cascades,
    participants,
    directAnalyses,
    cascadeAnalyses,
    reloadRiskFile,
    loadParticipants,
    loadDirectAnalyses,
    loadCascadeAnalyses,
  } = useOutletContext<RiskFilePageContext>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({
      tab: "input",
      subtab: newValue,
    });
  };

  useEffect(() => {
    if (!participants) loadParticipants();
    if (!directAnalyses) loadDirectAnalyses();
    if (!cascadeAnalyses) loadCascadeAnalyses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!directAnalyses || !cascadeAnalyses)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <TabContext value={searchParams.get("subtab") || "0"}>
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
        <InputOverviewTab
          riskFile={riskFile}
          participants={participants}
          cascades={cascades[riskFile.cr4de_riskfilesid].all}
          directAnalyses={directAnalyses}
          cascadeAnalyses={cascadeAnalyses}
        />
      </TabPanel>
      <TabPanel value="1">Validation</TabPanel>
      <TabPanel value="2">
        <Step2APage
          riskFile={riskFile}
          directAnalyses={directAnalyses}
          reloadRiskFile={() =>
            reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
          }
          reloadDirectAnalyses={loadDirectAnalyses}
        />
      </TabPanel>
      <TabPanel value="3">
        <Step2BTab
          riskFile={riskFile}
          cascades={cascades[riskFile.cr4de_riskfilesid].all}
          directAnalyses={directAnalyses}
          cascadeAnalyses={cascadeAnalyses}
          reloadRiskFile={() =>
            reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
          }
          reloadCascades={() =>
            reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
          }
          reloadDirectAnalyses={loadDirectAnalyses}
          reloadCascadeAnalyses={loadCascadeAnalyses}
        />
      </TabPanel>
      <TabPanel value="4">Feedback</TabPanel>
    </TabContext>
  );
}
