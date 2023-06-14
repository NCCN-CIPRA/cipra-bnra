import { useEffect, MutableRefObject } from "react";
import { Box, Tooltip, Paper, Container, Alert, Typography, Stack, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { useTheme } from "@mui/material/styles";
import { SCENARIOS, SCENARIO_PARAMS, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { IntensityParameter, unwrap as unwrapParameters } from "../../../functions/intensityParameters";
import { Trans, useTranslation } from "react-i18next";
import useAPI from "../../../hooks/useAPI";
import QualiTextInputBox from "../../step2A/sections/QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DP50Slider } from "../information/DP50Slider";
import CausesSidebar from "../../step2A/information/CausesSidebar";

const TRANSITION_S = "1s";

function FullScenario({
  riskType,
  title,
  scenario,
  parameters,
  visible,
}: {
  riskType: string;
  title: string;
  scenario: SCENARIOS;
  parameters: IntensityParameter<string>[];
  visible: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (riskType === "Malicious Man-made Risk") {
    return (
      <TableContainer component={Paper} sx={{ opacity: visible ? 1 : 0, transition: `opacity ${TRANSITION_S} ease` }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={100} sx={{ backgroundColor: `${SCENARIO_PARAMS[scenario].color}`, color: "white" }}>
                <Trans i18nKey="2A.MM.scenario.decsription">Actor Group Description</Trans>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((p) => (
              <TableRow
                key={p.name}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell sx={{ maxWidth: 200, mr: 6 }}>
                  <Tooltip
                    title={
                      <Box
                        sx={{ px: 1 }}
                        dangerouslySetInnerHTML={{
                          __html: p.description,
                        }}
                      />
                    }
                  >
                    <Box
                      sx={{ p: 0, m: 0 }}
                      dangerouslySetInnerHTML={{
                        __html: p.value,
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ opacity: visible ? 1 : 0, transition: `opacity ${TRANSITION_S} ease` }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={100} sx={{ backgroundColor: `${SCENARIO_PARAMS[scenario].color}`, color: "white" }}>
              {title}: {t(SCENARIO_PARAMS[scenario].titleI18N, SCENARIO_PARAMS[scenario].titleDefault)}{" "}
              <Trans i18nKey="scenario">scenario</Trans>
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableCell sx={{ whiteSpace: "nowrap", pr: 6 }}>Parameter</TableCell>
            <TableCell width="100%" sx={{}}>
              Value
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parameters.map((p) => (
            <TableRow
              key={p.name}
              sx={{
                "&:nth-of-type(even)": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell sx={{ maxWidth: 200, mr: 6 }}>
                <Tooltip
                  title={
                    <Box
                      sx={{ px: 1 }}
                      dangerouslySetInnerHTML={{
                        __html: p.description,
                      }}
                    />
                  }
                >
                  <Box>{p.name}</Box>
                </Tooltip>
              </TableCell>
              <TableCell>{p.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ClimateChangeAnalysis({
  riskFile,
  step2A,
  step2AInput,
  qualiError,
  attachments,
  onOpenSourceDialog,
  onReloadAttachments,
  onShowCauses,
  setRunTutorial,
  onUnmount,
}: {
  riskFile: DVRiskFile;
  step2A: DVDirectAnalysis;
  step2AInput: MutableRefObject<string | null>;
  qualiError: boolean;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
  onShowCauses: () => void;
  setRunTutorial: (run: boolean) => void;
  onUnmount: () => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const api = useAPI();

  useEffect(() => {
    return onUnmount;
  }, []);

  const effectScenarios = unwrapScenarios(
    unwrapParameters(riskFile.cr4de_intensity_parameters),
    riskFile.cr4de_scenario_considerable,
    riskFile.cr4de_scenario_major,
    riskFile.cr4de_scenario_extreme
  );

  const handleChange = (field: string) => async (newValue: string | null) => {
    return api.updateDirectAnalysis(step2A.cr4de_bnradirectanalysisid, {
      [field]: newValue,
    });
  };

  return (
    <Box sx={{ mx: "123px" }}>
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
              scénarios pour la période 2050-2053 , en supposant que le climat évolue selon l'analyse d'horizon validée
              par les experts de ce risque émergent (celle-ci considère la trajectoire socio-économique partagée la plus
              extrême du Sixième rapport d'évaluation du GIEC, la trajectoire SSP5-8.5, qui suppose une économie à forte
              intensité énergétique et basée sur les combustibles fossiles, ou la trajectoire représentative de
              concentration RCP 8.5 du cinquième rapport d'évaluation du GIEC paru en 2014).
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
              Veuillez sélectionner ci-dessous pour chaque scénario d'intensité du risque standard étudié une estimation
              quantitative de la probabilité directe pour la période 2050-2053 en tenant compte de l'effet du changement
              climatique. La probabilité directe que vous avez choisie pour chaque scénario d'intensité du risque
              standard étudié pour la période 2023-2026 lors de l'étape 2A est indiquée par un triangle hachuré.
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
                  Par exemple, lors de la réévaluation de la probabilité directe d'une Dam failure, la possibilité d'une
                  défaillance d'un barrage due à un tremblement de terre doit être exclue. Dans ce cas-ci, vous devez
                  prendre en compte tous les éléments qui pourraient provoquer une rupture de barrage et qui n'ont pas
                  été inclus comme causes possibles du risque étudié (ex: une défaillance technique).
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
                Attention, il est nécessaire de réévaluer toutes les probabilités directes et de remplir tous les champs
                concernant les effets catalyseurs du changement climatique pour clôturer cette étape 2B. Bien qu'il soit
                important pour nous de disposer d'une justification quant à la valeur quantitative que vous avez
                choisie, si vous ne souhaitez pas nous fournir de justification textuelle, nous vous invitons à cliquer
                sur le bouton PAS DE COMMENTAIRE.
              </Trans>
            </Typography>
          </Alert>
          <Box sx={{ mb: 4 }} id="considerable-scenario">
            <FullScenario
              riskType={riskFile.cr4de_risk_type}
              title={riskFile.cr4de_title}
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
                DPValue={step2A.cr4de_dp_quanti_c || "DP1"}
                initialDP50Value={step2A.cr4de_dp50_quanti_c}
                onChange={handleChange("cr4de_dp50_quanti_c")}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <FullScenario
              riskType={riskFile.cr4de_risk_type}
              title={riskFile.cr4de_title}
              scenario={SCENARIOS.MAJOR}
              parameters={effectScenarios.considerable}
              visible
            />

            <Box component={Paper} sx={{ mt: 2, py: 2, px: 3, mb: 4 }} id="step2A-dp-quantitative-box">
              <Typography variant="subtitle2">
                <Trans i18nKey="2B.dp50.quanti.title">DP50 - Direct Probability in 50 years</Trans>
              </Typography>

              <DP50Slider
                id="major"
                DPValue={step2A.cr4de_dp_quanti_m || "DP1"}
                initialDP50Value={step2A.cr4de_dp50_quanti_m}
                onChange={handleChange("cr4de_dp50_quanti_m")}
              />
            </Box>
          </Box>
          <Box sx={{}}>
            <FullScenario
              riskType={riskFile.cr4de_risk_type}
              title={riskFile.cr4de_title}
              scenario={SCENARIOS.EXTREME}
              parameters={effectScenarios.considerable}
              visible
            />

            <Box component={Paper} sx={{ mt: 2, py: 2, px: 3, mb: 4 }} id="step2A-dp-quantitative-box">
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                <Trans i18nKey="2B.dp50.quanti.title">DP50 - Direct Probability in 50 years</Trans>
              </Typography>

              <DP50Slider
                id="extreme"
                DPValue={step2A.cr4de_dp_quanti_e || "DP1"}
                initialDP50Value={step2A.cr4de_dp50_quanti_e}
                onChange={handleChange("cr4de_dp50_quanti_e")}
              />
            </Box>
          </Box>

          <Stack direction="column" sx={{ marginTop: 10 }}>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.climateChange.quali.1">
                Veuillez utiliser le champ ci-dessous pour développer votre raisonnement concernant l'estimation
                quantitative donnée dans la section précédente. Vous pouvez par exemple justifier ces valeurs en citant
                des faits historiques ou les résultats d'études. Si possible, ajoutez des références bibliographiques
                pour étayer vos arguments.
              </Trans>
            </Typography>
          </Stack>

          <Box sx={{ marginTop: 2, marginBottom: 3 }}>
            <QualiTextInputBox
              id="quali-input"
              initialValue={step2A.cr4de_dp50_quali}
              onSave={(v) => {
                step2AInput.current = v || null;
              }}
              setUpdatedValue={(newValue) => {
                step2AInput.current = newValue || null;
              }}
              debounceInterval={500}
              attachments={attachments}
              error={qualiError}
              onOpenSourceDialog={onOpenSourceDialog}
              onReloadAttachments={onReloadAttachments}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
