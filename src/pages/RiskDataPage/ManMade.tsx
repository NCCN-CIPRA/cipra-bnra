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
import {
  getAverageCP,
  getAverageCPDynamic,
  getTotalCP,
} from "../../functions/analysis/cp";
import useSavedState from "../../hooks/useSavedState";
import { CatalyzingSection } from "./CatalyzingSection";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { SCENARIOS } from "../../functions/scenarios";
import { useMemo } from "react";

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
  const { environment, showDiff, publicRiskSnapshot, publicCascades } =
    useOutletContext<RiskFilePageContext>();
  const [sortAttacks, setSortAttacks] = useSavedState(
    "attack-sort",
    SORT.PREFERENCE
  );

  const totalCPs = useMemo(
    () =>
      effects && {
        [SCENARIOS.CONSIDERABLE]: getTotalCP(SCENARIOS.CONSIDERABLE, effects),
        [SCENARIOS.MAJOR]: getTotalCP(SCENARIOS.MAJOR, effects),
        [SCENARIOS.EXTREME]: getTotalCP(SCENARIOS.EXTREME, effects),
      },
    [effects]
  );

  const dynamicAttacks = useMemo(() => {
    if (!totalCPs || !effects) return [];

    return effects.map((e) => ({
      cascade: e,
      p: getAverageCP(e.cr4de_quanti_cp, totalCPs),
      pDynamic:
        environment === Environment.DYNAMIC
          ? getAverageCPDynamic(e, effects)
          : null,
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
  }, [
    effects,
    environment,
    publicCascades?.effects,
    publicRiskSnapshot,
    riskFile,
    totalCPs,
  ]);

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
                    <Stack direction="column" sx={{ textAlign: "right" }}>
                      <Typography variant="body1" color="warning">
                        <b>
                          {Math.round(
                            10000 * (e.pDynamic !== null ? e.pDynamic : e.p)
                          ) / 100}
                          %
                        </b>{" "}
                        preference for this type of action
                      </Typography>
                      {e.iDynamic !== null && showDiff && (
                        <Typography variant="caption">
                          {e.iDynamic >= e.i ? "+" : ""}
                          {Math.round(10000 * (e.iDynamic - e.i)) / 100}%
                          compared to public environment
                        </Typography>
                      )}
                    </Stack>
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
                      {e.iDynamic !== null && showDiff && (
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
