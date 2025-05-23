import { Box } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIO_SUFFIX } from "../../../functions/scenarios";

export default function CBSection({
  riskFile,
  scenarioSuffix,
}: {
  riskFile: DVRiskFile;
  scenarioSuffix: SCENARIO_SUFFIX;
}) {
  return (
    <>
      <Box
        className="htmleditor"
        sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        dangerouslySetInnerHTML={{
          __html:
            riskFile[`cr4de_cross_border_impact_quali${scenarioSuffix}`] || "",
        }}
      />
    </>
  );
}
