import { useEffect, useState } from "react";
import { Box, Tooltip, Link, Paper, Container, Alert, Typography, Stack, Button } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { unwrap as unwrapParameters } from "../../../functions/intensityParameters";
import { Trans, useTranslation } from "react-i18next";
import QualiTextInputBox from "../../step2A/sections/QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DP50Slider } from "../information/DP50Slider";
import { FullScenario } from "../information/Scenarios";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import useLazyRecords from "../../../hooks/useLazyRecords";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import AttachmentsDialog from "../information/AttachmentsDialog";
import { Link as RouterLink } from "react-router-dom";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import InformationButton from "../information/InformationButton";
import CCTutorial from "../information/CCTutorial";

const TRANSITION_S = "1s";

export type CCInput = {
  cr4de_dp50_quanti_c: string | null;
  cr4de_dp50_quanti_m: string | null;
  cr4de_dp50_quanti_e: string | null;
  cr4de_dp50_quali: string | null;
};

export default function ClimateChangeAnalysis({
  directAnalysis,
  cascadeAnalysis,
  cascade,

  quantiErrors,
  qualiError,

  onShowCauses,
  reloadDirectAnalysis,
  reloadCascadeAnalysis,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalysis: DVCascadeAnalysis | null;
  cascade: DVRiskCascade<DVRiskFile>;

  quantiErrors: boolean[] | null;
  qualiError: boolean;

  onShowCauses: () => void;
  reloadDirectAnalysis: () => Promise<void>;
  reloadCascadeAnalysis: () => Promise<void>;
}) {
  const api = useAPI();
  const { t } = useTranslation();

  const [runTutorial, setRunTutorial] = useState(false);
  const [sourceDialogOpen, setSourceDialogOpen] = useState<string | null>(null);
  const [existingSource, setExistingSource] = useState<DVAttachment | undefined>(undefined);

  const { data: attachments, getData: loadAttachments } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
  });

  useEffect(() => {
    if (cascadeAnalysis && attachments === null) {
      loadAttachments({
        query: `$filter=_cr4de_cascadeanalysis_value eq '${cascadeAnalysis.cr4de_bnracascadeanalysisid}'&$expand=cr4de_referencedSource`,
        saveOptions: true,
      });
    }
  }, [cascadeAnalysis]);

  useEffect(() => {
    if (!quantiErrors) return;

    if (quantiErrors[0]) {
      document.getElementById("considerable-scenario")?.scrollIntoView({ behavior: "smooth" });
    } else if (quantiErrors[1]) {
      document.getElementById("major-scenario")?.scrollIntoView({ behavior: "smooth" });
    } else if (quantiErrors[2]) {
      document.getElementById("extreme-scenario")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [quantiErrors]);

  useEffect(() => {
    if (qualiError && !quantiErrors) {
      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("quali-input")?.getBoundingClientRect().top || 0),
      });
    }
  }, [qualiError]);

  const effectScenarios = unwrapScenarios(
    unwrapParameters(directAnalysis.cr4de_risk_file.cr4de_intensity_parameters),
    directAnalysis.cr4de_risk_file.cr4de_scenario_considerable,
    directAnalysis.cr4de_risk_file.cr4de_scenario_major,
    directAnalysis.cr4de_risk_file.cr4de_scenario_extreme
  );

  const handleSave = (field: keyof DVDirectAnalysis) => async (value: any) => {
    if (!directAnalysis) return;

    await api.updateDirectAnalysis(directAnalysis.cr4de_bnradirectanalysisid, {
      [field]: value,
    });

    reloadDirectAnalysis();
  };

  const handleOpenSourceDialog = (existingSource?: DVAttachment) => {
    setSourceDialogOpen("cr4de_quali_cascade");
    setExistingSource(existingSource);
  };

  return (
    <Box>
      <Container>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" id="cc-title">
            <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
              <Link
                to={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
                component={RouterLink}
                target="_blank"
              >
                <Trans i18nKey="2B.climateChange.title">Climate Change</Trans>
              </Link>
            </Tooltip>
          </Typography>
        </Box>
      </Container>
      <Box sx={{ mx: "123px", pb: 12 }}>
        <Container>
          <Stack direction="column">
            <Typography variant="body2" paragraph sx={{ mt: 2 }}>
              <Trans i18nKey="2B.climateChange.intro.1">
                Cette page vous permet d'évaluer l'effet catalyseur du changement climatique sur les 3 scenarios
                d'intensité du risque standard étudié. Cette évaluation vous sera uniquement demandée si le risqué
                standard étudié a été identifié lors de l'étape 1 comme étant directement influencé par le changement
                climatique.
              </Trans>
            </Typography>
            <Box sx={{ textAlign: "center", mt: 1, mb: 4 }}>
              <Button variant="contained" onClick={() => setRunTutorial(true)}>
                <Trans i18nKey="2B.introduction.button.tutorial.part">Show Tutorial for this page</Trans>
              </Button>
            </Box>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.climateChange.intro.2">
                Pour ce faire, nous vous demandons de réévaluer la probabilité d'occurrence directe de chacun de ces
                scénarios pour la période 2050-2053 , en supposant que le climat évolue selon l'analyse d'horizon
                validée par les experts de ce risque émergent (celle-ci considère la trajectoire socio-économique
                partagée la plus extrême du Sixième rapport d'évaluation du GIEC, la trajectoire SSP5-8.5, qui suppose
                une économie à forte intensité énergétique et basée sur les combustibles fossiles, ou la trajectoire
                représentative de concentration RCP 8.5 du cinquième rapport d'évaluation du GIEC paru en 2014).
              </Trans>
            </Typography>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.climateChange.intro.3">
                Pour rappel, on entend par probabilité directe la probabilité que le scénario se produise sans être le
                résultat d'un autre risque de la BNRA.
              </Trans>
            </Typography>
            <Typography variant="body2" paragraph sx={{ mb: 2 }}>
              <Trans i18nKey="2B.climateChange.intro.4">
                Veuillez sélectionner ci-dessous pour chaque scénario d'intensité du risque standard étudié une
                estimation quantitative de la probabilité directe pour la période 2050-2053 en tenant compte de l'effet
                du changement climatique. La probabilité directe que vous avez choisie pour chaque scénario d'intensité
                du risque standard étudié pour la période 2023-2026 lors de l'étape 2A est indiquée par un triangle
                hachuré.
              </Trans>
            </Typography>
            <Alert severity="warning" sx={{ mt: 2, mb: 0 }}>
              <Stack direction="column" spacing={1}>
                <Typography variant="body2">
                  <Trans i18nKey="2B.climateChange.warning.1">
                    Dans cette étape, il convient de réévaluer uniquement la probabilité <b>directe</b>. Par conséquent,
                    les causes potentielles de ce risque ne doivent pas être prises en compte.
                  </Trans>
                </Typography>
                <Typography variant="body2">
                  <Trans i18nKey="2B.climateChange.warning.2">
                    Par exemple, lors de la réévaluation de la probabilité directe d'une Dam failure, la possibilité
                    d'une défaillance d'un barrage due à un tremblement de terre doit être exclue. Dans ce cas-ci, vous
                    devez prendre en compte tous les éléments qui pourraient provoquer une rupture de barrage et qui
                    n'ont pas été inclus comme causes possibles du risque étudié (ex: une défaillance technique).
                  </Trans>
                </Typography>
                <Typography variant="body2">
                  <Trans i18nKey="2B.climateChange.warning.3">
                    En cliquant sur le bouton MONTRER LES CAUSES POTENTIELLES, vous pouvez afficher les risques du
                    catalogue BNRA qui ont été identifiés à l'étape 1 comme étant des causes du risque évalué. Ceux-ci{" "}
                    <b>ne doivent pas</b> être pris en compte dans l'estimation de la probabilité directe.
                  </Trans>
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <Button color="warning" variant="contained" onClick={onShowCauses}>
                    <Trans i18nKey="2B.climateChange.button.causes">Show potential causes</Trans>
                  </Button>
                </Box>
              </Stack>
            </Alert>
            <Alert severity="info" sx={{ mt: 2, mb: 6 }}>
              <Typography variant="body2">
                <Trans i18nKey="2B.climateChange.info.1">
                  Attention, il est nécessaire de réévaluer toutes les probabilités directes et de remplir tous les
                  champs concernant les effets catalyseurs du changement climatique pour clôturer cette étape 2B. Bien
                  qu'il soit important pour nous de disposer d'une justification quant à la valeur quantitative que vous
                  avez choisie, si vous ne souhaitez pas nous fournir de justification textuelle, nous vous invitons à
                  cliquer sur le bouton PAS DE COMMENTAIRE.
                </Trans>
              </Typography>
            </Alert>
            <Box sx={{ mb: 4 }} id="considerable-scenario">
              <FullScenario
                riskType={directAnalysis.cr4de_risk_file.cr4de_risk_type}
                title={directAnalysis.cr4de_risk_file.cr4de_title}
                scenario={SCENARIOS.CONSIDERABLE}
                parameters={effectScenarios.considerable}
                visible
              />
              <Box component={Paper} sx={{ mt: 2, py: 2, px: 3, mb: 4 }} id="step2A-dp-quantitative-box">
                <Typography variant="subtitle2">
                  <Trans i18nKey="2B.dp50.quanti.title">DP50 - Direct Probability in 50 years</Trans>
                </Typography>

                <DP50Slider
                  id="considerable"
                  DPValue={directAnalysis.cr4de_dp_quanti_c || "DP1"}
                  initialDP50Value={directAnalysis.cr4de_dp50_quanti_c}
                  error={quantiErrors && quantiErrors[0]}
                  onSave={handleSave("cr4de_dp50_quanti_c")}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 4 }} id="major-scenario">
              <FullScenario
                riskType={directAnalysis.cr4de_risk_file.cr4de_risk_type}
                title={directAnalysis.cr4de_risk_file.cr4de_title}
                scenario={SCENARIOS.MAJOR}
                parameters={effectScenarios.major}
                visible
              />

              <Box component={Paper} sx={{ mt: 2, py: 2, px: 3, mb: 4 }} id="step2A-dp-quantitative-box">
                <Typography variant="subtitle2">
                  <Trans i18nKey="2B.dp50.quanti.title">DP50 - Direct Probability in 50 years</Trans>
                </Typography>

                <DP50Slider
                  id="major"
                  DPValue={directAnalysis.cr4de_dp_quanti_m || "DP1"}
                  initialDP50Value={directAnalysis.cr4de_dp50_quanti_m}
                  error={quantiErrors && quantiErrors[1]}
                  onSave={handleSave("cr4de_dp50_quanti_m")}
                />
              </Box>
            </Box>
            <Box sx={{}} id="extreme-scenario">
              <FullScenario
                riskType={directAnalysis.cr4de_risk_file.cr4de_risk_type}
                title={directAnalysis.cr4de_risk_file.cr4de_title}
                scenario={SCENARIOS.EXTREME}
                parameters={effectScenarios.extreme}
                visible
              />

              <Box component={Paper} sx={{ mt: 2, py: 2, px: 3, mb: 4 }} id="step2A-dp-quantitative-box">
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  <Trans i18nKey="2B.dp50.quanti.title">DP50 - Direct Probability in 50 years</Trans>
                </Typography>

                <DP50Slider
                  id="extreme"
                  DPValue={directAnalysis.cr4de_dp_quanti_e || "DP1"}
                  initialDP50Value={directAnalysis.cr4de_dp50_quanti_e}
                  error={quantiErrors && quantiErrors[2]}
                  onSave={handleSave("cr4de_dp50_quanti_e")}
                />
              </Box>
            </Box>

            <Stack direction="column" sx={{ marginTop: 10 }}>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="2B.climateChange.quali.1">
                  Veuillez utiliser le champ ci-dessous pour développer votre raisonnement concernant l'estimation
                  quantitative donnée dans la section précédente. Vous pouvez par exemple justifier ces valeurs en
                  citant des faits historiques ou les résultats d'études. Si possible, ajoutez des références
                  bibliographiques pour étayer vos arguments.
                </Trans>
              </Typography>
            </Stack>

            <Box sx={{ marginTop: 2, marginBottom: 3 }}>
              <QualiTextInputBox
                id="quali-input"
                initialValue={directAnalysis.cr4de_dp50_quali}
                onSave={handleSave("cr4de_dp50_quali")}
                debounceInterval={500}
                attachments={attachments}
                error={qualiError}
                onOpenSourceDialog={handleOpenSourceDialog}
                onReloadAttachments={loadAttachments}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {directAnalysis && cascadeAnalysis && (
        <AttachmentsDialog
          field={sourceDialogOpen ?? ""}
          riskFile={directAnalysis.cr4de_risk_file}
          cascadeAnalysis={cascadeAnalysis}
          open={sourceDialogOpen !== null}
          existingSource={existingSource}
          onClose={() => setSourceDialogOpen(null)}
          onSaved={() => loadAttachments()}
        />
      )}

      <InformationButton
        showTutorial={true}
        riskFile={directAnalysis.cr4de_risk_file}
        onRunTutorial={() => setRunTutorial(true)}
      />

      <CCTutorial run={runTutorial} setRun={setRunTutorial} />
    </Box>
  );
}
