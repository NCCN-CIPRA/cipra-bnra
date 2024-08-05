import { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import Step2APage from "./Step2ATab";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { useParams, useSearchParams } from "react-router-dom";
import { DVContact } from "../../../types/dataverse/DVContact";
import Step2BTab from "./Step2BTab";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import InputOverviewTab from "./InputOverviewTab";

type RouteParams = {
  risk_file_id: string;
};

export default function InputManagementTab({
  riskFile,
  cascades,
  participants,
  directAnalyses,
  cascadeAnalyses,

  reloadRiskFile,
  reloadCascades,
  reloadDirectAnalyses,
  reloadCascadeAnalyses,
}: {
  riskFile: DVRiskFile | null;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  participants: DVParticipation<DVContact>[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;

  reloadRiskFile: () => void;
  reloadCascades: () => void;
  reloadDirectAnalyses: () => void;
  reloadCascadeAnalyses: () => void;
}) {
  const params = useParams() as RouteParams;
  const [searchParams, setSearchParams] = useSearchParams();

  const [value, setValue] = useState();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({
      tab: "input",
      subtab: newValue,
    });
  };

  return (
    <TabContext value={searchParams.get("subtab") || "0"}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} centered>
          <Tab label="Overview" value="0" />
          <Tab label="Validation" value="1" />
          <Tab label="Step 2A" value="2" disabled={riskFile?.cr4de_risk_type === RISK_TYPE.EMERGING} />
          <Tab label="Step 2B" value="3" />
          <Tab label="Feedback" value="4" />
        </TabList>
      </Box>
      <TabPanel value="0">
        <InputOverviewTab
          riskFile={riskFile}
          participants={participants}
          cascades={cascades}
          directAnalyses={directAnalyses}
          cascadeAnalyses={cascadeAnalyses}
        />
      </TabPanel>
      <TabPanel value="1">Validation</TabPanel>
      <TabPanel value="2">
        <Step2APage
          riskFile={riskFile}
          participants={participants}
          directAnalyses={directAnalyses}
          reloadRiskFile={reloadRiskFile}
          reloadDirectAnalyses={reloadDirectAnalyses}
        />
      </TabPanel>
      <TabPanel value="3">
        <Step2BTab
          riskFile={riskFile}
          cascades={cascades}
          directAnalyses={directAnalyses}
          cascadeAnalyses={cascadeAnalyses}
          reloadRiskFile={reloadRiskFile}
          reloadCascades={reloadCascades}
          reloadDirectAnalyses={reloadDirectAnalyses}
          reloadCascadeAnalyses={reloadCascadeAnalyses}
        />
      </TabPanel>
      <TabPanel value="4">Feedback</TabPanel>
    </TabContext>
  );
}
