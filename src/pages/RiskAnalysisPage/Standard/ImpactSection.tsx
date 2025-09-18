import { Box, Typography } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { IMPACT_CATEGORY } from "../../../functions/Impact";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";

export default function ImpactSection({
  riskFile,
  impactName,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
  impactName: "human" | "societal" | "environmental" | "financial";
}) {
  const impactLetter = impactName[0] as "h" | "s" | "e" | "f";
  const impactLetterUC = impactLetter.toUpperCase() as IMPACT_CATEGORY;

  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + getImpactColor(impactLetterUC),
        px: 2,
        py: 2,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6">
        {impactLetter.toUpperCase()}
        {impactName.slice(1)} Impact
      </Typography>
      <Box
        className="htmleditor"
        sx={{ mb: 0, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        dangerouslySetInnerHTML={{
          __html: riskFile[`cr4de_quali_${impactLetter}_mrs`] || "",
        }}
      />
    </Box>
  );
}
