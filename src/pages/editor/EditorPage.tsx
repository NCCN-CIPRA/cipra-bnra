import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Box, Container, Typography, Paper, Divider, Button, Skeleton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TextInputBox from "../../components/TextInputBox";
import SaveIcon from "@mui/icons-material/Save";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
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
  const params = useParams() as RouteParams;
  const navigate = useNavigate();
  const fieldsToUpdate = useRef<TNullablePartial<DVRiskFile>>({});

  const [dirty, setDirty] = useState(false);

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
      if (!validations)
        getValidations({
          query: `$filter=_cr4de_riskfile_value eq ${rf.cr4de_riskfilesid}&$expand=cr4de_expert`,
        });
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFields = async (fields: Partial<{ [key in keyof DVRiskFile]: string | null }>) => {
    if (!riskFile) return;

    setIsSaving(true);

    await api.updateRiskFile(params.risk_file_id, fields);

    setIsSaving(false);
  };

  const handleSaveField = (field: keyof DVRiskFile) => async (newValue: string | null) => {
    console.log("Saving ", field, " as ", newValue);
    return handleSaveFields({ [field]: newValue });
  };

  const handleSetFieldUpdates = async (fields: Partial<{ [key in keyof DVRiskFile]: string | null }>) => {
    Object.keys(fields).forEach((f) => {
      const newValue = fields[f as keyof DVRiskFile];

      if (newValue === undefined) {
        if (fieldsToUpdate.current[f as keyof DVRiskFile]) {
          delete fieldsToUpdate.current[f as keyof DVRiskFile];
        }
      } else {
        fieldsToUpdate.current[f as keyof DVRiskFile] = newValue;
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

    setIsSaving(false);
  };

  usePageTitle("BNRA 2023 - 2026 Risk File Editor");
  useBreadcrumbs([...defaultBreadcrumbs, riskFile ? { name: riskFile.cr4de_title, url: "" } : null]);

  return (
    <>
      <Container sx={{ pb: 8 }}>
        {riskFile && <ParticipationTable riskFile={riskFile} />}

        <Paper>
          <Box p={2} my={4}>
            <Typography variant="h6" color="secondary" sx={{ flex: 1 }}>
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
                <FeedbackList validations={validations} field="definition" />
              </Box>
            </Attachments>
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
                  <FeedbackList validations={validations} field="historical_events" />
                </Box>
              </Attachments>
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
                  <FeedbackList validations={validations} field="intensity_parameters" />
                </Box>
              </Attachments>
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
                  <FeedbackList validations={validations} field="scenarios" />
                </Box>
              </Attachments>
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
                  <FeedbackList validations={validations} field="scenarios" />
                </Box>
              </Attachments>
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
                  <FeedbackList validations={validations} field="horizon_analysis" />
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
          setIsSaving={setIsSaving}
          getAllCauses={getAllCauses}
          getEffects={getEffects}
          getAttachments={getAttachments}
        />
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
        {isSaving ? (
          <LoadingButton color="secondary" sx={{ mr: 1 }} loading loadingPosition="start" startIcon={<SaveIcon />}>
            Saving
          </LoadingButton>
        ) : (
          <Button color="secondary" sx={{ mr: 1 }} onClick={handleSave}>
            Save
          </Button>
        )}

        <Button
          color="secondary"
          onClick={async () => {
            await handleSave();

            navigate("/editor");
          }}
        >
          Save & Exit
        </Button>
      </Box>
    </>
  );
}
