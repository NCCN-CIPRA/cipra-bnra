import { Box } from "@mui/material";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";

export default function DefinitionSection({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  return (
    <Box
      className="htmleditor"
      sx={{ my: 2, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
      dangerouslySetInnerHTML={{ __html: riskSummary.cr4de_definition || "" }}
    />
  );
}
