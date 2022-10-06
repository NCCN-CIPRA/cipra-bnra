import { useMemo, useState, useCallback } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Box, Container, Typography, Paper, Divider, Button, Skeleton } from "@mui/material";
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

interface ProcessedRiskFile extends DVRiskFile {
  historicalEvents: HE.HistoricalEvent[];
  intensityParameters: IP.IntensityParameter[];
  scenarios: S.Scenarios;
}

interface OtherHazard {
  cr4de_riskfilesid: string;
  cr4de_hazard_id: string;

  cr4de_title: string;
  cr4de_risk_type: string;

  cr4de_definition?: string;
}

type RouteParams = {
  risk_file_id: string;
};

const defaultBreadcrumbs: Breadcrumb[] = [
  { name: "BNRA 2023 - 2026", url: "/" },
  { name: "Risk Files", url: "/editor" },
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

  const { data: otherHazards, getData: getOtherHazards } = useLazyRecords<OtherHazard>({
    table: DataTable.RISK_FILE,
  });
  const [causes, setCauses] = useState<DVRiskCascade<OtherHazard>[] | null>(null);
  const [catalysing, setCatalysing] = useState<DVRiskCascade<OtherHazard>[] | null>(null);
  const { getData: getAllCauses } = useLazyRecords<DVRiskCascade<OtherHazard>>({
    table: DataTable.RISK_CASCADE,
    onComplete: async (allCauses) => {
      setCauses(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Standard Risk"));
      setCatalysing(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
    },
  });
  const { data: effects, getData: getEffects } = useLazyRecords<DVRiskCascade<string, OtherHazard>>({
    table: DataTable.RISK_CASCADE,
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

      getOtherHazards({
        query: `$filter=cr4de_riskfilesid ne ${rf.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
      });
      getAllCauses({
        query: `$filter=_cr4de_effect_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
      });
      getEffects({
        query: `$filter=_cr4de_cause_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
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
  const causesChoises = useMemo<OtherHazard[]>(
    () =>
      otherHazards && causes
        ? otherHazards.filter((rf) => !causes.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid))
        : [],
    [causes, otherHazards]
  );
  const causesChosen = useMemo<OtherHazard[]>(
    () =>
      causes
        ? causes.map((c) => ({
            ...c.cr4de_cause_hazard,
            reason: c.cr4de_reason,
          }))
        : [],
    [causes]
  );

  const effectsChoices = useMemo<OtherHazard[]>(
    () =>
      otherHazards && effects
        ? otherHazards.filter((rf) => effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid))
        : [],
    [effects, otherHazards]
  );
  const effectsChosen = useMemo<OtherHazard[]>(
    () =>
      effects
        ? effects.map((c) => ({
            ...c.cr4de_effect_hazard,
            reason: c.cr4de_reason,
          }))
        : [],
    [effects]
  );

  const catalysingChoices = useMemo<OtherHazard[]>(
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
  const catalysingChosen = useMemo<OtherHazard[]>(
    () =>
      catalysing
        ? catalysing.map((c) => ({
            ...c.cr4de_cause_hazard,
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
            <Typography variant="h6" mb={1} color="secondary">
              1. Definition
            </Typography>
            <Divider />
            {riskFile ? (
              <TextInputBox initialValue={riskFile.cr4de_definition || ""} setValue={setDefinition} />
            ) : (
              <Box mt={3}>
                <Skeleton variant="text" />
              </Box>
            )}
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

              <HistoricalEventsTable historicalEvents={riskFile?.historicalEvents} />
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

              <IntensityParametersTable parameters={riskFile?.intensityParameters} />
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

              <ScenariosTable scenarios={riskFile?.scenarios} />
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
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="secondary">
                5. Causing Hazards
              </Typography>
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
                />
              )}
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
                />
              )}
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
                />
              )}
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
                />
              )}
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
                />
              )}
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
