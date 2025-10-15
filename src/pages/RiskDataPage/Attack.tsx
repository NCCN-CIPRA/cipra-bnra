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
  // getAverageIndirectImpactDynamic,
} from "../../functions/Impact";
import {
  getAverageDirectProbability,
  getAverageDirectProbabilityDynamic,
  getAverageIndirectProbability,
  getAverageIndirectProbabilityDynamic,
} from "../../functions/Probability";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { CascadeSection, VISUALS } from "./CascadeSection";
import { DirectSection } from "./DirectSection";
import { useOutletContext } from "react-router-dom";
import { Environment } from "../../types/global";
import { CatalyzingSection } from "./CatalyzingSection";
import { ClimateChangeSection } from "./ClimateChangeSection";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { PERC_CONTRIB } from "./RiskDataPage";
import { SCENARIOS } from "../../functions/scenarios";
import { useMemo, useState } from "react";

export default function Attack({
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
  const [actorSortOrder, setActorSortOrder] = useState<Record<
    string,
    number
  > | null>(null);
  const [effectSortOrder, setEffectSortOrder] = useState<Record<
    string,
    number
  > | null>(null);
  const parsedRiskFile = parseRiskSnapshotQuali(riskFile);

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
  const causesWithP = causes.map((c) => ({
    ...c,
    ip: getAverageIndirectProbability(
      publicCascades?.causes.find(
        (pC) => pC._cr4de_risk_cascade_value === c._cr4de_risk_cascade_value
      ) || c,
      publicRiskSnapshot || riskFile,
      scenario
    ),
    ipDynamic:
      environment === Environment.DYNAMIC
        ? getAverageIndirectProbabilityDynamic(c, riskFile, causes, scenario)
        : null,
  }));

  const actors = useMemo(() => {
    const els = [
      ...causesWithP
        .filter((c) => c.cr4de_cause_risk.cr4de_risk_type === RISK_TYPE.MANMADE)
        .map((ca) => ({
          id: ca._cr4de_risk_cascade_value,
          p: ca.ip,
          el: (
            <CascadeSection
              key={ca._cr4de_risk_cascade_value}
              cause={ca.cr4de_cause_risk}
              effect={riskFile}
              cascade={ca}
              visuals={viewType}
              disabled={true}
              disabledMessage="To edit these values, please use the actor risk file"
              subtitle={
                <Stack direction="column" sx={{ textAlign: "right" }}>
                  {percentages !== "none" && (
                    <>
                      <Typography variant="body1" color="warning">
                        <b>
                          {Math.round(
                            10000 *
                              (ca.ipDynamic !== null ? ca.ipDynamic : ca.ip)
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
        p: dp,
        el: (
          <DirectSection
            riskFile={parsedRiskFile}
            qualiField="dp"
            quantiFields={["dp"]}
            title="Other actors"
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

    if (!actorSortOrder) {
      const sortOrder = {} as Record<string, number>;
      for (let i = 0; i < els.length; i++) {
        sortOrder[els[i].id] = i;
      }
      setActorSortOrder(sortOrder);
    }

    return els;
  }, [
    actorSortOrder,
    causesWithP,
    dp,
    dpDynamic,
    parsedRiskFile,
    percentages,
    riskFile,
    showDiff,
    viewType,
  ]);

  const dynamicEffects = useMemo(() => {
    const els = effects
      .map((e) => ({
        cascade: e,
        i: getAverageIndirectImpact(
          publicCascades?.effects.find(
            (pE) => pE._cr4de_risk_cascade_value === e._cr4de_risk_cascade_value
          ) || e,
          publicRiskSnapshot || riskFile,
          scenario
        ),
        iDynamic:
          environment === Environment.DYNAMIC
            ? getAverageIndirectImpactDynamic(e, riskFile, effects, scenario)
            : null,
      }))
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
          Malicious actors
        </Typography>

        <Box sx={{ mb: 8 }}>
          <>
            {actors
              .sort((a, b) =>
                actorSortOrder
                  ? actorSortOrder[a.id] - actorSortOrder[b.id]
                  : b.p - a.p
              )
              .map((ca) => ca.el)}
          </>
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Other indirect causes
        </Typography>

        <Box sx={{ mb: 8 }}>
          {causesWithP
            .filter(
              (c) => c.cr4de_cause_risk.cr4de_risk_type !== RISK_TYPE.MANMADE
            )
            .sort((a, b) => b.ip - a.ip)
            .map((ca) => (
              <CascadeSection
                key={ca._cr4de_risk_cascade_value}
                cause={ca.cr4de_cause_risk}
                effect={riskFile}
                cascade={ca}
                visuals={viewType}
                isAttackOtherCause={true}
                subtitle={
                  <Stack direction="column" sx={{ textAlign: "right" }}>
                    {percentages !== "none" && (
                      <>
                        <Typography variant="body1" color="warning">
                          <b>
                            {Math.round(
                              10000 *
                                (ca.ipDynamic !== null ? ca.ipDynamic : ca.ip)
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
            ))}
        </Box>

        {showConsequences && (
          <>
            <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
              Potential consequences
            </Typography>
            <Box sx={{ mb: 8 }}>
              {dynamicEffects
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
          Remaining impact not due to cascade effects
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
