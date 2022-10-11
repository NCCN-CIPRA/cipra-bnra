import { useMemo, useRef, useState, useCallback } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  Box,
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Divider,
  Button,
  Skeleton,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TextInputBox from "../../components/TextInputBox";
import TransferList from "../../components/TransferList";
import SaveIcon from "@mui/icons-material/Save";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import * as S from "../../functions/scenarios";
import * as HE from "../../functions/historicalEvents";
import * as IP from "../../functions/intensityParameters";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecord from "../../hooks/useRecord";
import useLazyRecords from "../../hooks/useLazyRecords";
import useAutosave from "../../hooks/useAutosave";
import usePageTitle from "../../hooks/usePageTitle";
import { Breadcrumb } from "../../components/BreadcrumbNavigation";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import HistoricalEventsTable from "../../components/HistoricalEventsTable";
import IntensityParametersTable from "../../components/IntensityParametersTable";
import ScenariosTable from "../../components/ScenariosTable";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import Attachments from "../../components/Attachments";
import FeedbackList from "./FeedbackList";
import { DVValidation } from "../../types/dataverse/DVValidation";
import { DVContact } from "../../types/dataverse/DVContact";

interface ProcessedRiskFile extends DVRiskFile {
  historicalEvents: HE.HistoricalEvent[];
  intensityParameters: IP.IntensityParameter[];
  scenarios: S.Scenarios;
}

type RouteParams = {
  risk_file_id: string;
};

const defaultBreadcrumbs: Breadcrumb[] = [
  { name: "BNRA 2023 - 2026", url: "/" },
  { name: "Hazard Catalogue", url: "/hazards" },
];

export default function EditorPage() {
  const api = useAPI();
  const params = useParams() as RouteParams;
  const navigate = useNavigate();

  const [definition, setDefinition] = useState<string | null>(null);
  const [historicalEvents, setHistoricalEvents] = useState<HE.HistoricalEvent[] | null>(null);
  const [parameters, setParameters] = useState<IP.IntensityParameter[] | null>(null);
  const [scenarios, setScenarios] = useState<S.Scenarios | null>(null);
  const [horizon, setHorizon] = useState<string | null>(null);

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
  const { data: validations, getData: getValidations } = useLazyRecords<DVValidation<undefined, DVContact>>({
    table: DataTable.VALIDATION,
  });

  const { data: riskFile, reloadData: reloadRiskFile } = useRecord<ProcessedRiskFile>({
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
      setDefinition(rf.cr4de_definition || null);
      setHistoricalEvents(rf.historicalEvents);
      setParameters(rf.intensityParameters);
      setScenarios(rf.scenarios);
      setHorizon(rf.cr4de_horizon_analysis || null);

      if (!otherHazards)
        getOtherHazards({
          query: `$filter=cr4de_riskfilesid ne ${rf.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
        });
      if (!allCauses)
        getAllCauses({
          query: `$filter=_cr4de_effect_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
        });
      if (!effects)
        getEffects({
          query: `$filter=_cr4de_cause_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
        });
      if (!attachments) getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${rf.cr4de_riskfilesid}` });
      if (!validations)
        getValidations({
          query: `$filter=_cr4de_riskfile_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_expert`,
        });
    },
  });

  const updateRiskFile = useCallback(
    async (fieldsToUpdate: Partial<DVRiskFile>) => {
      if (fieldsToUpdate === null) return;

      setIsSaving(true);

      await api.updateRiskFile(params.risk_file_id, fieldsToUpdate);
      await reloadRiskFile();

      setIsSaving(false);
    },
    [api, params.risk_file_id, reloadRiskFile]
  );

  const [isSaving, setIsSaving] = useState(false);

  const { isSaving: isAutosaving, fieldsToUpdate } = useAutosave<DVRiskFile>({
    fields: {
      cr4de_definition: definition,
      cr4de_historical_events: historicalEvents && HE.wrap(historicalEvents),
      cr4de_intensity_parameters: parameters && IP.wrap(parameters),
      cr4de_scenario_considerable: scenarios && S.wrap(scenarios.considerable),
      cr4de_scenario_major: scenarios && S.wrap(scenarios.major),
      cr4de_scenario_extreme: scenarios && S.wrap(scenarios.extreme),
      cr4de_horizon_analysis: horizon,
    },
    compareTo: riskFile || {},
    handleSave: updateRiskFile,
    enable: !isSaving && riskFile !== null,
  });

  usePageTitle("BNRA 2023 - 2026 Risk File Editor");
  useBreadcrumbs([...defaultBreadcrumbs, riskFile ? { name: riskFile.cr4de_title, url: "" } : null]);

  // Calculate transfer list data (causes, effects, catalysing effect) and memorize for efficiency
  const causesChoises = useMemo<SmallRisk[]>(
    () =>
      otherHazards && causes
        ? otherHazards.filter((rf) => !causes.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid))
        : [],
    [causes, otherHazards]
  );
  const causesChosen = useMemo(
    () =>
      causes
        ? causes.map((c) => ({
            ...c.cr4de_cause_hazard,
            cascadeId: c.cr4de_bnrariskcascadeid,
            reason: c.cr4de_reason,
          }))
        : [],
    [causes]
  );

  const effectsChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && effects
        ? otherHazards.filter((rf) => effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid))
        : [],
    [effects, otherHazards]
  );
  const effectsChosen = useMemo(
    () =>
      effects
        ? effects.map((c) => ({
            ...c.cr4de_effect_hazard,
            cascadeId: c.cr4de_bnrariskcascadeid,
            reason: c.cr4de_reason,
          }))
        : [],
    [effects]
  );

  const catalysingChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && catalysing
        ? otherHazards.filter(
            (rf) =>
              rf.cr4de_risk_type === "Emerging Risk" &&
              !catalysing.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid)
          )
        : [],
    [catalysing, otherHazards]
  );
  const catalysingChosen = useMemo(
    () =>
      catalysing
        ? catalysing.map((c) => ({
            ...c.cr4de_cause_hazard,
            cascadeId: c.cr4de_bnrariskcascadeid,
            reason: c.cr4de_reason,
          }))
        : [],
    [catalysing]
  );

  return (
    <>
      <Container sx={{ pb: 8 }}>
        <Paper>
          <Box p={2} my={4}>
            <Typography variant="h6" color="secondary" sx={{ flex: 1 }}>
              1. Definition
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {riskFile ? (
              <TextInputBox initialValue={riskFile.cr4de_definition || ""} setValue={setDefinition} />
            ) : (
              <Box mt={3}>
                <Skeleton variant="text" />
              </Box>
            )}

            <Attachments attachments={attachments} riskFile={riskFile} field="definition" onUpdate={getAttachments} />

            <FeedbackList validations={validations} field="definition" />
          </Box>
        </Paper>

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                2. Historical Events
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  Examples of events corresponding to the definition of this hazard in Belgium or other countries.
                </Typography>
                <Typography variant="caption" paragraph>
                  This field is optional and serves as a guide when determining intensity parameters and building
                  scenarios. It is in no way meant to be a complete overview of all known events.
                </Typography>
              </Box>

              <HistoricalEventsTable
                historicalEvents={riskFile?.historicalEvents}
                onChange={async (update, instant = false) => {
                  if (instant) {
                    await updateRiskFile({
                      cr4de_historical_events: HE.wrap(update),
                    });
                    await reloadRiskFile();
                  } else {
                    setHistoricalEvents(update);
                  }
                }}
              />

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="historical_events"
                onUpdate={getAttachments}
              />

              <FeedbackList validations={validations} field="historical_events" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                3. Intensity Parameters
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  Factors which influence the evolution and consequences of an event of this type.
                </Typography>
              </Box>

              <IntensityParametersTable
                parameters={riskFile?.intensityParameters}
                onChange={async (update, instant = false) => {
                  if (instant) {
                    await updateRiskFile({
                      cr4de_intensity_parameters: IP.wrap(update),
                    });
                    await reloadRiskFile();
                  } else {
                    setParameters(update);
                  }
                }}
              />

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="intensity_parameters"
                onUpdate={getAttachments}
              />

              <FeedbackList validations={validations} field="intensity_parameters" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                4. Intensity Scenarios
              </Typography>

              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  Outline of the scenarios according to three levels of intensity - <i>considerable, major</i> and{" "}
                  <i>extreme</i> - described in terms of the intensity parameters defined in the previous section.
                </Typography>
                <Typography variant="caption" paragraph>
                  Each scenario should be intuitively differentiable with respect to its impact, but no strict rules are
                  defined as to the limits of the scenarios.
                </Typography>
              </Box>

              <ScenariosTable
                parameters={riskFile?.intensityParameters}
                scenarios={riskFile?.scenarios}
                onChange={setScenarios}
              />

              <Attachments attachments={attachments} riskFile={riskFile} field="scenarios" onUpdate={getAttachments} />

              <FeedbackList validations={validations} field="scenarios" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                2. Actor Capabilities
              </Typography>

              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  Outline of the actor groups according to three levels of capabilities - <i>considerable, major</i> and{" "}
                  <i>extreme</i>.
                </Typography>
                <Typography variant="caption" paragraph>
                  The information contained in the risk files is considered 'Limited Distribution'.
                </Typography>
              </Box>

              {riskFile ? (
                <Box>
                  <Typography variant="subtitle2">Considerable Capabilities</Typography>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: riskFile.scenarios.considerable ? riskFile.scenarios.considerable[0].value : "",
                    }}
                  />
                  <Typography variant="subtitle2">Major Capabilities</Typography>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: riskFile.scenarios.major ? riskFile.scenarios.major[0].value : "",
                    }}
                  />
                  <Typography variant="subtitle2">Extreme Capabilities</Typography>
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

              <Attachments attachments={attachments} riskFile={riskFile} field="scenarios" onUpdate={getAttachments} />

              <FeedbackList validations={validations} field="scenarios" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                2. Horizon Analysis
              </Typography>

              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  This section should include a qualitative (or quantitative if possible) description of one or more
                  possible evolution pathways of the emerging risk (e.g. different GHG emission pathways for climate
                  change scenario’s, adoption curves for new technologies, …), including potential timeframes or trigger
                  events.
                </Typography>
                <Typography variant="caption" paragraph>
                  {
                    "The horizon analysis investigates and tries to predict at what speed the emerging risk manifests itself. Will a new technology or phenomenon become mature or more prominent in the near future (e.g. 5-10 years) or rather long-term (>30-50 years)? Due to the uncertainty that emerging risks present, it is encouraged to discuss multiple scenarios with which these risks may emerge and influence others."
                  }
                </Typography>
              </Box>

              {riskFile ? (
                <TextInputBox initialValue={riskFile.cr4de_horizon_analysis || ""} setValue={setHorizon} />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="horizon_analysis"
                onUpdate={getAttachments}
              />

              <FeedbackList validations={validations} field="horizon_analysis" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Stack direction="row">
                <Typography variant="h6" mb={1} color="secondary">
                  5. Causing Hazards
                </Typography>
              </Stack>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  This section identifies other hazards in the BNRA hazard catalogue that may cause the current hazard.
                  A short reason should be provided for each non-trivial causal relation.
                </Typography>
                <Typography variant="caption" paragraph>
                  On the left are the hazards that were identified by NCCN analist as being a potential cause. On the
                  right are all the other hazards in the hazard catalogue. The definition of a hazard selected in the
                  windows below can be found beneath the comment box.
                </Typography>
              </Box>

              {causes !== null && otherHazards !== null && (
                <TransferList
                  choices={causesChoises}
                  chosen={causesChosen}
                  choicesLabel="Non-causing hazards"
                  chosenLabel="Causing hazards"
                  chosenSubheader={`${causes.length} causes identified`}
                  onAddChosen={async (chosen) => {
                    await api.createCascade({
                      "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                      "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                    });
                    getAllCauses({
                      query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                    });
                  }}
                  onRemoveChosen={async (chosen) => {
                    await api.deleteCascade(chosen.cascadeId);
                    getAllCauses({
                      query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                    });
                  }}
                />
              )}

              <Attachments attachments={attachments} riskFile={riskFile} field="causes" onUpdate={getAttachments} />

              <FeedbackList validations={validations} field="causes" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                3. Malicious Actions
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  This section tries to identify potential malicious actions in the BNRA hazard catalogue that may be
                  taken by the actors described by this hazard. A short reason should be provided for each non-evident
                  action.
                </Typography>
                <Typography variant="caption" paragraph>
                  On the left are the hazards that were identified by NCCN analist as being a potential malicious
                  actions. On the right are all the other malicious actions in the hazard catalogue. The definition of a
                  hazard selected in the windows below can be found beneath the comment box.
                </Typography>
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={effectsChoices}
                  chosen={effectsChosen}
                  choicesLabel="Non-potential action hazards"
                  chosenLabel="Potential action hazards"
                  chosenSubheader={`${effects.length} potential actions identified`}
                  onAddChosen={async (chosen) => {
                    await api.createCascade({
                      "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                      "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                    });
                    getEffects();
                  }}
                  onRemoveChosen={async (chosen) => {
                    await api.deleteCascade(chosen.cascadeId);
                    getEffects();
                  }}
                />
              )}

              <Attachments attachments={attachments} riskFile={riskFile} field="effects" onUpdate={getAttachments} />

              <FeedbackList validations={validations} field="effects" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                6. Effect Hazards
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  This section identifies other hazards in the BNRA hazard catalogue that may be a direct consequence of
                  the current hazard. A short reason should be provided for each non-trivial causal relation.
                </Typography>
                <Typography variant="caption" paragraph>
                  On the left are the hazards that were identified by NCCN analist as being a potential effect. On the
                  right are all the other hazards in the hazard catalogue. The definition of a hazard selected in the
                  windows below can be found beneath the comment box.
                </Typography>
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={effectsChoices}
                  chosen={effectsChosen}
                  choicesLabel="Non-effect hazards"
                  chosenLabel="Effect hazards"
                  chosenSubheader={`${effects.length} effects identified`}
                  onAddChosen={async (chosen) => {
                    await api.createCascade({
                      "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                      "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                    });
                    getEffects();
                  }}
                  onRemoveChosen={async (chosen) => {
                    await api.deleteCascade(chosen.cascadeId);
                    getEffects();
                  }}
                />
              )}

              <Attachments attachments={attachments} riskFile={riskFile} field="effects" onUpdate={getAttachments} />

              <FeedbackList validations={validations} field="effects" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                3. Catalysing effects
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  This section tries to identify other hazards in the BNRA hazard catalogue that may be catalysed by the
                  current emerging risk (this means in the future it may affect the probability and/or impact of the
                  other hazard). A short reason may be provided for each non-trivial causal relation.
                </Typography>
                <Typography variant="caption" paragraph>
                  On the left are the hazards that may experience a catalysing effect. On the right are all the other
                  risks in the hazard catalogue. The definition of a hazard selected in the windows below can be found
                  beneath the comment box.
                </Typography>
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={effectsChoices}
                  chosen={effectsChosen}
                  choicesLabel="Non-effect hazards"
                  chosenLabel="Effect hazards"
                  chosenSubheader={`${effects.length} effects identified`}
                  onAddChosen={async (chosen) => {
                    await api.createCascade({
                      "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                      "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                    });
                    getEffects();
                  }}
                  onRemoveChosen={async (chosen) => {
                    await api.deleteCascade(chosen.cascadeId);
                    getEffects();
                  }}
                />
              )}

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="catalysing_effects"
                onUpdate={getAttachments}
              />

              <FeedbackList validations={validations} field="catalysing_effects" />
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type !== "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              {riskFile.cr4de_risk_type === "Standard Risk" && (
                <Typography variant="h6" mb={1} color="secondary">
                  7. Catalysing Effects
                </Typography>
              )}
              {riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
                <Typography variant="h6" mb={1} color="secondary">
                  4. Catalysing Effects
                </Typography>
              )}
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  This section tries to identifies the emerging risks in the BNRA hazard catalogue that may catalyse the
                  current hazard (this means in the future it may have an effect on the probability and/or impact of
                  this hazard). A short reason may be provided for each non-trivial causal relation.
                </Typography>
                <Typography variant="caption" paragraph>
                  On the left are the hazards that were identified by NCCN analists as having a potential catalysing
                  effect. On the right are all the other emerging risks in the hazard catalogue. The definition of a
                  hazard selected in the windows below can be found beneath the comment box.
                </Typography>
              </Box>

              {catalysing !== null && otherHazards !== null && (
                <TransferList
                  choices={catalysingChoices}
                  chosen={catalysingChosen}
                  choicesLabel="Non-catalysing hazards"
                  chosenLabel="Catalysing hazards"
                  chosenSubheader={`${catalysing.length} catalysing effects identified`}
                  onAddChosen={async (chosen) => {
                    await api.createCascade({
                      "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                      "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                    });
                    getAllCauses();
                  }}
                  onRemoveChosen={async (chosen) => {
                    await api.deleteCascade(chosen.cascadeId);
                    getAllCauses();
                  }}
                />
              )}

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="catalysing_effects"
                onUpdate={getAttachments}
              />

              <FeedbackList validations={validations} field="catalysing_effects" />
            </Box>
          </Paper>
        )}
      </Container>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        component={Paper}
        elevation={5}
      >
        <Button color="error" sx={{ mr: 1 }} component={RouterLink} to="/validation">
          Exit
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {(isSaving || isAutosaving) && (
          <LoadingButton color="secondary" sx={{ mr: 1 }} loading loadingPosition="start" startIcon={<SaveIcon />}>
            Saving
          </LoadingButton>
        )}
        {!(isSaving || isAutosaving) && fieldsToUpdate && (
          <Button color="secondary" sx={{ mr: 1 }} onClick={() => updateRiskFile(fieldsToUpdate)}>
            Save
          </Button>
        )}
        {!(isSaving || isAutosaving) && !fieldsToUpdate && (
          <Button color="secondary" disabled sx={{ mr: 1 }}>
            Saved
          </Button>
        )}

        <Button
          color="secondary"
          onClick={() => {
            if (fieldsToUpdate) updateRiskFile(fieldsToUpdate);
            navigate("/editor");
          }}
        >
          Save & Exit
        </Button>
      </Box>
    </>
  );
}
