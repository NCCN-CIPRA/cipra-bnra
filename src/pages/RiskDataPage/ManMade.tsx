import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useOutletContext } from "react-router-dom";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import {
  getAverageIndirectImpact,
  getAverageIndirectImpactDynamic,
} from "../../functions/Impact";
import { CascadeSection, VISUALS } from "./CascadeSection";
import { Environment } from "../../types/global";
import { getTotalCP } from "../../functions/analysis/cp";
import useSavedState from "../../hooks/useSavedState";
import { CatalyzingSection } from "./CatalyzingSection";
import { RiskFilePageContext } from "../BaseRiskFilePage";

enum SORT {
  PREFERENCE = "preference",
  IMPACT = "impact",
}

export default function ManMade({
  riskFile,
  effects,
  catalyzingEffects,
  visuals,
}: {
  riskFile: DVRiskSnapshot;
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  visuals: VISUALS;
}) {
  const { environment, publicRiskSnapshot, publicCascades } =
    useOutletContext<RiskFilePageContext>();
  const [sortAttacks, setSortAttacks] = useSavedState(
    "attack-sort",
    SORT.PREFERENCE
  );

  const totalCP = effects.reduce(
    (t, e) => t + getTotalCP(e.cr4de_quanti_cp),
    0
  );

  const dynamicAttacks = effects.map((e) => ({
    cascade: e,
    p: getTotalCP(e.cr4de_quanti_cp) / totalCP,
    i: getAverageIndirectImpact(
      publicCascades?.effects.find(
        (pE) => pE._cr4de_risk_cascade_value === e._cr4de_risk_cascade_value
      ) || e,
      publicRiskSnapshot || riskFile
    ),
    iDynamic:
      environment === Environment.DYNAMIC
        ? getAverageIndirectImpactDynamic(e, riskFile, effects)
        : null,
  }));

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Stack direction="row">
          <Typography variant="h4" sx={{ mx: 0, mb: 2, flex: 1 }}>
            Potential attacks
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              id="sort"
              value={sortAttacks}
              label="Sort"
              onChange={(e) => {
                setSortAttacks(e.target.value as SORT);
              }}
            >
              <MenuItem value={SORT.PREFERENCE}>Relative Preference</MenuItem>
              <MenuItem value={SORT.IMPACT}>Expected Impact</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Box sx={{ mb: 8 }}>
          {dynamicAttacks
            .sort((a, b) =>
              sortAttacks === SORT.PREFERENCE ? b.p - a.p : b.i - a.i
            )
            .map((e) => (
              <CascadeSection
                key={e.cascade._cr4de_risk_cascade_value}
                cause={riskFile}
                effect={e.cascade.cr4de_effect_risk}
                cascade={e.cascade}
                visuals={visuals}
                subtitle={
                  sortAttacks === SORT.PREFERENCE ? (
                    <Typography variant="body1" color="warning">
                      <b>{Math.round(10000 * e.p) / 100}%</b> preference for
                      this type of action
                    </Typography>
                  ) : (
                    <Stack direction="column" sx={{ textAlign: "right" }}>
                      <Typography variant="body1" color="warning">
                        <b>
                          {Math.round(
                            10000 * (e.iDynamic !== null ? e.iDynamic : e.i)
                          ) / 100}
                          %
                        </b>{" "}
                        of expected impact
                      </Typography>
                      {e.iDynamic !== null && (
                        <Typography variant="caption">
                          {e.iDynamic >= e.i ? "+" : ""}
                          {Math.round(10000 * (e.iDynamic - e.i)) / 100}%
                          compared to public environment
                        </Typography>
                      )}
                    </Stack>
                  )
                }
              />
            ))}
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Catalyzing risks
        </Typography>

        <Box sx={{ mb: 8 }}>
          {catalyzingEffects.map((ca) => (
            <CatalyzingSection
              key={ca._cr4de_risk_cascade_value}
              cascade={ca}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}
