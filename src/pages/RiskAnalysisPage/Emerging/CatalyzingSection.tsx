import { Box, Typography } from "@mui/material";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";

function CatalyzingEffect({
  cascade,
}: {
  cascade: DVRiskCascade<SmallRisk, SmallRisk>;
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
        href={`/risks/${cascade.cr4de_effect_hazard.cr4de_riskfilesid}/evolution`}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {cascade.cr4de_effect_hazard.cr4de_title}
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
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
}) {
  return (
    <>
      {cascades.map((c) => {
        return <CatalyzingEffect key={c.cr4de_bnrariskcascadeid} cascade={c} />;
      })}
    </>
  );
}
