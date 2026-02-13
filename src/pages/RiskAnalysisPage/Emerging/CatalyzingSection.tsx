import { Box, Typography } from "@mui/material";
import { DVCascadeSnapshot } from "../../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

function CatalyzingEffect({
  cascade,
}: {
  cascade: DVCascadeSnapshot<unknown, DVRiskSummary, SmallRisk>;
}) {
  return (
    <Box
      sx={{
        borderLeft: "solid 8px #eee",
        mt: 2,
        px: 2,
        py: 1,
        backgroundColor: "white",
      }}
    >
      <a
        href={`/risks/${cascade.cr4de_effect_risk.cr4de_riskfilesid}/evolution`}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {cascade.cr4de_effect_risk.cr4de_title}
        </Typography>
      </a>
      <Box
        className="htmleditor"
        sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        dangerouslySetInnerHTML={{ __html: cascade.cr4de_description || "" }}
      />
    </Box>
  );
}

export default function CatalyzingSection({
  cascades,
}: {
  cascades: DVCascadeSnapshot<unknown, DVRiskSummary, SmallRisk>[];
}) {
  return (
    <>
      {cascades.map((c) => {
        return (
          <CatalyzingEffect key={c._cr4de_risk_cascade_value} cascade={c} />
        );
      })}
    </>
  );
}
