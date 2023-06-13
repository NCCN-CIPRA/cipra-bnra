import { useEffect } from "react";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import { Box } from "@mui/material";

export default function Step2APage({
  riskFile,
  participants,
  directAnalyses,

  getDirectAnalyses,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation[] | null;
  directAnalyses: DVDirectAnalysis[] | null;

  getDirectAnalyses: () => Promise<void>;
}) {
  useEffect(() => {
    if (!directAnalyses) {
      getDirectAnalyses();
    }
  }, [riskFile]);

  if (!riskFile || directAnalyses === null) return <LoadingTab />;

  return (
    <Box>
      {directAnalyses.map((da) => (
        <pre>{JSON.stringify(da, null, " ")}</pre>
      ))}
    </Box>
  );
}
