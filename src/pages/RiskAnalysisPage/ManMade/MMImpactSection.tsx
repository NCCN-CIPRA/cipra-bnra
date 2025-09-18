import { Box } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";

export default function MMImpactSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot;
}) {
  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + getImpactColor("S"),
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <Box
        className="htmleditor"
        sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        dangerouslySetInnerHTML={{ __html: riskFile.cr4de_quali_mm_mrs || "" }}
      />
    </Box>
  );
}
