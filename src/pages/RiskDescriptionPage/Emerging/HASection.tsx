import { Box } from "@mui/material";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";

export default function HASection({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  return (
    <Box
      className="htmleditor"
      sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
      dangerouslySetInnerHTML={{
        __html: riskSummary.cr4de_horizon_analysis || "",
      }}
    />
  );
}
