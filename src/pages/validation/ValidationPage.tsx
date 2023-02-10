import { useMemo, useRef, useState } from "react";
import { Link as RouterLink, useNavigate, useOutletContext, useParams } from "react-router-dom";
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
  IconButton,
  Alert,
} from "@mui/material";
import { AlertTitle, LoadingButton } from "@mui/lab";
import TextInputBox from "../../components/TextInputBox";
import TransferList from "../../components/TransferList";
import SaveIcon from "@mui/icons-material/Save";
import { DVValidation } from "../../types/dataverse/DVValidation";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import useAPI, { DataTable } from "../../hooks/useAPI";
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
import SurveyDialog from "../../components/SurveyDialog";
import { AuthPageContext } from "../AuthPage";
import { TNullablePartial } from "../../types/TNullablePartial";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import ValidationTutorial from "./ValidationTutorial";
import HelpButton from "../../components/HelpButton";

interface ProcessedRiskFile extends DVRiskFile {
  historicalEvents: HE.HistoricalEvent[];
  intensityParameters: IP.IntensityParameter[];
  scenarios: S.Scenarios;
}

type RouteParams = {
  validation_id: string;
};

export default function ValidationPage() {
  const params = useParams() as RouteParams;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();
  const fieldsToUpdate = useRef<TNullablePartial<DVValidation>>({});

  const [dirty, setDirty] = useState(false);

  const [riskFile, setRiskFile] = useState<ProcessedRiskFile | null>(null);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);

  const { data: otherHazards, getData: getOtherHazards } = useLazyRecords<SmallRisk>({
    table: DataTable.RISK_FILE,
  });
  const [causes, setCauses] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  const [catalysing, setCatalysing] = useState<DVRiskCascade<SmallRisk>[] | null>(null);
  const { data: allCauses, getData: getAllCauses } = useLazyRecords<DVRiskCascade<SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    onComplete: async (allCauses) => {
      setCauses(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk"));
      setCatalysing(allCauses.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk"));
    },
  });
  const { data: effects, getData: getEffects } = useLazyRecords<DVRiskCascade<string, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
  });
  const { data: attachments, getData: getAttachments } = useLazyRecords<DVAttachment>({
    table: DataTable.ATTACHMENT,
  });

  /**
   * Retrieve the Validation record from the database that is defined in the page url when the page loads
   */
  const { data: validation, reloadData: reloadValidation } = useRecord<DVValidation<DVRiskFile>>({
    table: DataTable.VALIDATION,
    id: params.validation_id,
    query: "$expand=cr4de_RiskFile",
    onComplete: async (result) => {
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

      if (!otherHazards)
        getOtherHazards({
          query: `$filter=cr4de_riskfilesid ne ${processedRiskFile.cr4de_riskfilesid}&$select=cr4de_riskfilesid,cr4de_hazard_id,cr4de_title,cr4de_risk_type,cr4de_definition`,
        });
      if (!allCauses)
        getAllCauses({
          query: `$filter=_cr4de_effect_hazard_value eq ${processedRiskFile.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
        });
      if (!effects)
        getEffects({
          query: `$filter=_cr4de_cause_hazard_value eq ${processedRiskFile.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
        });
      if (!attachments)
        getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${processedRiskFile.cr4de_riskfilesid}` });
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFields = async (fields: Partial<{ [key in keyof DVValidation]: string | null }>) => {
    if (!validation) return;

    setIsSaving(true);

    await api.updateValidation(params.validation_id, fields);

    setIsSaving(false);
  };

  const handleSaveField = (field: keyof DVValidation) => async (newValue: string | null) => {
    return handleSaveFields({ [field]: newValue });
  };

  const handleSetFieldUpdates = async (fields: Partial<{ [key in keyof DVValidation]: string | null }>) => {
    Object.keys(fields).forEach((f) => {
      const newValue = fields[f as keyof DVValidation];

      if (newValue === undefined) {
        if (fieldsToUpdate.current[f as keyof DVValidation]) {
          delete fieldsToUpdate.current[f as keyof DVValidation];
        }
      } else {
        //  @ts-expect-error
        fieldsToUpdate.current[f as keyof DVValidation] = newValue;
      }
    });

    setDirty(Object.keys(fieldsToUpdate.current).length > 0);
  };

  const handleSetFieldUpdate = (field: keyof DVValidation) => async (newValue: string | null | undefined) => {
    return handleSetFieldUpdates({ [field]: newValue });
  };

  const handleSave = async () => {
    if (!validation) return;
    setIsSaving(true);

    await api.updateValidation(params.validation_id, fieldsToUpdate.current);

    setIsSaving(false);
  };

  usePageTitle(t("validation.pageTitle", "BNRA 2023 - 2026 Risk Identification"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("validation.breadcrumb", "Risk Identification"), url: "/overview" },
    riskFile ? { name: riskFile.cr4de_title, url: "" } : null,
  ]);

  // Calculate transfer list data (causes, effects, catalysing effect) and memorize for efficiency
  const causesChoises = useMemo<SmallRisk[]>(
    () =>
      otherHazards && causes
        ? otherHazards
            .filter(
              (rf) =>
                !causes.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid) &&
                rf.cr4de_risk_type !== "Emerging Risk"
            )
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
            .filter(
              (rf) =>
                rf.cr4de_risk_type === "Standard Risk" &&
                !effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid)
            )
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

  const catalysedEffectsChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && effects
        ? otherHazards
            .filter(
              (rf) =>
                rf.cr4de_risk_type !== "Emerging Risk" &&
                !effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid)
            )
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [effects, otherHazards]
  );
  const catalysedEffectsChosen = useMemo(
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
              id="definition-help-button"
              steps={[
                {
                  disableBeacon: true,
                  target: "body",
                  placement: "center",
                  content: (
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body1" my={2}>
                        <Trans i18nKey="validation.definition.info.1">
                          The base of each risk file is the definition. It determines the scope of the risk under study
                          and in some cases it also specifies which elements fall outside the scope. This section also
                          specifies, if relevant, the differences between the risk studied and the other risks studied
                          within the framework of this Belgian National Risk Assessment.
                        </Trans>
                      </Typography>
                    </Box>
                  ),
                  styles: { options: { width: 800 } },
                },

                {
                  disableBeacon: true,
                  target: "body",
                  placement: "center",
                  content: (
                    <Box sx={{ textAlign: "left" }}>
                      <Typography variant="body1" my={2}>
                        <Trans i18nKey="validation.definition.info.2">
                          The definition should be as short and concise as possible (to ensure optimal readability for
                          efficient referencing) while still being complete and clearly delineating the scope of the
                          risk (and outlining the distinctions relative to other risks where necessary).
                        </Trans>
                      </Typography>
                      <Typography variant="body1" my={2}>
                        <Trans i18nKey="validation.definition.info.3">
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

            <Typography variant="subtitle2" mt={8} mb={2} color="primary">
              <Trans i18nKey="riskFile.definition.feedback">
                Please provide any comments or feedback on the definition of the hazard below:
              </Trans>
            </Typography>

            {validation ? (
              <TextInputBox
                id="defintion-feedback"
                initialValue={validation.cr4de_definition_feedback}
                onSave={handleSaveField("cr4de_definition_feedback")}
                setUpdatedValue={handleSetFieldUpdate("cr4de_definition_feedback")}
              />
            ) : (
              <Skeleton variant="rectangular" width="100%" height="300px" />
            )}

            <Attachments
              attachments={attachments}
              field="definition"
              riskFile={riskFile}
              validation={validation}
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
              <HelpButton
                id="historical-events-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.historicalEvents.info.1.1">
                            De historische gebeurtenissen in de risicofiche zijn voorbeelden van gebeurtenissen die zich
                            in België of in het buitenland hebben voorgedaan.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.historicalEvents.info.1.2">
                            Deze sectie is optioneel en beoogt evenmin volledig te zijn, maar ze kan wel helpen bij de
                            selectie van relevante intensiteitsparameters.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.historicalEvents.info.2.1">
                            We nodigen u uit om kennis te nemen van de historische gebeurtenissen in de onlineapplicatie
                            en deze te verbeteren of aan te vullen met andere relevante historische gebeurtenissen en/of
                            feedback te geven in het daartoe voorziene vak.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.historicalEvents.info.2.2">
                            Van specifiek belang zijn grootte-ordes van de intensiteit en/of impact van de gebeurtenis.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.historicalEvents.info.2.3">
                            Indien u beschikt over referenties, kunnen deze onderaan toegevoegd worden.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
              <Typography variant="h6" mb={1} color="primary">
                2. <Trans i18nKey="riskFile.historicalEvents.title">Historical Events</Trans>
              </Typography>
              <Divider />

              <HistoricalEventsTable initialHistoricalEvents={riskFile?.cr4de_historical_events} />

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.historicalEvents.feedback">
                  Please provide any comments or feedback on the historical event examples of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_historical_events_feedback}
                  onSave={handleSaveField("cr4de_historical_events_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_historical_events_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="historical_events"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="parameters-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.1.1">
                            Het beoordelen van een risico in termen van impact en waarschijnlijkheid op basis van een
                            definitie alleen kan ingewikkeld zijn. Een risico kan zich immers in verschillende mate van
                            intensiteit voordoen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.1.2">
                            Om dit probleem op te vangen, wordt elk te beoordelen risico gekarakteriseerd aan de hand
                            van 3 intensiteitscenario's; een “<i>considerable</i>", een “<i>major</i>" en een "
                            <i>extreme</i>" scenario, deze worden opgebouwd aan de hand van risicospecifieke
                            <b>intensiteitsparameters</b>.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.2.1">
                            De <b>intensiteitsparameters</b> komen overeen met factoren die de ontwikkeling en de
                            gevolgen van het risico beïnvloeden.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.2.2">
                            Elk risico wordt dus gekenmerkt door specifieke parameters. Zo zijn de parameters die de
                            risico's « <i>fluvial flood</i> » en « <i>nuclear plant incident</i> » kenmerken
                            verschillend, omdat zij specifiek zijn voor het te beoordelen risico.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.3.1">
                            Bijvoorbeeld, het risico « nuclear plant incident » wordt gekenmerkt door volgende
                            specifieke parameters; die de ontwikkeling en de gevolgen van het risico beïnvloeden:
                          </Trans>
                        </Typography>
                        <ul>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.parameters.info.3.2">
                                <b>Type incident:</b> parameter die de aard van het incident beschrijft
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.parameters.info.3.3">
                                <b>Vrijgavetijd:</b> tijd tussen het incident en het vrijkomen van nucleaire stoffen
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.parameters.info.3.4">
                                <b>Meteorologische omstandigheden:</b> beschrijft de meteorologische omstandigheden
                                tijdens het incident.
                              </Trans>
                            </Typography>
                          </li>
                        </ul>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.4.1">
                            We nodigen u uit om de voorgestelde intensiteitsparameters en hun omschrijving te bestuderen
                            en feedback te formuleren ten aanzien van deze elementen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.parameters.info.4.2">
                            Als u vindt dat er een specifieke parameter ontbreekt om de intensiteitsscenario's te
                            karakteriseren, kan u dit aangeven in het daartoe bestemde vak.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.intensityParameters.feedback">
                  Please provide any comments or feedback on the intensity parameters of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_intensity_parameters_feedback}
                  onSave={handleSaveField("cr4de_intensity_parameters_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_intensity_parameters_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="intensity_parameters"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="scenarios-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.scenarios.info.1.1">
                            Het beoordelen van een risico in termen van impact en waarschijnlijkheid op basis van een
                            definitie alleen kan ingewikkeld zijn. Een risico kan zich immers in verschillende mate van
                            intensiteit voordoen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.scenarios.info.1.2">
                            Om dit probleem op te vangen, wordt elk te beoordelen risico gekarakteriseerd aan de hand
                            van 3 intensiteitscenario's; een “<i>considerable</i>", een “<i>major</i>" en een "
                            <i>extreme</i>" scenario, deze worden opgebouwd aan de hand van risicospecifieke
                            <b>intensiteitsparameters</b>.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.scenarios.info.2.1">
                            Om een intensiteitsscenario te definiëren of vorm te geven, wordt aan elk van de specifieke
                            parameters hierboven een waarde toegekend. De parameter “<i>Vrijgavetijd</i>” kan
                            bijvoorbeeld worden geschat op 12 uur voor een “<i>considerable</i>” scenario, 9 uur voor
                            een “<i>mayor</i>” scenario en tussen 2 en 4 uur voor een “<i>extreme</i>” scenario.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.scenarios.info.2.2">
                            Tijdens de volgende stappen van de risicobeoordeling, net na deze identificatiestap, dienen
                            alle 3 risicoscenario’s apart van elkaar beoordeeld te worden. Daarom is het tijdens deze
                            eerste stap belangrijk dat de 3 intensiteitsscenario's door alle deelnemende experten, voor
                            een specifiek risico, gevalideerd worden.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.scenarios.info.3.1">
                            We nodigen u uit om de drie voorgestelde intensiteitsscenario's voor uw risico te bestuderen
                            en eventuele feedback te formuleren in het daartoe bestemde vak.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.intensityScenarios.feedback">
                  Please provide any comments or feedback on the intensity scenarios of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_scenarios_feedback}
                  onSave={handleSaveField("cr4de_scenarios_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_scenarios_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="scenarios"
                riskFile={riskFile}
                validation={validation}
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
                <HelpButton
                  id="actions-help-button"
                  steps={[
                    {
                      disableBeacon: true,
                      target: "body",
                      placement: "center",
                      content: (
                        <Box sx={{ textAlign: "left" }}>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.1.1">
                              La section concernant les capacités des acteurs permet de distinguer trois scénarios
                              d’intensité pour les risques malveillants d’origine humaine en regroupant les acteurs
                              selon trois niveaux de capacité.
                            </Trans>
                          </Typography>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.1.2">
                              Plus précisément, les 3 scénarios d’intensité suivants sont considérés:
                            </Trans>
                          </Typography>
                          <ul>
                            <li>
                              <Typography variant="body1" my={2}>
                                <Trans i18nKey="validation.capabilities.info.1.3">
                                  <b>Considérable:</b> regroupe les acteurs disposant de faibles capacités techniques et
                                  opérationnelles
                                </Trans>
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body1" my={2}>
                                <Trans i18nKey="validation.capabilities.info.1.4">
                                  <b>Majeur:</b> regroupe les acteurs disposant de capacités techniques ou
                                  opérationnelles élevées (mais pas les deux à la fois)
                                </Trans>
                              </Typography>
                            </li>
                            <li>
                              <Typography variant="body1" my={2}>
                                <Trans i18nKey="validation.capabilities.info.1.5">
                                  <b>Extrême:</b> regroupe les acteurs disposant de capacités techniques et
                                  opérationnelles élevées.
                                </Trans>
                              </Typography>
                            </li>
                          </ul>
                        </Box>
                      ),
                      styles: { options: { width: 800 } },
                    },
                    {
                      disableBeacon: true,
                      target: "body",
                      placement: "center",
                      content: (
                        <Box sx={{ textAlign: "left" }}>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.2.1">
                              Lors de la seconde étape de notre étude (évaluation des risques), les capacités des
                              acteurs seront utilisées pour évaluer les motivations des acteurs.
                            </Trans>
                          </Typography>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.2.2">
                              Pour que l’étape 2 puisse se dérouler dans les meilleures conditions, il est donc
                              primordial que les scénarios d’intensité soient validés par l’ensemble des experts lors de
                              cette étape 1.
                            </Trans>
                          </Typography>
                        </Box>
                      ),
                      styles: { options: { width: 800 } },
                    },
                    {
                      disableBeacon: true,
                      target: "body",
                      placement: "center",
                      content: (
                        <Box sx={{ textAlign: "left" }}>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.3.1">
                              Nous vous invitons à consulter la préparation des analystes CIPRA et à donner votre
                              feedback.
                            </Trans>
                          </Typography>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.3.2">
                              Nous sommes conscients que les informations demandées peuvent être sensibles. Les
                              informations contenues dans ces fiches de risques sont considérées comme étant à{" "}
                              <b>diffusion restreinte</b>.
                            </Trans>
                          </Typography>
                          <Typography variant="body1" my={2}>
                            <Trans i18nKey="validation.capabilities.info.3.3">
                              Toutefois, si des informations sont trop sensibles que pour les introduire dans les fiches
                              de risques, nous vous invitons à utiliser des données agrégées (ex : au lieu de citer une
                              liste de pays précis en tant qu’acteur, vous avez la possibilité d’utiliser une
                              dénomination générique du type « acteurs étatiques hostiles »).
                            </Trans>
                          </Typography>
                        </Box>
                      ),
                      styles: { options: { width: 800 } },
                    },
                  ]}
                />
                2. <Trans i18nKey="riskFile.actorCapabilities.title">Actor Capabilities</Trans>
              </Typography>

              <Divider />

              <Box mt={1}>
                <Alert severity="warning" sx={{ mb: 4 }}>
                  <AlertTitle>
                    <Trans i18nKey="actorCapabilities.attention.title">Attention</Trans>
                  </AlertTitle>
                  <Typography variant="caption">
                    <Trans i18nKey="actorCapabilities.attention">
                      The information contained in the risk files is considered 'Limited Distribution'.
                    </Trans>
                  </Typography>
                </Alert>
                {/* <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.actorCapabilities.helpText1">
                    Outline of the actor groups according to three levels of capabilities - <i>considerable, major</i>{" "}
                    and <i>extreme</i>.
                  </Trans>
                </Typography>
                <Typography variant="caption" paragraph>
                  <Trans i18nKey="riskFile.actorCapabilities.helpText2">
                    The information contained in the risk files is considered 'Limited Distribution'.
                  </Trans>
                </Typography> */}
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.actorCapabilities.feedback">
                  Please provide any comments or feedback on the actor capabilities of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_scenarios_feedback}
                  onSave={handleSaveField("cr4de_scenarios_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_scenarios_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="scenarios"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="horizon-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.horizon.info.1.1">
                            Pour rappel, au sein de notre étude, un risque émergent est un risque qui, à l’heure
                            actuelle, ne constitue pas de menace en lui-même mais qui, s’il se développe dans le futur,
                            peut influencer les autres risques analysés dans la BNRA 2023-2026.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.horizon.info.1.2">
                            L'analyse de l'horizon étudie et tente de prédire à quelle vitesse le risque émergent peut
                            se manifester.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.horizon.info.1.3">
                            Cette section comprend donc une description qualitative (ou quantitative lorsque, cela est
                            possible) d’une ou plusieurs trajectoires d'évolution possibles du risque émergent y compris
                            les délais potentiels ou les événements déclencheurs.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.horizon.info.2.1">
                            Prenons un exemple concret : pour le risque émergent relatif au changement climatique,
                            l’analyse d’horizon comprendra par exemple une description quantitative de différents
                            scénarios basés sur les trajectoires d'émission de GES. Pour une nouvelle technologie, cette
                            section comprendra par exemple une description qualitative des courbes d'adoption de la
                            nouvelle technologie en question.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.horizon.info.2.2">
                            {
                              "Dans cette section, on tentera par exemple de décrire à partir de quand une nouvelle technologie ou un nouveau phénomène arrivera à maturité ou occupera une place plus importante dans la société : est-ce plutôt dans un avenir proche (p. ex. 5-10 ans) ou plutôt à long terme (>30-50 ans)?"
                            }
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.horizon.info.3.1">
                            Nous vous invitons à consulter la préparation des analystes CIPRA et à donner votre
                            feedback.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
              <Typography variant="h6" mb={1} color="primary">
                2. <Trans i18nKey="riskFile.horizonAnalysis.title">Horizon Analysis</Trans>
              </Typography>

              <Divider />

              {/* <Box mt={1}>
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
              </Box> */}

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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.horizonAnalysis.feedback">
                  Please provide any comments or feedback on the horizon analysis of the emerging risk below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_scenarios_feedback}
                  onSave={handleSaveField("cr4de_scenarios_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_scenarios_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="horizon_analysis"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="causes-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.1.1">
                            Deze en de volgende sectie van de risicofiche behandelen de identificatie van de risico
                            cascade of met andere woorden identificeren de oorzaken en gevolgen voor het bestudeerde
                            risico.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.1.2">
                            In deze sectie identificeren we specifiek andere risico's uit de catalogus die aan de
                            oorsprong van het bestudeerde risico's kunnen liggen, dit wil zeggen de oorzaken van het
                            bestudeerde risico.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.2.1">
                            Ter herinnering, in de 2de stap, de stap van de risicobeoordeling, zal u onder andere worden
                            gevraagd om de waarschijnlijkheid van elk intensiteitsscenario in te schatten. In onze
                            analyse bestaat deze inschatting uit twee verschillende elementen:
                          </Trans>
                        </Typography>
                        <ul>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.causes.info.2.2">
                                De directe waarschijnlijkheid (de waarschijnlijkheid van optreden van ons risico dat
                                niet kan worden toegeschreven aan het zich voordoen van een ander risico)
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.causes.info.2.3">
                                De voorwaardelijke/ conditionele of indirecte waarschijnlijkheid (de waarschijnlijkheid
                                dat ons risico optreedt net wel ten gevolge van het zich voordoen van een ander risico).
                              </Trans>
                            </Typography>
                          </li>
                        </ul>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.2.1">
                            Om de conditionele waarschijnlijkheden te kunnen berekenen, moeten van te voren de linken
                            tussen de risico's worden bepaald of moeten met andere woorden de cascades van elk te
                            beoordelen risico uit de BNRA23-26 volledig in kaart gebracht worden.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.2.2">
                            Gelet op het belang ervan in de volgende stap, is het essentieel dat de potentiële oorzaken
                            voor een specifiek risico in deze 1ste stap door alle deelnemende experten gevalideerd
                            worden.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.3.1">
                            <b>OPGELET!</b> In onze BNRA23-26 beschouwen wij een risico alleen als zijnde een oorzaak
                            als en slechts als het een DIRECTE oorzaak is van het onderzochte risico.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.3.2">
                            Laat ons een concreet voorbeeld uitwerken: één van de te beoordelen risico's uit de
                            BNRA23-26 is het risico “fluvial (riverine) flood” - overstroming door het buiten de oevers
                            treden van rivieren.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.3.3">
                            Wij beschouwen het scenario « riverbank erosion » echter niet als een DIRECTE oorzaak voor
                            het risico “fluvial (riverine) flood”. «Riverbank erosion» kan indirect wel overstromingen
                            veroorzaken door een dijk te destabiliseren en een dijkdoorbraak te veroorzaken. In onze
                            beoordeling wordt het risico « riverbank erosion » dus beschouwd als een DIRECTE oorzaak van
                            het risico « dike failure », dat op zijn beurt wel wordt beschouwd als een DIREKTE oorzaak
                            van het scenario “fluvial (riverine) flood”.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.4.1">
                            We nodigen u uit om de voorgestelde oorzaken voor uw risico, en indien beschikbaar, de
                            redenen waarom een link is vastgesteld tussen twee risico's te bestuderen en uw feedback te
                            formuleren ten aanzien van deze elementen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.causes.info.4.2">
                            Wenst u aanpassingen aan te brengen, met name, wenst u een toevoeging of schrapping van een
                            risico uit de lijst van te evalueren risico's van de BNRA 2023-2026 voor te stellen, geef
                            dit dan ook aan in het daartoe voorziene tekst vak in de onlinetool. Desgevallend is het wel
                            wenselijk om kort toe te lichten waarom een risico al dan niet als een DIRECTE oorzaak van
                            het bestudeerde risico moet worden beschouwd.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
              <Typography variant="h6" mb={1} color="primary">
                5. <Trans i18nKey="transferList.causes.title">Causing Hazards</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Alert severity="warning">
                  <AlertTitle>
                    <Trans i18nKey="transferList.attention.title">Attention!</Trans>
                  </AlertTitle>
                  <Typography variant="caption">
                    <Trans i18nKey="transferList.attention">
                      You are not able to directly move the the risks between the lists. Please describe your proposed
                      changes in the input field below
                    </Trans>
                  </Typography>
                </Alert>

                {/* <Typography variant="caption" paragraph>
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
                </Typography> */}
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.causes.feedback">
                  Please provide any comments or feedback on the intensity scenarios of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_causes_feedback}
                  onSave={handleSaveField("cr4de_causes_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_causes_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="causes"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="actions-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.actions.info.1.1">
                            Les actions malveillantes correspondent aux risques de la BNRA-2023-2026 qui peuvent être
                            provoqués par les groupes d’acteurs identifiés dans une fiche de type man made.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.actions.info.2.1">
                            Ter herinnering, in de 2de stap, de stap van de risicobeoordeling, zal u onder andere worden
                            gevraagd om de waarschijnlijkheid van elk intensiteitsscenario in te schatten. In onze
                            analyse bestaat deze inschatting uit twee verschillende elementen:
                          </Trans>
                        </Typography>
                        <ul>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.actions.info.2.2">
                                De directe waarschijnlijkheid (de waarschijnlijkheid van optreden van ons risico dat
                                niet kan worden toegeschreven aan het zich voordoen van een ander risico)
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.actions.info.2.3">
                                De voorwaardelijke/ conditionele of indirecte waarschijnlijkheid (de waarschijnlijkheid
                                dat ons risico optreedt net wel ten gevolge van het zich voordoen van een ander risico).
                              </Trans>
                            </Typography>
                          </li>
                        </ul>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.actions.info.2.4">
                            Om de conditionele waarschijnlijkheden te kunnen berekenen, moeten van te voren de linken
                            tussen de risico's worden bepaald of moeten met andere woorden de cascades van elk te
                            beoordelen risico uit de BNRA23-26 volledig in kaart gebracht worden.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.actions.info.3.1">
                            Nous vous invitons à consulter la proposition des analystes CIPRA et à donner votre
                            feedback.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.actions.info.3.2">
                            Si, selon vous, il serait pertinent d’ajouter ou de supprimer une action malveillante à la
                            liste proposée, signalez-le également via l’outil en ligne, en expliquant brièvement
                            pourquoi cette action malveillante doit ou non être considérée comme dans le cadre de votre
                            fiche de risques.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
              <Typography variant="h6" mb={1} color="primary">
                3. <Trans i18nKey="riskFile.maliciousActions.title">Malicious Actions</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Alert severity="warning">
                  <AlertTitle>
                    <Trans i18nKey="transferList.attention.title">Attention!</Trans>
                  </AlertTitle>
                  <Typography variant="caption">
                    <Trans i18nKey="transferList.attention">
                      You are not able to directly move the the risks between the lists. Please describe your proposed
                      changes in the input field below
                    </Trans>
                  </Typography>
                </Alert>
                {/* <Typography variant="caption" paragraph>
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
                </Typography> */}
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.maliciousActions.feedback">
                  Please provide any comments or feedback on the list of potential actions of these actors below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_effects_feedback}
                  onSave={handleSaveField("cr4de_effects_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_effects_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="effects"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="effects-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.1.1">
                            Deze en de vorige sectie van de risicofiche behandelen de identificatie van de risico
                            cascade of met andere woorden identificeren de oorzaken en gevolgen voor het bestudeerde
                            risico.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.1.2">
                            In deze sectie identificeren we specifiek andere risico's uit de catalogus die een mogelijk
                            gevolg van het bestudeerde risico's kunnen zijn.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.2.1">
                            Ter herinnering, in de 2de stap, de stap van de risicobeoordeling, zal u onder andere worden
                            gevraagd om de waarschijnlijkheid van elk intensiteitsscenario in te schatten. In onze
                            analyse bestaat deze inschatting uit twee verschillende elementen:
                          </Trans>
                        </Typography>
                        <ul>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.effects.info.2.2">
                                De directe waarschijnlijkheid (de waarschijnlijkheid van optreden van ons risico dat
                                niet kan worden toegeschreven aan het zich voordoen van een ander risico)
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" my={2}>
                              <Trans i18nKey="validation.effects.info.2.3">
                                De voorwaardelijke/ conditionele of indirecte waarschijnlijkheid (de waarschijnlijkheid
                                dat ons risico optreedt net wel ten gevolge van het zich voordoen van een ander risico).
                              </Trans>
                            </Typography>
                          </li>
                        </ul>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.2.4">
                            Om de conditionele waarschijnlijkheden te kunnen berekenen, moeten van te voren de linken
                            tussen de risico's worden bepaald of moeten met andere woorden de cascades van elk te
                            beoordelen risico uit de BNRA23-26 volledig in kaart gebracht worden.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.2.5">
                            Gelet op het belang ervan in de volgende stap, is het essentieel dat de potentiële gevolgen
                            voor een specifiek risico in deze 1ste stap door alle deelnemende experten gevalideerd
                            worden.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.3.1">
                            <b>OPGELET!</b> In onze BNRA23-26 beschouwen wij een risico alleen als zijnde een gevolg als
                            en slechts als het een DIRECTE gevolg is van het onderzochte risico.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.3.2">
                            Laat ons een concreet voorbeeld uitwerken: één van de te beoordelen risico's uit de
                            BNRA23-26 is het risico “attack against a CBRN-e infrastructure” - een aanval tegen een
                            infrastructuur waar risicolijke stoffen verwerkt worden.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.3.3">
                            Wij beschouwen het scenario « release of chemical agents » echter niet als een DIRECTE
                            gevolg voor het risico “attack against a CBRN-e infrastructure”. « release of chemical
                            agents » kan wel indirect volgen uit het risico « incident in a CBRN-e infrastructure », dat
                            op zijn beurt wel wordt beschouwd als een DIRECT gevolg van het risico “attack against a
                            CBRN-e infrastructure”.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.4.1">
                            We nodigen u uit om de voorgestelde gevolgen voor uw risico, en indien beschikbaar, de
                            redenen waarom een link is vastgesteld tussen twee risico's te bestuderen en uw feedback te
                            formuleren ten aanzien van deze elementen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.4.2">
                            Wenst u aanpassingen aan te brengen, met name, wenst u een toevoeging of schrapping van een
                            risico uit de lijst van te evalueren risico's van de BNRA 2023-2026 voor te stellen, geef
                            dit dan ook aan in het daartoe voorziene tekst vak in de onlinetool. Desgevallend is het wel
                            wenselijk om kort toe te lichten waarom een risico al dan niet als een DIRECT gevolg van het
                            bestudeerde risico moet worden beschouwd.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
              <Typography variant="h6" mb={1} color="primary">
                6. <Trans i18nKey="riskFile.effects.title">Effect Hazards</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Alert severity="warning">
                  <AlertTitle>
                    <Trans i18nKey="transferList.attention.title">Attention!</Trans>
                  </AlertTitle>
                  <Typography variant="caption">
                    <Trans i18nKey="transferList.attention">
                      You are not able to directly move the the risks between the lists. Please describe your proposed
                      changes in the input field below
                    </Trans>
                  </Typography>
                </Alert>
                {/* <Typography variant="caption" paragraph>
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
                </Typography> */}
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.effects.feedback">
                  Please provide any comments or feedback on the intensity scenarios of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_effects_feedback}
                  onSave={handleSaveField("cr4de_effects_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_effects_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="catalysing_effects"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="catalysing-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysedEffects.info.1.1">
                            Een opkomend risico oefent een katalyserend effect uit op een ander gevaar, indien het in de
                            toekomst, een effect kan hebben op de gevolgen of de waarschijnlijkheid van het optreden van
                            het gevaar in kwestie.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysedEffects.info.1.2">
                            Les analystes CIPRA ont, au sein de chaque fiche de risque, réalisé une première
                            identification des des dangers qui peuvent être catalysées par le risque qui vous a été
                            attribué.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysedEffects.info.2.1">
                            Nous vous invitons à consulter la proposition réalisée par les analystes CIPRA et à donner
                            votre feedback sur ces différents éléments.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysedEffects.info.2.2">
                            En cas de modification, veuillez expliquer brièvement pourquoi un risque émergent doit ou
                            non être considéré comme ayant un effet catalyseur sur un autre danger.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
              <Typography variant="h6" mb={1} color="primary">
                3. <Trans i18nKey="riskFile.catalysedEffects.title">Catalysing Effects</Trans>
              </Typography>
              <Divider />

              <Box mt={1}>
                <Alert severity="warning">
                  <AlertTitle>
                    <Trans i18nKey="transferList.attention.title">Attention!</Trans>
                  </AlertTitle>
                  <Typography variant="caption">
                    <Trans i18nKey="transferList.attention">
                      You are not able to directly move the the risks between the lists. Please describe your proposed
                      changes in the input field below
                    </Trans>
                  </Typography>
                </Alert>
                {/* <Typography variant="caption" paragraph>
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
                </Typography> */}
              </Box>

              {effects !== null && otherHazards !== null && (
                <TransferList
                  choices={catalysedEffectsChoices}
                  chosen={catalysedEffectsChosen}
                  choicesLabel={t("riskFile.catalysedEffects.choices")}
                  chosenLabel={t("riskFile.catalysedEffects.chosen")}
                  chosenSubheader={t("riskFile.catalysedEffects.subheader", { count: effects.length })}
                />
              )}

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.catalysedEffects.feedback">
                  Please provide any comments or feedback on the intensity scenarios of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_effects_feedback}
                  onSave={handleSaveField("cr4de_effects_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_effects_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="effects"
                riskFile={riskFile}
                validation={validation}
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
              <HelpButton
                id="catalysing-help-button"
                steps={[
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysing.info.1.1">
                            Deze sectie van de risicofiche identificeert uit opkomende risico’s die de impacten en of de
                            waarschijnlijkheden van het bestudeerde risico beïnvloed of "katalyseert".
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },

                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysing.info.2.1">
                            In onze studie wordt een opkomend risico gedefinieerd als elk proces dat nieuwe combinaties
                            van risico's kan creëren of bestaande risico's kan wijzigen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysing.info.2.2">
                            Dit zijn risico's die momenteel op zichzelf geen risico vormen, maar die, als zij zich
                            ontwikkelen, van invloed kunnen zijn op de andere risico's die geanalyseerd worden binnen de
                            BNRA 2023-2026.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysing.info.3.1">
                            Laat ons een concreet voorbeeld beschouwen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysing.info.3.2">
                            «Quantum computing» is momenteel geen technologie die op grote schaal in onze samenleving
                            wordt gebruikt. De opkomst/uitrol ervan in de toekomst zou echter de waarschijnlijkheid van
                            optreden van het risico «Cyber attack against a government institution» kunnen vergroten.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.catalysing.info.3.3">
                            Een opkomend risico oefent een katalyserend effect uit op het bestudeerde risico indien het,
                            in de toekomst, een effect kan hebben op de “gevolgen / impacten” of de “waarschijnlijkheid
                            van optreden” van het bestudeerde risico.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                  {
                    disableBeacon: true,
                    target: "body",
                    placement: "center",
                    content: (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.4.1">
                            We nodigen u uit om de voorgestelde geïdentificeerde opkomende risico’s en indien
                            beschikbaar, de redenen waarom dit opkomende risico een katalyserend effect heeft op het
                            bestudeerde risico, te bestuderen en uw feedback te formuleren ten aanzien van deze
                            elementen.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" my={2}>
                          <Trans i18nKey="validation.effects.info.4.2">
                            Wenst u aanpassingen aan te brengen, met name, wenst u een opkomend risico uit de selectie
                            te schrappen of een opkomend risico uit de lijst van beschikbare opkomende risico’s van de
                            BNRA 2023-2026 toe te voegen, geef dit dan ook aan in het daartoe voorziene tekst vak in de
                            onlinetool. Desgevallend is het wel wenselijk om kort toe te lichten waarom een opkomend
                            risico al dan niet een katalyserend effect uitoefent op het bestudeerde risico.
                          </Trans>
                        </Typography>
                      </Box>
                    ),
                    styles: { options: { width: 800 } },
                  },
                ]}
              />
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
                <Alert severity="warning">
                  <AlertTitle>
                    <Trans i18nKey="transferList.attention.title">Attention!</Trans>
                  </AlertTitle>
                  <Typography variant="caption">
                    <Trans i18nKey="transferList.attention">
                      You are not able to directly move the the risks between the lists. Please describe your proposed
                      changes in the input field below
                    </Trans>
                  </Typography>
                </Alert>
                {/* <Typography variant="caption" paragraph>
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
                </Typography> */}
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

              <Typography variant="subtitle2" mt={8} mb={2} color="primary">
                <Trans i18nKey="riskFile.catalysingEffects.feedback">
                  Please provide any comments or feedback on the catalysing effects of the hazard below:
                </Trans>
              </Typography>

              {validation ? (
                <TextInputBox
                  initialValue={validation.cr4de_catalysing_effects_feedback}
                  onSave={handleSaveField("cr4de_catalysing_effects_feedback")}
                  setUpdatedValue={handleSetFieldUpdate("cr4de_catalysing_effects_feedback")}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height="300px" />
              )}

              <Attachments
                attachments={attachments}
                field="catalysing"
                riskFile={riskFile}
                validation={validation}
                isExternal={true}
                onUpdate={() =>
                  getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}` })
                }
              />
            </Box>
          </Paper>
        )}
      </Container>

      <ValidationTutorial />

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
        {/* <Button color="error" sx={{ mr: 1 }} component={RouterLink} to="/validation">
          <Trans i18nKey="button.exit">Exit</Trans>
        </Button> */}
        <Box sx={{ flex: "1 1 auto" }} />
        {isSaving ? (
          <LoadingButton color="secondary" sx={{ mr: 1 }} loading loadingPosition="start" startIcon={<SaveIcon />}>
            <Trans i18nKey="button.saving">Saving</Trans>
          </LoadingButton>
        ) : (
          <Button id="save-button" color="primary" sx={{ mr: 1 }} onClick={handleSave}>
            <Trans i18nKey="button.save">Save</Trans>
          </Button>
        )}

        <Button
          id="save-and-exit-button"
          color="primary"
          onClick={() => {
            handleSave();
            setFinishedDialogOpen(true);
          }}
        >
          <Trans i18nKey="button.saveAndExit">Save & Exit</Trans>
        </Button>
      </Box>

      <Dialog open={finishedDialogOpen} onClose={() => setFinishedDialogOpen(false)}>
        <DialogTitle>
          <Trans i18nKey="validation.dialog.title">Are you finished validating this risk file?</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans i18nKey="validation.dialog.helpText">
              Even if you indicate that you are finished, you can still return at a later time to make changes until the
              end of the validation phase.
            </Trans>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinishedDialogOpen(false)}>
            <Trans i18nKey="validation.dialog.cancel">No, I am not finished</Trans>
          </Button>
          <Button
            onClick={async () => {
              if (!validation || !riskFile) return;

              setFinishedDialogOpen(false);
              setSurveyDialogOpen(true);

              const participants = await api.getParticipants(
                `$filter=_cr4de_contact_value eq ${user.contactid} and _cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}`
              );

              if (participants.length >= 0) {
                api.updateParticipant(participants[0].cr4de_bnraparticipationid, {
                  cr4de_validation_finished: true,
                });

                api.finishValidation(riskFile?.cr4de_riskfilesid, user.contactid, "VALIDATION");
              }
            }}
          >
            <Trans i18nKey="validation.dialog.finish">Yes, I am finished</Trans>
          </Button>
        </DialogActions>
      </Dialog>

      <SurveyDialog
        open={surveyDialogOpen}
        riskFile={riskFile}
        onClose={() => {
          setSurveyDialogOpen(false);
          navigate("/overview");
        }}
      />
    </>
  );
}
