import { Box, Typography } from "@mui/material";
import { IntensityParameter } from "../../functions/intensityParameters";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS, unwrap } from "../../functions/scenarios";

export default function Scenario({
  intensityParameters,
  riskFile,
  scenario,
}: {
  intensityParameters: IntensityParameter[];
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
}) {
  const scenarios = unwrap(
    intensityParameters,
    riskFile.cr4de_scenario_considerable,
    riskFile.cr4de_scenario_major,
    riskFile.cr4de_scenario_extreme
  );

  return (
    <Box sx={{ borderLeft: "solid 8px " + SCENARIO_PARAMS[scenario].color, pl: 2, py: 1, mt: 2, background: "white" }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        The <i>{scenario}</i> scenario was identified as the <i>Most Relevant Scenario</i>. This means that it represent
        the highest amount of risk (probability x impact) of the three scenarios. It can be summarized as follows:
      </Typography>
      {scenarios[scenario].map((ip) => (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">{ip.name}</Typography>
          <Box>{ip.value}</Box>
          {/* <Box dangerouslySetInnerHTML={{ __html: ip.description || "" }} />

          <Box dangerouslySetInnerHTML={{ __html: ip.value || "" }} /> */}
        </Box>
      ))}
      <div style={{ clear: "both" }} />
    </Box>
  );
}
