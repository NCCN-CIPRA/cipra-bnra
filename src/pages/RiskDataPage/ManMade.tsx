import { Box, Stack } from "@mui/material";
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
import { CatalyzingSection } from "./CatalyzingSection";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { SCENARIOS } from "../../functions/scenarios";
import { useMemo } from "react";
import { PERC_CONTRIB, SORT_ATTACKS } from "./RiskDataPage";

export default function ManMade({
  riskFile,
  effects,
  catalyzingEffects,
  viewType,
  percentages,
  sortAttacks,
}: {
  riskFile: DVRiskSnapshot;
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  viewType: VISUALS;
  percentages: PERC_CONTRIB;
  sortAttacks: SORT_ATTACKS;
}) {
  const { environment, showDiff, publicRiskSnapshot, publicCascades } =
    useOutletContext<RiskFilePageContext>();

  const totalCPs = useMemo(
    () =>
      effects && {
        [SCENARIOS.CONSIDERABLE]: getTotalCP(
          SCENARIOS.CONSIDERABLE,
          publicCascades?.effects || effects
        ),
        [SCENARIOS.MAJOR]: getTotalCP(
          SCENARIOS.MAJOR,
          publicCascades?.effects || effects
        ),
        [SCENARIOS.EXTREME]: getTotalCP(
          SCENARIOS.EXTREME,
          publicCascades?.effects || effects
        ),
      },
    [publicCascades, effects]
  );

  const dynamicAttacks = useMemo(() => {
    if (!totalCPs || !effects) return [];

    let scenario: SCENARIOS | null = null;
    if (percentages === "mrs")
      scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
    else if (percentages !== "none" && percentages !== "average")
      scenario = percentages as SCENARIOS;

    return effects.map((e) => {
      const publicE =
        publicCascades?.effects.find(
          (pE) => pE._cr4de_risk_cascade_value === e._cr4de_risk_cascade_value
        ) || e;

      const p = getAverageCP(publicE.cr4de_quanti_cp, totalCPs, scenario);
      const pDynamic =
        environment === Environment.DYNAMIC
          ? getAverageCPDynamic(e, effects, scenario)
          : null;
      const i = getAverageIndirectImpact(
        publicE,
        publicRiskSnapshot || riskFile,
        scenario
      );
      const iDynamic =
        environment === Environment.DYNAMIC
          ? getAverageIndirectImpactDynamic(e, riskFile, effects, scenario)
          : null;

      return {
        cascade: e,
        p,
        pDynamic,
        i,
        iDynamic,
      };
    });
  }, [
    effects,
    environment,
    publicCascades?.effects,
    publicRiskSnapshot,
    riskFile,
    totalCPs,
    percentages,
  ]);

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Typography variant="h4" sx={{ mx: 0, mb: 2, flex: 1 }}>
          Potential attacks
        </Typography>

        <Box sx={{ mb: 8 }}>
          {dynamicAttacks
            .sort((a, b) =>
              sortAttacks === "preference" ? b.p - a.p : b.i - a.i
            )
            .map((e) => (
              <CascadeSection
                key={e.cascade._cr4de_risk_cascade_value}
                cause={riskFile}
                effect={e.cascade.cr4de_effect_risk}
                cascade={e.cascade}
                visuals={viewType}
                subtitle={
                  sortAttacks === "preference" ? (
                    <Stack direction="column" sx={{ textAlign: "right" }}>
                      {percentages !== "none" && (
                        <>
                          <Typography variant="body1" color="warning">
                            <b>
                              {Math.round(
                                10000 * (e.pDynamic !== null ? e.pDynamic : e.p)
                              ) / 100}
                              %
                            </b>{" "}
                            preference for this type of action
                          </Typography>
                          {e.pDynamic !== null && showDiff && (
                            <Typography variant="caption">
                              {e.pDynamic >= e.p ? "+" : ""}
                              {Math.round(10000 * (e.pDynamic - e.p)) / 100}%
                              compared to public environment
                            </Typography>
                          )}
                        </>
                      )}
                    </Stack>
                  ) : (
                    <Stack direction="column" sx={{ textAlign: "right" }}>
                      {percentages !== "none" && (
                        <>
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
                        </>
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
