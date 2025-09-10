import { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { SCENARIOS } from "../../functions/scenarios";
// import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

export default function ClimateChangeGraph({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile | null;
  cascades: DVRiskCascade<SmallRisk, unknown>[] | null;
}) {
  const [scenario, setScenario] = useState<"wcs" | SCENARIOS>("wcs");
  const [causes, setCauses] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  useEffect(() => {
    if (!riskFile || !cascades) return;

    setCauses(
      cascades.filter(
        (c) =>
          c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
          c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
      )
    );
  }, [riskFile, cascades]);

  return (
    <Accordion disabled={!riskFile || !causes}>
      <AccordionSummary>
        <Typography variant="subtitle2">Climate Change diagram</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        {/* <Stack direction="row" sx={{ mb: 8 }}>
          {riskFile && causes && (
            <ClimateChangeChart
              riskFile={riskFile}
              causes={causes}
              scenario={
                scenario === "wcs"
                  ? riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE
                  : scenario
              }
            />
          )}
        </Stack> */}
      </AccordionDetails>
      <AccordionActions>
        <Stack direction="row" spacing={5} sx={{ flex: 1 }}>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Show Scenario</InputLabel>
            <Select
              value={scenario}
              label="Show Scenario"
              onChange={(e) => setScenario(e.target.value as SCENARIOS | "wcs")}
            >
              <MenuItem value={"wcs"}>Worst Case</MenuItem>
              <MenuItem value={"considerable"}>Considerable</MenuItem>
              <MenuItem value={"major"}>Major</MenuItem>
              <MenuItem value={"extreme"}>Extreme</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
