import { Box } from "@mui/material";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";

export default function ProbabilitySection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
}) {
  return (
    <Box
      className="htmleditor"
      sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
      dangerouslySetInnerHTML={{ __html: riskFile.cr4de_quali_p_mrs || "" }}
    />
  );
}
