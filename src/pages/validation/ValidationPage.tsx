import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  Skeleton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TextInputBox from "../../components/TextInputBox";
import tableToJson from "../../functions/tableToJson";
import TransferList from "../../components/TransferList";
import SaveIcon from "@mui/icons-material/Save";
import { DVValidation } from "../../types/dataverse/DVValidation";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import useAPI from "../../hooks/useAPI";
import * as S from "../../functions/scenarios";
import * as HE from "../../functions/historicalEvents";
import * as IP from "../../functions/intensityParameters";

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

export default function ValidationPage() {
  const params = useParams();
  const navigate = useNavigate();
  const api = useAPI();

  const [validation, setValidation] = useState<DVValidation<DVRiskFile> | null>(null);
  const [riskFile, setRiskFile] = useState<ProcessedRiskFile | null>(null);
  const [otherHazards, setOtherHazards] = useState<OtherHazard[] | null>(null);
  const [causes, setCauses] = useState<DVRiskCascade<OtherHazard>[] | null>(null);
  const [effects, setEffects] = useState<DVRiskCascade<string, OtherHazard>[] | null>(null);
  const [catalysing, setCatalysing] = useState<DVRiskCascade<OtherHazard>[] | null>(null);

  const [definitionFeedback, setDefinitionFeedback] = useState<string | undefined>(undefined);
  const [historicalEventsFeedback, setHistoricalEventsFeedback] = useState<string | undefined>(undefined);
  const [parametersFeedback, setParametersFeedback] = useState<string | undefined>(undefined);
  const [scenariosFeedback, setScenariosFeedback] = useState<string | undefined>(undefined);
  const [causesFeedback, setCausesFeedback] = useState<string | undefined>(undefined);
  const [effectsFeedback, setEffectsFeedback] = useState<string | undefined>(undefined);
  const [catalysingFeedback, setCatalysingFeedback] = useState<string | undefined>(undefined);
  const [horizonFeedback, setHorizonFeedback] = useState<string | undefined>(undefined);

  const [saving, setSaving] = useState(false);

  const fieldsToUpdate: any = {};

  /**
   * This effect retrieves the Validation record from the database that is defined in the page url when the page loads
   */
  useEffect(() => {
    // Do not run this effect if the validation record has already been retrieved
    if (validation) return;

    const getValidation = async function () {
      if (!params.validation_id) return;

      const result = await api.getValidation<DVValidation<DVRiskFile>>(params.validation_id, "$expand=cr4de_RiskFile");

      setValidation(result);

      const ips = IP.unwrap(result.cr4de_RiskFile.cr4de_intensity_parameters);

      // Parse complex data fields before displaying the risk file object
      const processedRiskFile: ProcessedRiskFile = {
        ...result.cr4de_RiskFile,
        historicalEvents: HE.unwrap(result.cr4de_RiskFile.cr4de_historical_events),
        intensityParameters: ips,
        scenarios: S.unwrap(
          ips,
          result.cr4de_RiskFile.cr4de_scenario_considerable,
          result.cr4de_RiskFile.cr4de_scenario_major,
          result.cr4de_RiskFile.cr4de_scenario_extreme
        ),
      };
      setRiskFile(processedRiskFile);

      setDefinitionFeedback(result.cr4de_definition_feedback);
      setHistoricalEventsFeedback(result.cr4de_historical_events_feedback);
      setParametersFeedback(result.cr4de_intensity_parameters_feedback);
      setScenariosFeedback(result.cr4de_scenarios_feedback);
      setCausesFeedback(result.cr4de_causes_feedback);
      setEffectsFeedback(result.cr4de_effects_feedback);
      setCatalysingFeedback(result.cr4de_catalysing_effects_feedback);
      setHorizonFeedback(result.cr4de_horizon_analysis_feedback);
    };

    getValidation();
  }, [api, params.validation_id, validation]);

  useEffect(() => {
    if (!riskFile || causes || effects || catalysing) return;

    const getOtherHazards = async function () {
      const result = await api.getRiskFiles<OtherHazard>(
        `$filter=cr4de_riskfilesid ne ${riskFile.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`
      );

      setOtherHazards(result);
    };

    const getCauses = async function () {
      const result = await api.getRiskCascades<DVRiskCascade<OtherHazard>>(
        `$filter=_cr4de_effect_hazard_value eq ${riskFile.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`
      );

      setCauses(result.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Standard Risk"));
      setCatalysing(result.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
    };

    const getEffects = async function () {
      const result = await api.getRiskCascades<DVRiskCascade<string, OtherHazard>>(
        `$filter=_cr4de_cause_hazard_value eq ${riskFile.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`
      );

      setEffects(result);
    };

    getOtherHazards();
    getCauses();
    getEffects();
  }, [api, catalysing, causes, effects, riskFile]);

  if (validation) {
    if (definitionFeedback !== validation.cr4de_definition_feedback)
      fieldsToUpdate.cr4de_definition_feedback = definitionFeedback;
    if (historicalEventsFeedback !== validation.cr4de_historical_events_feedback)
      fieldsToUpdate.cr4de_historical_events_feedback = historicalEventsFeedback;
    if (parametersFeedback !== validation.cr4de_intensity_parameters_feedback)
      fieldsToUpdate.cr4de_intensity_parameters_feedback = parametersFeedback;
    if (scenariosFeedback !== validation.cr4de_scenarios_feedback)
      fieldsToUpdate.cr4de_scenarios_feedback = scenariosFeedback;
    if (causesFeedback !== validation.cr4de_causes_feedback) fieldsToUpdate.cr4de_causes_feedback = causesFeedback;
    if (effectsFeedback !== validation.cr4de_effects_feedback) fieldsToUpdate.cr4de_effects_feedback = effectsFeedback;
    if (catalysingFeedback !== validation.cr4de_catalysing_effects_feedback)
      fieldsToUpdate.cr4de_catalysing_effects_feedback = catalysingFeedback;
    if (horizonFeedback !== validation.cr4de_horizon_analysis_feedback)
      fieldsToUpdate.cr4de_horizon_analysis_feedback = horizonFeedback;
  }

  const updateValidation = async () => {
    if (!validation || !params.validation_id) return;

    if (Object.keys(fieldsToUpdate).length <= 0) return;

    await api.updateValidation(params.validation_id, fieldsToUpdate);

    setValidation({
      ...validation,
      ...fieldsToUpdate,
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (Object.keys(fieldsToUpdate).length <= 0) return;

      setSaving(true);

      try {
        await updateValidation();
      } catch (e) {
        // Empty by design
      }

      setSaving(false);
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsToUpdate]);

  return (
    <>
      <Box m={2} ml="76px">
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" to="/" component={RouterLink}>
            BNRA 2023 - 2026
          </Link>
          <Link underline="hover" color="inherit" to="/validation" component={RouterLink}>
            Validation
          </Link>
          {riskFile ? (
            <Typography color="text.primary">{riskFile.cr4de_title}</Typography>
          ) : (
            <Skeleton variant="text" width="200px" />
          )}
        </Breadcrumbs>
      </Box>
      <Container sx={{ pb: 8 }}>
        <Paper>
          <Box p={2} my={4}>
            <Typography variant="h6" mb={1} color="secondary">
              1. Definition
            </Typography>
            <Divider />
            {riskFile ? (
              <Box
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

            <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
              Please provide any comments or feedback on the definition of the hazard below:
            </Typography>

            {validation ? (
              <TextInputBox
                initialValue={validation.cr4de_definition_feedback || ""}
                setValue={setDefinitionFeedback}
              />
            ) : (
              <Skeleton variant="rectangular" width="100%" height="300px" />
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

              {riskFile ? (
                <Table>
                  <TableBody>
                    {riskFile.historicalEvents ? (
                      riskFile.historicalEvents.map((e, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                            <Typography variant="subtitle1">{e.location}</Typography>
                            <Typography variant="subtitle2">{e.time}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" paragraph>
                              {e.description}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                          <Typography variant="subtitle1">No historical events suggested...</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Box mt={3}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Box>
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the historical event examples of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_historical_events_feedback || ""}
                  setValue={setHistoricalEventsFeedback}
                />
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
                3. Intensity Parameters
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  Factors which influence the evolution and consequences of an event of this type.
                </Typography>
              </Box>

              {riskFile ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Parameter Name</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Parameter Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskFile.intensityParameters ? (
                      riskFile.intensityParameters.map((e, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                            <Typography variant="body1">{e.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" paragraph>
                              {e.description}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                          <Typography variant="subtitle1">No intensity parameters suggested...</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Box mt={3}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Box>
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the intensity parameters of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_intensity_parameters_feedback || ""}
                  setValue={setParametersFeedback}
                />
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

              {riskFile ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Parameter Name</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Considerable</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Major</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Extreme</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {riskFile.intensityParameters ? (
                      riskFile.intensityParameters.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                            <Typography variant="body1">{p.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" paragraph>
                              {riskFile.scenarios.considerable && riskFile.scenarios.considerable[i]?.value}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" paragraph>
                              {riskFile.scenarios.major && riskFile.scenarios.major[i]?.value}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" paragraph>
                              {riskFile.scenarios.extreme && riskFile.scenarios.extreme[i]?.value}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                          <Typography variant="subtitle1">No intensity parameters suggested...</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Box mt={3}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </Box>
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the intensity scenarios of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_scenarios_feedback || ""}
                  setValue={setScenariosFeedback}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}
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

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the actor capabilities of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_scenarios_feedback || ""}
                  setValue={setScenariosFeedback}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
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

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the horizon analysis of the emerging risk below:
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_scenarios_feedback || ""}
                  setValue={setScenariosFeedback}
                />
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
                  choices={otherHazards.filter(
                    (rf) => !causes.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid)
                  )}
                  chosen={causes.map((c) => ({
                    ...c.cr4de_cause_hazard,
                    reason: c.cr4de_reason,
                  }))}
                  choicesLabel="Non-causing hazards"
                  chosenLabel="Causing hazards"
                  chosenSubheader={`${causes.length} causes identified`}
                />
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the intensity scenarios of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox initialValue={validation.cr4de_causes_feedback || ""} setValue={setCausesFeedback} />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
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
                  choices={otherHazards.filter((rf) =>
                    effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid)
                  )}
                  chosen={effects.map((c) => ({
                    ...c.cr4de_effect_hazard,
                    reason: c.cr4de_reason,
                  }))}
                  choicesLabel="Non-potential action hazards"
                  chosenLabel="Potential action hazards"
                  chosenSubheader={`${effects.length} potential actions identified`}
                />
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the list of potential actions of these actors below:
              </Typography>

              {validation ? (
                <TextInputBox initialValue={validation.cr4de_causes_feedback || ""} setValue={setCausesFeedback} />
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
                  choices={otherHazards.filter(
                    (rf) => !effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid)
                  )}
                  chosen={effects.map((c) => ({
                    ...c.cr4de_effect_hazard,
                    reason: c.cr4de_reason,
                  }))}
                  choicesLabel="Non-effect hazards"
                  chosenLabel="Effect hazards"
                  chosenSubheader={`${effects.length} effects identified`}
                />
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the intensity scenarios of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox initialValue={validation.cr4de_effects_feedback || ""} setValue={setEffectsFeedback} />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
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
                  choices={otherHazards.filter(
                    (rf) => !effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid)
                  )}
                  chosen={effects.map((c) => ({
                    ...c.cr4de_effect_hazard,
                    reason: c.cr4de_reason,
                  }))}
                  choicesLabel="Non-effect hazards"
                  chosenLabel="Effect hazards"
                  chosenSubheader={`${effects.length} effects identified`}
                />
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the intensity scenarios of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox initialValue={validation.cr4de_effects_feedback || ""} setValue={setEffectsFeedback} />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
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
                  choices={otherHazards.filter(
                    (rf) =>
                      rf.cr4de_risk_type === "Emerging Risk" &&
                      !catalysing.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid)
                  )}
                  chosen={catalysing.map((c) => ({
                    ...c.cr4de_cause_hazard,
                    reason: c.cr4de_reason,
                  }))}
                  choicesLabel="Non-catalysing hazards"
                  chosenLabel="Catalysing hazards"
                  chosenSubheader={`${catalysing.length} catalysing effects identified`}
                />
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="secondary">
                Please provide any comments or feedback on the intensity scenarios of the hazard below:
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_catalysing_effects_feedback || ""}
                  setValue={setCatalysingFeedback}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
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
        {saving && (
          <LoadingButton color="secondary" sx={{ mr: 1 }} loading loadingPosition="start" startIcon={<SaveIcon />}>
            Saving
          </LoadingButton>
        )}
        {!saving && Object.keys(fieldsToUpdate).length > 0 && (
          <Button color="secondary" sx={{ mr: 1 }} onClick={updateValidation}>
            Save
          </Button>
        )}
        {!saving && Object.keys(fieldsToUpdate).length <= 0 && (
          <Button color="secondary" disabled sx={{ mr: 1 }}>
            Saved
          </Button>
        )}

        <Button
          color="secondary"
          onClick={() => {
            updateValidation();
            navigate("/validation");
          }}
        >
          Save & Exit
        </Button>
      </Box>
    </>
  );
}
