import { Box } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import getImpactColor from "../../../functions/getImpactColor";

export default function PreferredActionsSection({
  riskFile,
}: {
  riskFile: DVRiskFile;
}) {
  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + getImpactColor("H"),
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <Box
        className="htmleditor"
        sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        dangerouslySetInnerHTML={{ __html: riskFile.cr4de_mrs_actions || "" }}
      />
    </Box>
  );
}
