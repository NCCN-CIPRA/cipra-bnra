import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  DVRiskSnapshot,
  parseRiskSnapshotQuali,
} from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import {
  getAverageDirectImpact,
  getAverageDirectImpactDynamic,
  getAverageIndirectImpact,
  getAverageIndirectImpactDynamic,
} from "../../functions/Impact";
import {
  getAverageDirectProbability,
  getAverageDirectProbabilityDynamic,
  getAverageIndirectProbability,
  getAverageIndirectProbabilityDynamic,
} from "../../functions/Probability";
import { CascadeSection, VISUALS } from "./CascadeSection";
import { DirectSection } from "./DirectSection";
import { useOutletContext } from "react-router-dom";
import { Environment } from "../../types/global";
import { CatalyzingSection } from "./CatalyzingSection";
import { ClimateChangeSection } from "./ClimateChangeSection";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { PERC_CONTRIB } from "./RiskDataPage";
import { SCENARIOS } from "../../functions/scenarios";
import { useEffect, useMemo, useState } from "react";

export default function Standard({
  riskFile,
  causes,
  effects,
  catalyzingEffects,
  climateChange,
  viewType,
  percentages,
  showConsequences,
}: {
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  viewType: VISUALS;
  percentages: PERC_CONTRIB;
  showConsequences: boolean;
}) {
  const { environment, showDiff, publicRiskSnapshot, publicCascades } =
    useOutletContext<RiskFilePageContext>();
  const parsedRiskFile = parseRiskSnapshotQuali(riskFile);
  const [causeSortOrder, setCauseSortOrder] = useState<Record<
    string,
    number
  > | null>(null);
  const [effectSortOrder, setEffectSortOrder] = useState<Record<
    string,
    number
  > | null>(null);

  let scenario: SCENARIOS | null = null;
  if (percentages === "mrs")
    scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  else if (percentages !== "none" && percentages !== "average")
    scenario = percentages as SCENARIOS;

  const dp = getAverageDirectProbability(
    publicRiskSnapshot || riskFile,
    scenario
  );
  const dpDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectProbabilityDynamic(riskFile, causes, scenario)
      : null;

  const causesWithP = causes.map((c) => {
    const publicC =
      publicCascades?.causes.find(
        (pC) => pC._cr4de_risk_cascade_value === c._cr4de_risk_cascade_value
      ) || c;

    const ip = getAverageIndirectProbability(
      publicC,
      publicRiskSnapshot || riskFile,
      scenario
    );
    const ipDynamic =
      environment === Environment.DYNAMIC
        ? getAverageIndirectProbabilityDynamic(c, riskFile, causes, scenario)
        : null;

    return {
      ...c,
      ip,
      ipDynamic,
    };
  });

  const causeElements = useMemo(() => {
    const els = [
      ...causesWithP.map((ca) => ({
        id: ca._cr4de_risk_cascade_value,
        p: ca.ipDynamic !== null ? ca.ipDynamic : ca.ip,
        el: (
          <CascadeSection
            key={ca._cr4de_risk_cascade_value}
            cause={ca.cr4de_cause_risk}
            effect={riskFile}
            cascade={ca}
            visuals={viewType}
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                {percentages !== "none" && (
                  <>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 * (ca.ipDynamic !== null ? ca.ipDynamic : ca.ip)
                        ) / 100}
                        %
                      </b>{" "}
                      of total probability
                    </Typography>
                    {ca.ipDynamic !== null && showDiff && (
                      <Typography variant="caption">
                        {ca.ipDynamic >= ca.ip ? "+" : ""}
                        {Math.round(10000 * (ca.ipDynamic - ca.ip)) / 100}%
                        compared to public environment
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            }
          />
        ),
      })),
      {
        id: riskFile._cr4de_risk_file_value,
        p: dpDynamic !== null ? dpDynamic : dp,
        el: (
          <DirectSection
            riskFile={parsedRiskFile}
            qualiField="dp"
            quantiFields={["dp"]}
            title="Other causes"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                {percentages !== "none" && (
                  <>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 * (dpDynamic !== null ? dpDynamic : dp)
                        ) / 100}
                        %
                      </b>{" "}
                      of total probability
                    </Typography>
                    {dpDynamic !== null && showDiff && (
                      <Typography variant="caption">
                        {dpDynamic >= dp ? "+" : ""}
                        {Math.round(10000 * (dpDynamic - dp)) / 100}% compared
                        to public environment
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            }
          />
        ),
      },
    ].sort((a, b) => b.p - a.p);

    if (!causeSortOrder) {
      const sortOrder = {} as Record<string, number>;
      for (let i = 0; i < els.length; i++) {
        sortOrder[els[i].id] = i;
      }
      setCauseSortOrder(sortOrder);
    }

    return els;
  }, [
    causeSortOrder,
    causesWithP,
    dp,
    dpDynamic,
    parsedRiskFile,
    percentages,
    riskFile,
    showDiff,
    viewType,
  ]);

  const effectsWithI = useMemo(() => {
    const els = effects
      .map((e) => {
        const publicE =
          publicCascades?.effects.find(
            (pE) => pE._cr4de_risk_cascade_value === e._cr4de_risk_cascade_value
          ) || e;

        return {
          cascade: e,
          i: getAverageIndirectImpact(
            publicE,
            publicRiskSnapshot || riskFile,
            scenario
          ),
          iDynamic:
            environment === Environment.DYNAMIC
              ? getAverageIndirectImpactDynamic(e, riskFile, effects, scenario)
              : null,
        };
      })
      .sort((a, b) => b.i - a.i);

    if (!effectSortOrder) {
      const sortOrder = {} as Record<string, number>;
      for (let i = 0; i < els.length; i++) {
        sortOrder[els[i].cascade._cr4de_risk_cascade_value] = i;
      }
      setEffectSortOrder(sortOrder);
    }

    return els;
  }, [
    effectSortOrder,
    effects,
    environment,
    publicCascades?.effects,
    publicRiskSnapshot,
    riskFile,
    scenario,
  ]);

  useEffect(() => {
    setCauseSortOrder(null);
    setEffectSortOrder(null);
  }, [percentages]);

  const iDirectH = getAverageDirectImpact(
    publicRiskSnapshot || riskFile,
    scenario,
    ["ha", "hb", "hc"]
  );
  const iDirectHDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, scenario, [
          "ha",
          "hb",
          "hc",
        ])
      : null;
  const iDirectS = getAverageDirectImpact(
    publicRiskSnapshot || riskFile,
    scenario,
    ["sa", "sb", "sc", "sd"]
  );
  const iDirectSDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, scenario, [
          "sa",
          "sb",
          "sc",
          "sd",
        ])
      : null;
  const iDirectE = getAverageDirectImpact(
    publicRiskSnapshot || riskFile,
    scenario,
    ["ea"]
  );
  const iDirectEDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, scenario, ["ea"])
      : null;
  const iDirectF = getAverageDirectImpact(
    publicRiskSnapshot || riskFile,
    scenario,
    ["fa", "fb"]
  );
  const iDirectFDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, scenario, ["fa", "fb"])
      : null;

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Potential causes
        </Typography>

        <Box sx={{ mb: 8 }}>
          {causeElements
            .sort((a, b) =>
              causeSortOrder
                ? causeSortOrder[a.id] - causeSortOrder[b.id]
                : b.p - a.p
            )
            .map((ca) => ca.el)}
        </Box>

        {showConsequences && (
          <>
            <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
              Potential consequences
            </Typography>

            <Box sx={{ mb: 8 }}>
              {effectsWithI
                .sort((a, b) =>
                  effectSortOrder
                    ? effectSortOrder[a.cascade._cr4de_risk_cascade_value] -
                      effectSortOrder[b.cascade._cr4de_risk_cascade_value]
                    : b.i - a.i
                )
                .map((e) => (
                  <CascadeSection
                    key={e.cascade._cr4de_risk_cascade_value}
                    cause={riskFile}
                    effect={e.cascade.cr4de_effect_risk}
                    cascade={e.cascade}
                    visuals={viewType}
                    subtitle={
                      <Stack direction="column" sx={{ textAlign: "right" }}>
                        {percentages !== "none" && (
                          <>
                            <Typography variant="body1" color="warning">
                              <b>
                                {Math.round(
                                  10000 *
                                    (e.iDynamic !== null ? e.iDynamic : e.i)
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
                    }
                  />
                ))}
            </Box>
          </>
        )}

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Remaining impact
        </Typography>

        <Box sx={{ mb: 8 }}>
          <DirectSection
            riskFile={parsedRiskFile}
            title="Human impact"
            quantiFields={["ha", "hb", "hc"]}
            qualiField="h"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                {percentages !== "none" && (
                  <>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 *
                            (iDirectHDynamic !== null
                              ? iDirectHDynamic
                              : iDirectH)
                        ) / 100}
                        %
                      </b>{" "}
                      of expected impact
                    </Typography>
                    {iDirectHDynamic !== null && showDiff && (
                      <Typography variant="caption">
                        {iDirectHDynamic >= iDirectH ? "+" : ""}
                        {Math.round(10000 * (iDirectHDynamic - iDirectH)) / 100}
                        % compared to public environment
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Societal impact"
            quantiFields={["sa", "sb", "sc", "sd"]}
            qualiField="s"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                {percentages !== "none" && (
                  <>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 *
                            (iDirectSDynamic !== null
                              ? iDirectSDynamic
                              : iDirectS)
                        ) / 100}
                        %
                      </b>{" "}
                      of expected impact
                    </Typography>
                    {iDirectSDynamic !== null && showDiff && (
                      <Typography variant="caption">
                        {iDirectSDynamic >= iDirectS ? "+" : ""}
                        {Math.round(10000 * (iDirectSDynamic - iDirectS)) / 100}
                        % compared to public environment
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Environmental impact"
            quantiFields={["ea"]}
            qualiField="e"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                {percentages !== "none" && (
                  <>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 *
                            (iDirectEDynamic !== null
                              ? iDirectEDynamic
                              : iDirectE)
                        ) / 100}
                        %
                      </b>{" "}
                      of expected impact
                    </Typography>
                    {iDirectEDynamic !== null && showDiff && (
                      <Typography variant="caption">
                        {iDirectEDynamic >= iDirectE ? "+" : ""}
                        {Math.round(10000 * (iDirectEDynamic - iDirectE)) / 100}
                        % compared to public environment
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Financial impact"
            quantiFields={["fa", "fb"]}
            qualiField="f"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                {percentages !== "none" && (
                  <>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 *
                            (iDirectFDynamic !== null
                              ? iDirectFDynamic
                              : iDirectF)
                        ) / 100}
                        %
                      </b>{" "}
                      of expected impact
                    </Typography>
                    {iDirectFDynamic !== null && showDiff && (
                      <Typography variant="caption">
                        {iDirectFDynamic >= iDirectF ? "+" : ""}
                        {Math.round(10000 * (iDirectFDynamic - iDirectF)) / 100}
                        % compared to public environment
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
            }
          />
        </Box>

        {climateChange && (
          <>
            <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
              Climate change
            </Typography>

            <Box sx={{ mb: 8 }}>
              <ClimateChangeSection
                riskFile={riskFile}
                cascade={climateChange}
              />
            </Box>
          </>
        )}

        {catalyzingEffects.length > 0 && (
          <>
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
          </>
        )}
      </Box>
    </>
  );
}
