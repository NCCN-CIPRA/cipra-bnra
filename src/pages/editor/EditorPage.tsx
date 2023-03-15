import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TextInputBox from "../../components/TextInputBox";
import SaveIcon from "@mui/icons-material/Save";
import { DVRiskFile, RiskFileEditableFields } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import * as S from "../../functions/scenarios";
import * as HE from "../../functions/historicalEvents";
import * as IP from "../../functions/intensityParameters";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecord from "../../hooks/useRecord";
import useLazyRecords from "../../hooks/useLazyRecords";
import usePageTitle from "../../hooks/usePageTitle";
import { Breadcrumb } from "../../components/BreadcrumbNavigation";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import HistoricalEventsTable from "../../components/HistoricalEventsTable";
import IntensityParametersTable from "../../components/IntensityParametersTable";
import ScenariosTable from "../../components/ScenariosTable";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import Attachments from "../../components/Attachments";
import FeedbackList from "./FeedbackList";
import { DVValidation } from "../../types/dataverse/DVValidation";
import { DVContact } from "../../types/dataverse/DVContact";
import ParticipationTable from "../../components/ParticipationTable";
import CascadeSections from "./CascadeSections";
import { TNullablePartial } from "../../types/TNullablePartial";
import { Trans } from "react-i18next";
import { addDays } from "../../functions/days";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import useProcess from "../../hooks/useProcess";

export interface ProcessedRiskFile extends DVRiskFile {
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
  const process = useProcess();
  const params = useParams() as RouteParams;
  const navigate = useNavigate();
  const fieldsToUpdate = useRef<Partial<RiskFileEditableFields>>({});
  const feedbackRefs = useRef<Partial<DVValidation>[]>([]);

  const [dirty, setDirty] = useState(false);
  const [validationProcessedDialogOpen, setValidationProcessedDialogOpen] = useState(false);
  const [validationNotProcessedDialogOpen, setValidationNotProcessedDialogOpen] = useState(false);

  const { data: otherHazards, getData: getOtherHazards } = useLazyRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
  });
  const [causes, setCauses] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  const [catalysing, setCatalysing] = useState<DVRiskCascade<SmallRisk>[] | null>(null);

  const { data: participants, getData: getParticipants } = useLazyRecords<DVParticipation<DVContact>>({
    table: DataTable.PARTICIPATION,
  });
  const { data: allCauses, getData: getAllCauses } = useLazyRecords<DVRiskCascade<SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    onComplete: async (allCauses) => {
      setCauses(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk"));
      setCatalysing(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
    },
  });
  const { data: effects, getData: getEffects } = useLazyRecords<DVRiskCascade<undefined, SmallRisk>>({
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
      if (!participants) {
        getParticipants({
          query: `$filter=_cr4de_risk_file_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_contact`,
        });
      }
      if (!otherHazards)
        getOtherHazards({
          query: `$filter=cr4de_riskfilesid ne ${rf.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
        });
      if (!allCauses)
        getAllCauses({
          query: `$filter=_cr4de_effect_hazard_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
          onComplete: async (allCauses) => {
            setCauses(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk"));
            setCatalysing(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
          },
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

  const unprocessedFeedback = (): { [key: string]: DVValidation<unknown, DVContact>[] } => {
    if (validations === null) return {};

    return {
      ...({
        Definition: validations.filter(
          (v) => v.cr4de_definition_feedback !== null && v.cr4de_definition_feedback_response === null
        ),
      } || {}),
      ...({
        "Historical Events": validations.filter(
          (v) => v.cr4de_historical_events_feedback !== null && v.cr4de_historical_events_feedback_response === null
        ),
      } || {}),
      ...({
        "Intensity Parameters": validations.filter(
          (v) =>
            v.cr4de_intensity_parameters_feedback !== null && v.cr4de_intensity_parameters_feedback_response === null
        ),
      } || {}),
      ...({
        "Scenarios/Horizon Analysis": validations.filter(
          (v) => v.cr4de_scenarios_feedback !== null && v.cr4de_scenarios_feedback_response === null
        ),
      } || {}),
      ...({
        Causes: validations.filter(
          (v) => v.cr4de_causes_feedback !== null && v.cr4de_causes_feedback_response === null
        ),
      } || {}),
      ...({
        Effects: validations.filter(
          (v) => v.cr4de_effects_feedback !== null && v.cr4de_effects_feedback_response === null
        ),
      } || {}),
      ...({
        "Catalysing Effects": validations.filter(
          (v) => v.cr4de_catalysing_effects_feedback !== null && v.cr4de_catalysing_effects_feedback_response === null
        ),
      } || {}),
    };
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFields = async (fields: Partial<RiskFileEditableFields>) => {
    if (!riskFile || isSaving) return;

    setIsSaving(true);

    await api.updateRiskFile(params.risk_file_id, fields);

    setIsSaving(false);
  };

  const handleSaveField = (field: keyof RiskFileEditableFields) => async (newValue: string | null) => {
    return handleSaveFields({ [field]: newValue });
  };

  const handleSetFieldUpdates = async (fields: Partial<{ [key in keyof RiskFileEditableFields]: string | null }>) => {
    Object.keys(fields).forEach((f) => {
      const newValue = fields[f as keyof RiskFileEditableFields];

      if (newValue === undefined) {
        if (fieldsToUpdate.current[f as keyof RiskFileEditableFields]) {
          delete fieldsToUpdate.current[f as keyof RiskFileEditableFields];
        }
      } else {
        fieldsToUpdate.current[f as keyof RiskFileEditableFields] = newValue;
      }
    });

    setDirty(Object.keys(fieldsToUpdate.current).length > 0);
  };

  const handleSetFieldUpdate = (field: keyof DVRiskFile) => async (newValue: string | null | undefined) => {
    return handleSetFieldUpdates({ [field]: newValue });
  };

  const handleSave = async () => {
    if (!riskFile) return;
    setIsSaving(true);

    await api.updateRiskFile(params.risk_file_id, fieldsToUpdate.current);

    await Promise.all(
      feedbackRefs.current.map((validation) => {
        if (!validation.cr4de_bnravalidationid || Object.keys(validation).length <= 1) return Promise.resolve();

        return api.updateValidation(validation.cr4de_bnravalidationid, {
          ...validation,
          cr4de_bnravalidationid: undefined,
        });
      })
    );

    feedbackRefs.current = [];

    setIsSaving(false);
  };

  usePageTitle("BNRA 2023 - 2026 Risk File Editor");
  useBreadcrumbs([...defaultBreadcrumbs, riskFile ? { name: riskFile.cr4de_title, url: "" } : null]);

  return (
    <>
      <Container sx={{ pb: 8 }}>
        {riskFile && participants && (
          <ParticipationTable riskFile={riskFile} participants={participants} reloadParticipants={getParticipants} />
        )}

        <Paper>
          <Box p={2} my={4}>
            <Typography variant="h6" color="primary" sx={{ flex: 1 }}>
              1. Definition
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {riskFile ? (
              <TextInputBox
                initialValue={riskFile.cr4de_definition}
                onSave={handleSaveField("cr4de_definition")}
                setUpdatedValue={handleSetFieldUpdate("cr4de_definition")}
              />
            ) : (
              <Box mt={3}>
                <Skeleton variant="text" />
              </Box>
            )}

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="definition"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
              }
            >
              <Box sx={{ mx: 0, my: 4 }}>
                <FeedbackList validations={validations} field="definition" feedbackRefs={feedbackRefs} />
              </Box>
            </Attachments>
          </Box>
        </Paper>

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
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
                initialHistoricalEvents={riskFile?.cr4de_historical_events}
                onSave={handleSaveField("cr4de_historical_events")}
                setUpdatedValue={handleSetFieldUpdate("cr4de_historical_events")}
              />

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="historical_events"
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
                }
              >
                <Box sx={{ mx: 0, my: 4 }}>
                  <FeedbackList validations={validations} field="historical_events" feedbackRefs={feedbackRefs} />
                </Box>
              </Attachments>
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
                3. Intensity Parameters
              </Typography>
              <Divider />

              <Box mt={1}>
                <Typography variant="caption" paragraph>
                  Factors which influence the evolution and consequences of an event of this type.
                </Typography>
              </Box>

              <IntensityParametersTable
                initialParameters={riskFile?.cr4de_intensity_parameters}
                onSave={handleSaveField("cr4de_intensity_parameters")}
                setUpdatedValue={handleSetFieldUpdate("cr4de_intensity_parameters")}
              />

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="intensity_parameters"
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
                }
              >
                <Box sx={{ mx: 0, my: 4 }}>
                  <FeedbackList validations={validations} field="intensity_parameters" feedbackRefs={feedbackRefs} />
                </Box>
              </Attachments>
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
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
                initialScenarios={{
                  considerable: riskFile?.cr4de_scenario_considerable,
                  major: riskFile?.cr4de_scenario_major,
                  extreme: riskFile?.cr4de_scenario_extreme,
                }}
                onSave={handleSaveFields}
                setUpdatedValue={handleSetFieldUpdates}
              />

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="scenarios"
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
                }
              >
                <Box sx={{ mx: 0, my: 4 }}>
                  <FeedbackList validations={validations} field="scenarios" feedbackRefs={feedbackRefs} />
                </Box>
              </Attachments>
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
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
                  <TextInputBox
                    initialValue={riskFile.cr4de_scenario_considerable}
                    onSave={handleSaveField("cr4de_scenario_considerable")}
                    setUpdatedValue={handleSetFieldUpdate("cr4de_scenario_considerable")}
                  />
                  <Typography variant="subtitle2">Major Capabilities</Typography>
                  <TextInputBox
                    initialValue={riskFile.cr4de_scenario_major}
                    onSave={handleSaveField("cr4de_scenario_major")}
                    setUpdatedValue={handleSetFieldUpdate("cr4de_scenario_major")}
                  />
                  <Typography variant="subtitle2">Extreme Capabilities</Typography>
                  <TextInputBox
                    initialValue={riskFile.cr4de_scenario_extreme}
                    onSave={handleSaveField("cr4de_scenario_extreme")}
                    setUpdatedValue={handleSetFieldUpdate("cr4de_scenario_extreme")}
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
                riskFile={riskFile}
                field="scenarios"
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
                }
              >
                <Box sx={{ mx: 0, my: 4 }}>
                  <FeedbackList validations={validations} field="scenarios" feedbackRefs={feedbackRefs} />
                </Box>
              </Attachments>
            </Box>
          </Paper>
        )}

        {riskFile && riskFile.cr4de_risk_type === "Emerging Risk" && (
          <Paper>
            <Box p={2} my={8}>
              <Typography variant="h6" mb={1} color="primary">
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
                <TextInputBox
                  initialValue={riskFile.cr4de_horizon_analysis}
                  onSave={handleSaveField("cr4de_horizon_analysis")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_horizon_analysis")}
                />
              ) : (
                <Box mt={3}>
                  <Skeleton variant="text" />
                </Box>
              )}

              <Attachments
                attachments={attachments}
                riskFile={riskFile}
                field="horizon_analysis"
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
                }
              >
                <Box sx={{ mx: 0, my: 4 }}>
                  <FeedbackList validations={validations} field="scenarios" feedbackRefs={feedbackRefs} />
                </Box>
              </Attachments>
            </Box>
          </Paper>
        )}

        <CascadeSections
          riskFile={riskFile}
          otherHazards={otherHazards}
          causes={causes}
          effects={effects}
          catalysing={catalysing}
          validations={validations}
          attachments={attachments}
          feedbackRefs={feedbackRefs}
          setIsSaving={setIsSaving}
          getAllCauses={getAllCauses}
          getEffects={getEffects}
          getAttachments={getAttachments}
        />
      </Container>

      <Dialog open={validationProcessedDialogOpen} onClose={() => setValidationProcessedDialogOpen(false)}>
        <DialogTitle>Are you finished processing the validation feedback for this risk file?</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <DialogContentText>
            <Typography variant="body1" paragraph>
              You have the option to start a silent procedure or to organise a consensus meeting.
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography variant="body1" paragraph>
              If you choose a silent procedure, your experts will be automatically notified of this. After the end of
              the silent procedure, the validation step will be finalized automatically and the experts will no longer
              be able to change their input.{" "}
              <b>ATTENTION! If a silence procedure is already underway, Pressing this button will reset the timer.</b>
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography variant="body1" paragraph>
              If you would like to organise a meeting, nothing will change and you will have to contact your experts
              manually. If you previously started a silence procedure, pressing this button will cancel it.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Button
            onClick={() => {
              setValidationProcessedDialogOpen(false);

              navigate("/hazards");
            }}
          >
            I am not finished
          </Button>
          <Button
            onClick={async () => {
              if (!riskFile) return;

              process.startSilenceProcedure(riskFile);

              navigate("/hazards");
            }}
          >
            Start a silence procedure
          </Button>
          <Button
            onClick={async () => {
              if (!riskFile) return;

              process.organiseValidationConsensus(riskFile);

              navigate("/hazards");
            }}
          >
            I will organise a consensus meeting
          </Button>
          <Button
            color="error"
            onClick={() => {
              setValidationProcessedDialogOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={validationNotProcessedDialogOpen} onClose={() => setValidationNotProcessedDialogOpen(false)}>
        <DialogTitle>You have not responded to all feedback</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <DialogContentText>
            <Typography variant="body1" paragraph>
              You need to respond to each experts' feedback before you can start a silence procedure. Missing responses:
            </Typography>
          </DialogContentText>
          <DialogContentText>
            {Object.entries(unprocessedFeedback()).map(([field, missing]) => (
              <Typography variant="body1">
                Feedback on {field.toLowerCase()} by {missing.map((v) => v.cr4de_expert.emailaddress1).join(", ")}
              </Typography>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Button
            onClick={() => {
              setValidationNotProcessedDialogOpen(false);

              navigate("/hazards");
            }}
          >
            I will continue at a later time
          </Button>
          <Button
            color="error"
            onClick={() => {
              setValidationNotProcessedDialogOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
        <Button color="error" sx={{ mr: 1 }} component={RouterLink} to="/hazards">
          Exit
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {isSaving ? (
          <LoadingButton color="secondary" sx={{ mr: 1 }} loading loadingPosition="start" startIcon={<SaveIcon />}>
            Saving
          </LoadingButton>
        ) : (
          <Button color="primary" sx={{ mr: 1 }} onClick={handleSave}>
            Save
          </Button>
        )}

        <Button
          color="primary"
          onClick={async () => {
            await handleSave();

            if (participants?.some((p) => p.cr4de_validation_finished)) {
              if (Object.keys(unprocessedFeedback()).length > 0) {
                setValidationNotProcessedDialogOpen(true);
              } else {
                setValidationProcessedDialogOpen(true);
              }
            } else {
              navigate("/hazards");
            }
          }}
        >
          Save & Exit
        </Button>
      </Box>
    </>
  );
}
