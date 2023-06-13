import { useState, useEffect } from "react";
import { Box, Container, Tab, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import Step2APage from "./Step2ATab";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DataTable } from "../../../hooks/useAPI";
import useLazyRecords from "../../../hooks/useLazyRecords";
import { useParams } from "react-router-dom";

type RouteParams = {
  risk_file_id: string;
};

export default function InputManagementTab({
  riskFile,
  participants,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation[] | null;
}) {
  const params = useParams() as RouteParams;

  const [value, setValue] = useState("2");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { data: directAnalyses, getData: getDirectAnalyses } = useLazyRecords<DVDirectAnalysis>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}`,
  });

  return (
    <Container>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} centered>
            <Tab label="Validation" value="1" />
            <Tab label="Step 2A" value="2" />
            <Tab label="Step 2B" value="3" />
            <Tab label="Feedback" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">Validation</TabPanel>
        <TabPanel value="2">
          <Step2APage
            riskFile={riskFile}
            participants={participants}
            directAnalyses={directAnalyses}
            getDirectAnalyses={getDirectAnalyses}
          />
        </TabPanel>
        <TabPanel value="3">2B</TabPanel>
        <TabPanel value="4">Feedback</TabPanel>
      </TabContext>
    </Container>
  );
}
