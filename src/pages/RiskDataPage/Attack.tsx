import { Box, IconButton, Stack } from "@mui/material";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import useSavedState from "../../hooks/useSavedState";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Attack({
  riskFile,
  causes,
  effects,
  catalyzingEffects,
  climateChange,
  visuals,
}: {
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  visuals: VISUALS;
}) {
  const { environment, publicRiskSnapshot, publicCascades } =
    useOutletContext<RiskFilePageContext>();
  const [consequencesVisible, setConsequencesVisible] = useSavedState(
    `consequences-${riskFile._cr4de_risk_file_value}`,
    true
  );
  const parsedRiskFile = parseRiskSnapshotQuali(riskFile);

  const dp = getAverageDirectProbability(publicRiskSnapshot || riskFile);
  const dpDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectProbabilityDynamic(riskFile, causes)
      : null;
  const causesWithP = causes.map((c) => ({
    ...c,
    ip: getAverageIndirectProbability(
      publicCascades?.causes.find(
        (pC) => pC._cr4de_risk_cascade_value === c._cr4de_risk_cascade_value
      ) || c,
      publicRiskSnapshot || riskFile
    ),
    ipDynamic:
      environment === Environment.DYNAMIC
        ? getAverageIndirectProbabilityDynamic(c, riskFile, causes)
        : null,
  }));

  const actors = [
    ...causesWithP
      .filter((c) => c.cr4de_cause_risk.cr4de_risk_type === RISK_TYPE.MANMADE)
      .map((ca) => ({
        p: ca.ip,
        el: (
          <CascadeSection
            key={ca._cr4de_risk_cascade_value}
            cause={ca.cr4de_cause_risk}
            effect={riskFile}
            cascade={ca}
            visuals={visuals}
            disabled={true}
            disabledMessage="To edit these values, please use the actor risk file"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 * (ca.ipDynamic !== null ? ca.ipDynamic : ca.ip)
                    ) / 100}
                    %
                  </b>{" "}
                  of total probability
                </Typography>
                {ca.ipDynamic !== null && (
                  <Typography variant="caption">
                    {ca.ipDynamic >= ca.ip ? "+" : ""}
                    {Math.round(10000 * (ca.ipDynamic - ca.ip)) / 100}% compared
                    to public environment
                  </Typography>
                )}
              </Stack>
            }
          />
        ),
      })),
    {
      p: dp,
      el: (
        <DirectSection
          riskFile={parsedRiskFile}
          qualiField="dp"
          quantiFields={["dp"]}
          title="Other actors"
          subtitle={
            <Stack direction="column" sx={{ textAlign: "right" }}>
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(10000 * (dpDynamic !== null ? dpDynamic : dp)) /
                    100}
                  %
                </b>{" "}
                of total probability
              </Typography>
              {dpDynamic !== null && (
                <Typography variant="caption">
                  {dpDynamic >= dp ? "+" : ""}
                  {Math.round(10000 * (dpDynamic - dp)) / 100}% compared to
                  public environment
                </Typography>
              )}
            </Stack>
          }
        />
      ),
    },
  ];

  const dynamicEffects = effects.map((e) => ({
    cascade: e,
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

  const iDirectH = getAverageDirectImpact(publicRiskSnapshot || riskFile, [
    "ha",
    "hb",
    "hc",
  ]);
  const iDirectHDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, ["ha", "hb", "hc"])
      : null;
  const iDirectS = getAverageDirectImpact(publicRiskSnapshot || riskFile, [
    "sa",
    "sb",
    "sc",
    "sd",
  ]);
  const iDirectSDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, [
          "sa",
          "sb",
          "sc",
          "sd",
        ])
      : null;
  const iDirectE = getAverageDirectImpact(publicRiskSnapshot || riskFile, [
    "ea",
  ]);
  const iDirectEDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, ["ea"])
      : null;
  const iDirectF = getAverageDirectImpact(publicRiskSnapshot || riskFile, [
    "fa",
    "fb",
  ]);
  const iDirectFDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, ["fa", "fb"])
      : null;

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Malicious actors
        </Typography>

        <Box sx={{ mb: 8 }}>
          <>{actors.sort((a, b) => b.p - a.p).map((ca) => ca.el)}</>
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
                visuals={visuals}
                subtitle={
                  <Stack direction="column" sx={{ textAlign: "right" }}>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 * (ca.ipDynamic !== null ? ca.ipDynamic : ca.ip)
                        ) / 100}
                        %
                      </b>{" "}
                      of total probability
                    </Typography>
                    {ca.ipDynamic !== null && (
                      <Typography variant="caption">
                        {ca.ipDynamic >= ca.ip ? "+" : ""}
                        {Math.round(10000 * (ca.ipDynamic - ca.ip)) / 100}%
                        compared to public environment
                      </Typography>
                    )}
                  </Stack>
                }
              />
            ))}
        </Box>

        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{ mx: 0, mb: 0, mr: 1, opacity: consequencesVisible ? 1 : 0.3 }}
          >
            Potential consequences
          </Typography>
          <IconButton
            onClick={() => setConsequencesVisible(!consequencesVisible)}
          >
            {consequencesVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Stack>

        {consequencesVisible && (
          <Box sx={{ mb: 8 }}>
            {dynamicEffects
              .sort((a, b) => b.i - a.i)
              .map((e) => (
                <CascadeSection
                  key={e.cascade._cr4de_risk_cascade_value}
                  cause={riskFile}
                  effect={e.cascade.cr4de_effect_risk}
                  cascade={e.cascade}
                  visuals={visuals}
                  subtitle={
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
                  }
                />
              ))}
          </Box>
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
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectHDynamic !== null ? iDirectHDynamic : iDirectH)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectHDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectHDynamic >= iDirectH ? "+" : ""}
                    {Math.round(10000 * (iDirectHDynamic - iDirectH)) / 100}%
                    compared to public environment
                  </Typography>
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
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectSDynamic !== null ? iDirectSDynamic : iDirectS)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectSDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectSDynamic >= iDirectS ? "+" : ""}
                    {Math.round(10000 * (iDirectSDynamic - iDirectS)) / 100}%
                    compared to public environment
                  </Typography>
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
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectEDynamic !== null ? iDirectEDynamic : iDirectE)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectEDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectEDynamic >= iDirectE ? "+" : ""}
                    {Math.round(10000 * (iDirectEDynamic - iDirectE)) / 100}%
                    compared to public environment
                  </Typography>
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
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectFDynamic !== null ? iDirectFDynamic : iDirectF)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectFDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectFDynamic >= iDirectF ? "+" : ""}
                    {Math.round(10000 * (iDirectFDynamic - iDirectF)) / 100}%
                    compared to public environment
                  </Typography>
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
