import { useEffect, useRef, useState } from "react";
import { Box, Typography, Paper, Divider, Container } from "@mui/material";
import TextInputBox from "../../../components/TextInputBox";
import { DVRiskFile, RiskFileEditableFields } from "../../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import * as S from "../../../functions/scenarios";
import * as HE from "../../../functions/historicalEvents";
import * as IP from "../../../functions/intensityParameters";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import useLazyRecords from "../../../hooks/useLazyRecords";
import HistoricalEventsTable from "../../../components/HistoricalEventsTable";
import IntensityParametersTable from "../../../components/IntensityParametersTable";
import ScenariosTable from "../../../components/ScenariosTable";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import Attachments from "../../../components/Attachments";
import { DVValidation } from "../../../types/dataverse/DVValidation";
import CascadeSections from "./CascadeSections";
import LoadingTab from "../LoadingTab";

export interface ProcessedRiskFile extends DVRiskFile {
  historicalEvents: HE.HistoricalEvent[];
  intensityParameters: IP.IntensityParameter[];
  scenarios: S.Scenarios;
}

export default function IdentificationTab({
  riskFile,
  cascades,
  otherRisks,
  onUpdateCascades,
}: {
  riskFile: DVRiskFile | null;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  otherRisks: SmallRisk[] | null;
  onUpdateCascades: () => Promise<unknown>;
}) {
  const api = useAPI();
  const fieldsToUpdate = useRef<Partial<RiskFileEditableFields>>({});
  const feedbackRefs = useRef<Partial<DVValidation>[]>([]);

  const [processedRiskFile, setProcessedRiskFile] = useState<ProcessedRiskFile | null>(null);
  const [causes, setCauses] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  const [effects, setEffects] = useState<DVRiskCascade<unknown, SmallRisk>[] | null>(null);
  const [catalysing, setCatalysing] = useState<DVRiskCascade<SmallRisk>[] | null>(null);

  const { data: attachments, getData: getAttachments } = useLazyRecords<DVAttachment>({
    table: DataTable.ATTACHMENT,
  });

  useEffect(() => {
    if (riskFile && cascades) {
      const ips = IP.unwrap(riskFile.cr4de_intensity_parameters);

      setProcessedRiskFile({
        ...riskFile,
        historicalEvents: HE.unwrap(riskFile.cr4de_historical_events),
        intensityParameters: ips,
        scenarios: S.unwrap(
          ips,
          riskFile.cr4de_scenario_considerable,
          riskFile.cr4de_scenario_major,
          riskFile.cr4de_scenario_extreme
        ),
      });
      setCauses(
        cascades.filter(
          (c) =>
            c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
            c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk"
        )
      );
      setEffects(cascades.filter((c) => c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid));
      setCatalysing(
        cascades.filter(
          (c) =>
            c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
            c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"
        )
      );
    }
  }, [riskFile, cascades]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFields = async (fields: Partial<RiskFileEditableFields>) => {
    if (!riskFile || isSaving) return;

    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, fields);

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
  };

  const handleSetFieldUpdate = (field: keyof DVRiskFile) => async (newValue: string | null | undefined) => {
    return handleSetFieldUpdates({ [field]: newValue });
  };

  const handleSave = async () => {
    if (!riskFile) return;
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, fieldsToUpdate.current);

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

  if (riskFile === null || processedRiskFile === null || causes === null || effects === null || catalysing === null)
    return <LoadingTab />;

  return (
    <Container>
      <Paper>
        <Box p={2} my={4}>
          <Typography variant="h6" color="primary" sx={{ flex: 1 }}>
            1. Definition
          </Typography>
          <Divider sx={{ mb: 1 }} />

          <TextInputBox
            initialValue={riskFile.cr4de_definition}
            onSave={handleSaveField("cr4de_definition")}
            setUpdatedValue={handleSetFieldUpdate("cr4de_definition")}
          />

          <Attachments
            attachments={attachments}
            riskFile={riskFile}
            field="definition"
            onUpdate={() =>
              getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
            }
          ></Attachments>
        </Box>
      </Paper>

      {riskFile.cr4de_risk_type === "Standard Risk" && (
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
            ></Attachments>
          </Box>
        </Paper>
      )}

      {riskFile.cr4de_risk_type === "Standard Risk" && (
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
            ></Attachments>
          </Box>
        </Paper>
      )}

      {riskFile.cr4de_risk_type === "Standard Risk" && (
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
              parameters={processedRiskFile.intensityParameters}
              initialScenarios={{
                considerable: processedRiskFile.cr4de_scenario_considerable,
                major: processedRiskFile.cr4de_scenario_major,
                extreme: processedRiskFile.cr4de_scenario_extreme,
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
            ></Attachments>
          </Box>
        </Paper>
      )}

      {riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
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

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="scenarios"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            ></Attachments>
          </Box>
        </Paper>
      )}

      {riskFile.cr4de_risk_type === "Emerging Risk" && (
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

            <TextInputBox
              initialValue={riskFile.cr4de_horizon_analysis}
              onSave={handleSaveField("cr4de_horizon_analysis")}
              setUpdatedValue={handleSetFieldUpdate("cr4de_horizon_analysis")}
            />

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="horizon_analysis"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            ></Attachments>
          </Box>
        </Paper>
      )}

      <CascadeSections
        riskFile={riskFile}
        otherHazards={otherRisks}
        causes={causes}
        effects={effects}
        catalysing={catalysing}
        attachments={attachments}
        setIsSaving={setIsSaving}
        onUpdateCascades={onUpdateCascades}
        getAttachments={getAttachments}
      />
    </Container>
  );
}
