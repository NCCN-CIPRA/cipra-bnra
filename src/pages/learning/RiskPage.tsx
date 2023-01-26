import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Paper, Divider, Skeleton } from "@mui/material";
import TransferList from "../../components/TransferList";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DataTable } from "../../hooks/useAPI";
import * as S from "../../functions/scenarios";
import * as HE from "../../functions/historicalEvents";
import * as IP from "../../functions/intensityParameters";
import useRecord from "../../hooks/useRecord";
import useLazyRecords from "../../hooks/useLazyRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ScenariosTable from "../../components/ScenariosTable";
import IntensityParametersTable from "../../components/IntensityParametersTable";
import HistoricalEventsTable from "../../components/HistoricalEventsTable";
import { Trans, useTranslation } from "react-i18next";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import Attachments from "../../components/Attachments";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import HelpButton from "../../components/HelpButton";

interface ProcessedRiskFile extends DVRiskFile {
  historicalEvents: HE.HistoricalEvent[];
  intensityParameters: IP.IntensityParameter[];
  scenarios: S.Scenarios;
}

type RouteParams = {
  risk_file_id: string;
};

export default function RiskPage() {
  const params = useParams() as RouteParams;
  const { t } = useTranslation();

  const { data: otherHazards, getData: getOtherHazards } = useLazyRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
  });
  const [causes, setCauses] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  const [catalysing, setCatalysing] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  const { data: allCauses, getData: getAllCauses } = useLazyRecords<DVRiskCascade<SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    onComplete: async (allCauses) => {
      setCauses(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Standard Risk"));
      setCatalysing(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
    },
  });
  const { data: effects, getData: getEffects } = useLazyRecords<DVRiskCascade<string, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
  });
  const { data: attachments, getData: getAttachments } = useLazyRecords<DVAttachment>({
    table: DataTable.ATTACHMENT,
  });

  const { data: riskFile } = useRecord<ProcessedRiskFile>({
    table: DataTable.RISK_FILE,
    id: params.risk_file_id,
    transformResult: (rawRiskFile: DVRiskFile) => {
      const ips = IP.unwrap(rawRiskFile.cr4de_intensity_parameters);

      return {
        ...rawRiskFile,
        historicalEvents: HE.unwrap(rawRiskFile.cr4de_historical_events),
        intensityParameters: ips,
        scenarios: S.unwrap(
          ips,
          rawRiskFile.cr4de_scenario_considerable,
          rawRiskFile.cr4de_scenario_major,
          rawRiskFile.cr4de_scenario_extreme
        ),
      };
    },
    onComplete: async (rf) => {
      if (!otherHazards)
        getOtherHazards({
          query: `$filter=cr4de_riskfilesid ne ${rf.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
        });
      if (!allCauses)
        getAllCauses({
          query: `$filter=_cr4de_effect_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
          onComplete: async (allCauses) => {
            setCauses(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Standard Risk"));
            setCatalysing(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
          },
        });
      if (!effects)
        getEffects({
          query: `$filter=_cr4de_cause_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
        });
      if (!attachments) getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${rf.cr4de_riskfilesid}` });
    },
  });

  usePageTitle(t("learning.risk.title", "BNRA 2023 - 2026 Risicocatalogus"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    { name: t("learning.risk.breadcrumb", "Risicocatalogus"), url: "/learning/risk-catalogue" },
    riskFile ? { name: riskFile.cr4de_title, url: "" } : null,
  ]);

  // Calculate transfer list data (causes, effects, catalysing effect) and memorize for efficiency
  const causesChoises = useMemo<SmallRisk[]>(
    () =>
      otherHazards && causes
        ? otherHazards
            .filter((rf) => !causes.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid))
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [causes, otherHazards]
  );
  const causesChosen = useMemo(
    () =>
      causes
        ? causes
            .map((c) => ({
              ...c.cr4de_cause_hazard,
              cascadeId: c.cr4de_bnrariskcascadeid,
              reason: c.cr4de_reason,
            }))
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [causes]
  );

  const effectsChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && effects
        ? otherHazards
            .filter((rf) => effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid))
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [effects, otherHazards]
  );
  const effectsChosen = useMemo(
    () =>
      effects
        ? effects
            .map((c) => ({
              ...c.cr4de_effect_hazard,
              cascadeId: c.cr4de_bnrariskcascadeid,
              reason: c.cr4de_reason,
            }))
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [effects]
  );

  const catalysingChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && catalysing
        ? otherHazards
            .filter(
              (rf) =>
                rf.cr4de_risk_type === "Emerging Risk" &&
                !catalysing.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid)
            )
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [catalysing, otherHazards]
  );
  const catalysingChosen = useMemo(
    () =>
      catalysing
        ? catalysing
            .map((c) => ({
              ...c.cr4de_cause_hazard,
              cascadeId: c.cr4de_bnrariskcascadeid,
              reason: c.cr4de_reason,
            }))
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [catalysing]
  );

  return (
    <>
      <Container sx={{ pb: 8 }} id="risk-file-container">
        <Paper>
          <Box p={2} my={4} id="definition-container">
            <HelpButton
              steps={[
                {
                  disableBeacon: true,
                  target: "body",
                  placement: "center",
                  content: (
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body1" my={2}>
                        <Trans i18nKey="validation.intro.part3">The base of each risk file is the definition.</Trans>
                      </Typography>
                      <Typography variant="body1" my={2}>
                        <Trans i18nKey="validation.intro.part3">
                          The definition should be as short and concise as possible (to ensure optimal readability for
                          efficient referencing) while still being complete and clearly delineating the scope of the
                          risk (and outlining the distinctions relative to other risks where necessary).
                        </Trans>
                      </Typography>
                      <Typography variant="body1" my={2}>
                        <Trans i18nKey="validation.intro.part3">
                          The definition should <b>not</b> contain any indications of the magnitude or impact of the
                          risk.
                        </Trans>
                      </Typography>
                    </Box>
                  ),
                  styles: { options: { width: 800 } },
                },
              ]}
            />
            <Typography variant="h6" mb={1} color="primary">
              1. <Trans i18nKey="riskFile.definition.title">Definition</Trans>
            </Typography>
            <Divider />
            {riskFile ? (
              <Box
                id="definition"
                mt={3}
                dangerouslySetInnerHTML={{
                  __html: riskFile.cr4de_definition || "",
                }}
              />
            ) : (
              <Box mt={3}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Box>
            )}

            <Attachments
              attachments={attachments}
              field="definition"
              riskFile={riskFile}
              isExternal={true}
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
              }
            />
          </Box>
        </Paper>

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                2. <Trans i18nKey="riskFile.historicalEvents.title">Historical Events</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.historicalEvents.helpText1">
                    Examples of events corresponding to the definition of this hazard in Belgium or other countries.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.historicalEvents.helpText2">
                    This field is optional and serves as a guide when determining intensity parameters and building
                    scenarios. It is in no way meant to be a complete overview of all known events.
                  </Trans>
                </Typography>
              </Box>

              <HistoricalEventsTable initialHistoricalEvents={riskFile?.cr4de_historical_events} />

              <Attachments
                attachments={attachments}
                field="historical_events"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                3. <Trans i18nKey="riskFile.intensityParameters.title">Intensity Parameters</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.intensityParameters.helpText">
                    Factors which influence the evolution and consequences of an event of this type.
                  </Trans>
                </Typography>
              </Box>

              <IntensityParametersTable initialParameters={riskFile?.cr4de_intensity_parameters} />

              <Attachments
                attachments={attachments}
                field="intensity_parameters"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                4. <Trans i18nKey="riskFile.intensityScenarios.title">Intensity Scenarios</Trans>
              </Typography>

              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.intensityScenarios.helpText1">
                    Outline of the scenarios according to three levels of intensity - <i>considerable, major</i> and{" "}
                    <i>extreme</i> - described in terms of the intensity parameters defined in the previous section.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.intensityScenarios.helpText2">
                    Each scenario should be intuitively differentiable with respect to its impact, but no strict rules
                    are defined as to the limits of the scenarios.
                  </Trans>
                </Typography>
              </Box>

              <ScenariosTable
                parameters={riskFile?.intensityParameters}
                initialScenarios={{
                  considerable: riskFile?.cr4de_scenario_considerable,
                  major: riskFile?.cr4de_scenario_major,
                  extreme: riskFile?.cr4de_scenario_extreme,
                }}
              />

              <Attachments
                attachments={attachments}
                field="scenarios"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                2. <Trans i18nKey="riskFile.actorCapabilities.title">Actor Capabilities</Trans>
              </Typography>

              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.actorCapabilities.helpText1">
                    Outline of the actor groups according to three levels of capabilities - <i>considerable, major</i>{" "}
                    and <i>extreme</i>.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.actorCapabilities.helpText2">
                    The information contained in the risk files is considered 'Limited Distribution'.
                  </Trans>
                </Typography>
              </Box>

              {riskFile ? (
                <Box>
                  <Typography variant="subtitle2">
                    <Trans i18nKey="riskFile.actorCapabilities.considerable">Considerable Capabilities</Trans>
                  </Typography>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: riskFile.scenarios.considerable ? riskFile.scenarios.considerable[0].value : "",
                    }}
                  />
                  <Typography variant="subtitle2">
                    <Trans i18nKey="riskFile.actorCapabilities.major">Major Capabilities</Trans>
                  </Typography>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: riskFile.scenarios.major ? riskFile.scenarios.major[0].value : "",
                    }}
                  />
                  <Typography variant="subtitle2">
                    <Trans i18nKey="riskFile.actorCapabilities.extreme">Extreme Capabilities</Trans>
                  </Typography>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: riskFile.scenarios.extreme ? riskFile.scenarios.extreme[0].value : "",
                    }}
                  />
                </Box>
              ) : (
                <Box mt={3}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Box>
              )}

              <Attachments
                attachments={attachments}
                field="scenarios"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                2. <Trans i18nKey="riskFile.horizonAnalysis.title">Horizon Analysis</Trans>
              </Typography>

              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.horizonAnalysis.helpText1">
                    This section should include a qualitative (or quantitative if possible) description of one or more
                    possible evolution pathways of the emerging risk (e.g. different GHG emission pathways for climate
                    change scenario’s, adoption curves for new technologies, …), including potential timeframes or
                    trigger events.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.horizonAnalysis.helpText2">
                    The horizon analysis investigates and tries to predict at what speed the emerging risk manifests
                    itself. Will a new technology or phenomenon become mature or more prominent in the near future (e.g.
                    5-10 years) or rather long-term (30-50 years)? Due to the uncertainty that emerging risks present,
                    it is encouraged to discuss multiple scenarios with which these risks may emerge and influence
                    others.
                  </Trans>
                </Typography>
              </Box>

              {riskFile ? (
                <Box
                  mt={3}
                  dangerouslySetInnerHTML={{
                    __html: riskFile.cr4de_horizon_analysis || "",
                  }}
                />
              ) : (
                <Box mt={3}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Box>
              )}

              <Attachments
                attachments={attachments}
                field="horizon_analysis"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                5. <Trans i18nKey="transferList.causes.title">Causing Hazards</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.causes.helpText1">
                    This section identifies other hazards in the BNRA hazard catalogue that may cause the current
                    hazard. A short reason should be provided for each non-trivial causal relation.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.causes.helpText2">
                    On the left are the hazards that were identified by NCCN analist as being a potential cause. On the
                    right are all the other hazards in the hazard catalogue. The definition of a hazard selected in the
                    windows below can be found beneath the comment box.
                  </Trans>
                </Typography>
              </Box>

              {causes !== null && otherHazards !== null && (
                <TransferList
                  choices={causesChoises}
                  chosen={causesChosen}
                  choicesLabel={t("riskFile.causes.choices")}
                  chosenLabel={t("riskFile.causes.chosen")}
                  chosenSubheader={t("riskFile.causes.subheader", { count: causes.length })}
                />
              )}

              <Attachments
                attachments={attachments}
                field="causes"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                3. <Trans i18nKey="riskFile.maliciousActions.title">Malicious Actions</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.maliciousActions.helpText1">
                    This section tries to identify potential malicious actions in the BNRA hazard catalogue that may be
                    taken by the actors described by this hazard. A short reason should be provided for each non-evident
                    action.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.maliciousActions.helpText2">
                    On the left are the hazards that were identified by NCCN analist as being a potential malicious
                    actions. On the right are all the other malicious actions in the hazard catalogue. The definition of
                    a hazard selected in the windows below can be found beneath the comment box.
                  </Trans>
                </Typography>
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={effectsChoices}
                  chosen={effectsChosen}
                  choicesLabel={t("riskFile.maliciousActions.choices")}
                  chosenLabel={t("riskFile.maliciousActions.chosen")}
                  chosenSubheader={t("riskFile.maliciousActions.subheader", { count: effects.length })}
                />
              )}

              <Attachments
                attachments={attachments}
                field="effects"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                6. <Trans i18nKey="riskFile.effects.title">Effect Hazards</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.effects.helpText.part1">
                    This section identifies other hazards in the BNRA hazard catalogue that may be a direct consequence
                    of the current hazard. A short reason should be provided for each non-trivial causal relation.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.effects.helpText.part2">
                    On the left are the hazards that were identified by NCCN analist as being a potential effect. On the
                    right are all the other hazards in the hazard catalogue. The definition of a hazard selected in the
                    windows below can be found beneath the comment box.
                  </Trans>
                </Typography>
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={effectsChoices}
                  chosen={effectsChosen}
                  choicesLabel={t("riskFile.effects.choices")}
                  chosenLabel={t("riskFile.effects.chosen")}
                  chosenSubheader={t("riskFile.effects.subheader", { count: effects.length })}
                />
              )}

              <Attachments
                attachments={attachments}
                field="catalysing_effects"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                3. <Trans i18nKey="riskFile.catalysedEffects.title">Catalysing Effects</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.catalysedEffects.helpText.part1">
                    This section tries to identify other hazards in the BNRA hazard catalogue that may be catalysed by
                    the current emerging risk (this means in the future it may affect the probability and/or impact of
                    the other hazard). A short reason may be provided for each non-trivial causal relation.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.catalysedEffects.helpText.part2">
                    On the left are the hazards that may experience a catalysing effect. On the right are all the other
                    risks in the hazard catalogue. The definition of a hazard selected in the windows below can be found
                    beneath the comment box.
                  </Trans>
                </Typography>
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={effectsChoices}
                  chosen={effectsChosen}
                  choicesLabel={t("riskFile.catalysedEffects.choices")}
                  chosenLabel={t("riskFile.catalysedEffects.chosen")}
                  chosenSubheader={t("riskFile.catalysedEffects.subheader", { count: effects.length })}
                />
              )}

              <Attachments
                attachments={attachments}
                field="effects"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type !== "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              {riskFile.cr4de_risk_type === "Standard Risk" && (
                <Typography variant="h6" mb={1} color="primary">
                  7. <Trans i18nKey="riskFile.catalysingEffects.title">Catalysing Effects</Trans>
                </Typography>
              )}
              {riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
                <Typography variant="h6" mb={1} color="primary">
                  4. <Trans i18nKey="riskFile.catalysingEffects.title">Catalysing Effects</Trans>
                </Typography>
              )}
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.catalysingEffects.helpText.part1">
                    This section tries to identifies the emerging risks in the BNRA hazard catalogue that may catalyse
                    the current hazard (this means in the future it may have an effect on the probability and/or impact
                    of this hazard). A short reason may be provided for each non-trivial causal relation.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.catalysingEffects.helpText.part2">
                    On the left are the hazards that were identified by NCCN analists as having a potential catalysing
                    effect. On the right are all the other emerging risks in the hazard catalogue. The definition of a
                    hazard selected in the windows below can be found beneath the comment box.
                  </Trans>
                </Typography>
              </Box>

              {catalysing !== null && otherHazards !== null && (
                <TransferList
                  choices={catalysingChoices}
                  chosen={catalysingChosen}
                  choicesLabel={t("riskFile.catalysingEffects.choices")}
                  chosenLabel={t("riskFile.catalysingEffects.chosen")}
                  chosenSubheader={t("riskFile.catalysedEffects.subheader", { count: catalysing.length })}
                />
              )}

              <Attachments
                attachments={attachments}
                field="catalysing"
                riskFile={riskFile}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}
      </Container>
    </>
  );
}
