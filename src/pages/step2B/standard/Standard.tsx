import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { SCENARIOS, Scenarios } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Introduction from "./Introduction";
import { useEffect, useState, MutableRefObject } from "react";
import { stepNames, STEPS } from "../Steps";
import ScenarioAnalysis from "./ScenarioAnalysis";
import CascadeAnalysis from "./CascadeAnalysis";
import { useSearchParams } from "react-router-dom";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { useUnmountEffect } from "framer-motion";
import { CascadeAnalysisInput } from "../../../functions/cascades";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import useRecords from "../../../hooks/useRecords";
import { DataTable } from "../../../hooks/useAPI";
import useLazyRecords from "../../../hooks/useLazyRecords";
import AttachmentsDialog from "../information/AttachmentsDialog";
import ClimateChangeAnalysis from "./ClimateChangeAnalysis";
import CatalysingEffectsAnalysis from "./CatalysingEffectsnalysis";
import CascadeTutorial from "../information/CascadeTutorial";

export default function Standard({
  activeStep,
  causes,
  catalysingEffects,
  climateChange,
  cascade,
  cascadeIndex,
  step2A,
  step2B,
  step2AInput,
  step2BInput,
  activeCauseScenario,
  activeEffectScenario,
  qualiError,
  runTutorial,
  setRunTutorial,
  setStep2BInput,
  onNext,
  onPrevious,
  onChangeScenario,
  onUnmount,
}: {
  activeStep: STEPS | null;
  causes: DVRiskCascade[] | null;
  catalysingEffects: DVRiskCascade[] | null;
  climateChange: DVRiskCascade<DVRiskFile, DVRiskFile> | null;
  cascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null;
  cascadeIndex: number;
  step2A: DVDirectAnalysis<DVRiskFile>;
  step2B: DVCascadeAnalysis | null;
  step2AInput: MutableRefObject<string | null>;
  step2BInput: CascadeAnalysisInput | null;
  activeCauseScenario: SCENARIOS;
  activeEffectScenario: SCENARIOS;
  qualiError: boolean;
  runTutorial: boolean;
  setRunTutorial: (run: boolean) => void;
  setStep2BInput: (input: CascadeAnalysisInput, update?: boolean) => void;
  onNext: () => Promise<void>;
  onPrevious: () => Promise<void>;
  onChangeScenario: (causeScenario: SCENARIOS | null, effectScenario: SCENARIOS | null) => void;
  onUnmount: () => void;
}) {
  const [sourceDialogOpen, setSourceDialogOpen] = useState<string | null>(null);
  const [existingSource, setExistingSource] = useState<DVAttachment | undefined>(undefined);

  const {
    data: attachments,
    hasRun: attachmentsFetched,
    getData: loadAttachments,
  } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
  });

  const handleOpenSourceDialog = (field: string) => (existingSource?: DVAttachment) => {
    setSourceDialogOpen(field);
    setExistingSource(existingSource);
  };

  useEffect(() => {
    if (step2B && !attachmentsFetched) {
      loadAttachments({
        query: `$filter=_cr4de_cascadeanalysis_value eq '${step2B.cr4de_bnracascadeanalysisid}'&$expand=cr4de_referencedSource`,
        saveOptions: true,
      });
    }
  }, [step2B]);

  return (
    <>
      {activeStep === STEPS.INTRODUCTION && <Introduction onRunTutorial={() => setRunTutorial(true)} />}
      {activeStep === STEPS.CAUSES && step2A.cr4de_risk_file && causes && cascade && step2B && step2BInput && (
        <Box>
          <Container>
            <Stack direction="column" sx={{ mb: 2, ml: 0 }}>
              <Typography variant="h4">
                <Trans i18nKey="2B.causes.title">Cause</Trans>
              </Typography>
              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                <Trans i18nKey="2B.causes.intro.1">
                  Cette page vous permet d'évaluer, pour chaque relation de cause à effet identifiée dans l'étape 1 de
                  la BNRA, les probabilités conditionnelles entre les différents scénarios d'intensité des risques
                  causaux et des risques conséquents.
                </Trans>
              </Typography>
              <Box sx={{ textAlign: "center", mt: 1, mb: 4 }}>
                <Button variant="contained" onClick={() => setRunTutorial(true)}>
                  <Trans i18nKey="2B.introduction.button.tutorial.part">Show Tutorial for this page</Trans>
                </Button>
              </Box>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="2B.causes.intro.2">
                  Notez que chaque relation de cause à effet avec 3 scénarios d'intensité (considérable, majeure,
                  extrême) nécessite 9 estimations de la probabilité conditionnelle.
                </Trans>
              </Typography>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="2B.causes.intro.3">
                  Veuillez sélectionner ci-dessous une estimation quantitative de la probabilité conditionnelle que le
                  scénario d'intensité actuellement étudié se produise au cours de la période 2023-2026, en conséquence
                  d’un autre risque de la BNRA.
                </Trans>
              </Typography>
              <Alert severity="info" sx={{ mt: 2, mb: 0 }}>
                <Typography variant="body2">
                  <Trans i18nKey="2B.causes.info.1">
                    Attention, il est nécessaire d'évaluer toutes les probabilités conditionnelles et de remplir tous
                    les champs concernant chaque relation de cause à effet avant de pouvoir passer à l’étape suivante.
                  </Trans>
                </Typography>
                <Typography variant="body2">
                  <Trans i18nKey="2B.causes.info.2">
                    Bien qu’il soit important pour nous de disposer d’une justification quant à la valeur quantitative
                    que vous avez choisie, si vous ne souhaitez pas nous fournir de justification textuelle, nous vous
                    invitons à cliquer sur le bouton PAS DE COMMENTAIRES.
                  </Trans>
                </Typography>
              </Alert>
              <Alert severity="warning" sx={{ mt: 2, mb: 0 }}>
                <Typography variant="body2">
                  <Trans i18nKey="2B.causes.warning.1">
                    Dans cette étape, il convient d'estimer uniquement la probabilité conditionnelle.
                  </Trans>
                </Typography>
                <Typography variant="body2">
                  <Trans i18nKey="2B.causes.warning.2">
                    Par exemple, lors de l'estimation de la probabilité conditionnelle d'une Dam failure suite à un
                    tremblement de terre, il faut uniquement prendre en compte la possibilité d'une défaillance d'un
                    barrage due à un tremblement de terre. Tous les autres éléments qui pourraient provoquer une rupture
                    de barrage doivent être exclus.
                  </Trans>
                </Typography>
              </Alert>
            </Stack>
          </Container>
          <CascadeAnalysis
            riskFile={step2A.cr4de_risk_file}
            causes={causes}
            cascade={cascade}
            cascadeIndex={cascadeIndex}
            step2B={step2B}
            activeCauseScenario={activeCauseScenario}
            activeEffectScenario={activeEffectScenario}
            step2BInput={step2BInput}
            setStep2BInput={setStep2BInput}
            qualiError={qualiError}
            onNext={onNext}
            onPrevious={onPrevious}
            onChangeScenario={onChangeScenario}
            onUnmount={onUnmount}
            attachments={attachments}
            onOpenSourceDialog={handleOpenSourceDialog("cr4de_quali_cascade")}
            onReloadAttachments={loadAttachments}
          />
        </Box>
      )}
      {activeStep === STEPS.CLIMATE_CHANGE && step2A.cr4de_risk_file && climateChange && (
        <Box>
          <Container>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4">
                <Trans i18nKey="2B.climateChange.title">Climate Change</Trans>
              </Typography>
            </Box>
          </Container>
          <ClimateChangeAnalysis
            riskFile={step2A.cr4de_risk_file}
            step2A={step2A}
            step2AInput={step2AInput}
            qualiError={qualiError}
            attachments={attachments}
            onOpenSourceDialog={handleOpenSourceDialog("cr4de_quali_cascade")}
            onReloadAttachments={loadAttachments}
          />
        </Box>
      )}
      {activeStep === STEPS.CATALYSING_EFFECTS &&
        step2A.cr4de_risk_file &&
        catalysingEffects &&
        cascade &&
        step2B &&
        step2BInput && (
          <Box>
            <Container>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4">
                  <Trans i18nKey="2B.catalysingEffects.title">Catalysing Effects</Trans>
                </Typography>
              </Box>
            </Container>
            <CatalysingEffectsAnalysis
              riskFile={step2A.cr4de_risk_file}
              causes={catalysingEffects}
              cascade={cascade}
              cascadeIndex={cascadeIndex}
              step2B={step2B}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              step2BInput={step2BInput}
              setStep2BInput={setStep2BInput}
              qualiError={qualiError}
              onNext={onNext}
              onPrevious={onPrevious}
              onChangeScenario={onChangeScenario}
              onUnmount={onUnmount}
              attachments={attachments}
              onOpenSourceDialog={handleOpenSourceDialog("cr4de_quali_cascade")}
              onReloadAttachments={loadAttachments}
            />
          </Box>
        )}
      {step2A && step2B && (
        <AttachmentsDialog
          field={sourceDialogOpen ?? ""}
          riskFile={step2A.cr4de_risk_file}
          cascadeAnalysis={step2B}
          open={sourceDialogOpen !== null}
          existingSource={existingSource}
          onClose={() => setSourceDialogOpen(null)}
          onSaved={() => loadAttachments()}
        />
      )}

      {activeStep === STEPS.CAUSES && <CascadeTutorial run={runTutorial} setRun={setRunTutorial} />}
    </>
  );
}
