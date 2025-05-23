import { Box } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";

export default function ProbabilitySection({
  riskFile,
}: {
  riskFile: DVRiskFile;
}) {
  return (
    <Box
      className="htmleditor"
      sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
      dangerouslySetInnerHTML={{ __html: riskFile.cr4de_mrs_probability || "" }}
    />
  );
}
