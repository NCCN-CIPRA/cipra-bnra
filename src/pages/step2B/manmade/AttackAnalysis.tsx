import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Tooltip,
  Paper,
  Fade,
  Container,
  Drawer,
  Slider,
  Alert,
  Typography,
  tooltipClasses,
  Stack,
  Button,
  Slide,
  IconButton,
  Link,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { useTheme } from "@mui/material/styles";
import { SCENARIOS, SCENARIO_PARAMS, Scenarios, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { IntensityParameter, unwrap as unwrapParameters } from "../../../functions/intensityParameters";
import { Trans, useTranslation } from "react-i18next";
import { SliderThumb } from "@mui/material/Slider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CP, CPValueStack } from "../../learning/QuantitativeScales/CP";
import DoneIcon from "@mui/icons-material/Done";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AnimateHeight from "react-animate-height";
import AutoHeight from "../../../components/AutoHeight";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../../hooks/useRecords";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { DVContact } from "../../../types/dataverse/DVContact";
import TextInputBox from "../../../components/TextInputBox";
import { CascadeAnalysisInput, getCascadeField } from "../../../functions/cascades";
import CascadeMatrix from "../information/CascadeMatrix";
import QualiTextInputBox from "../../step2A/sections/QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

const TRANSITION_MS = 1000;
const TRANSITION_S = "1s";

function FadedScenario({ scenario }: { scenario: SCENARIOS }) {
  const { t } = useTranslation();

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: 115,
        opacity: 0.5,
        cursor: "pointer",
        transition: "all .3s ease",
        "&:hover": {
          opacity: 0.8,
          boxShadow: 10,
        },
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={100} sx={{ backgroundColor: `${SCENARIO_PARAMS[scenario].color}`, color: "white" }}>
              {t(SCENARIO_PARAMS[scenario].titleI18N, SCENARIO_PARAMS[scenario].titleDefault)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={100}>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </TableContainer>
  );
}

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

export default function AttackAnalysis({
  riskFile,
  effects,
  cascade,
  cascadeIndex,
  step2B,
  step2BInput,
  activeCauseScenario,
  activeEffectScenario,
  qualiError,
  attachments,
  setStep2BInput,
  onSave,
  onNext,
  onPrevious,
  onChangeScenario,
  onUnmount,
  onOpenSourceDialog,
  onReloadAttachments,
}: {
  riskFile: DVRiskFile;
  effects: DVRiskCascade[];
  cascade: DVRiskCascade<DVRiskFile, DVRiskFile>;
  cascadeIndex: number;
  step2B: DVCascadeAnalysis;
  step2BInput: CascadeAnalysisInput;
  activeCauseScenario: SCENARIOS;
  activeEffectScenario: SCENARIOS;
  qualiError: boolean;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  setStep2BInput: (input: CascadeAnalysisInput, update?: boolean) => void;
  onSave: () => Promise<void>;
  onNext: () => Promise<void>;
  onPrevious: () => Promise<void>;
  onChangeScenario: (causeScenario: SCENARIOS | null, effectScenario: SCENARIOS | null) => void;
  onUnmount: () => void;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const api = useAPI();
  const [input, setInput] = useState(step2BInput);
  const [qualiInput, setQualiInput] = useState<string | null | undefined>(step2BInput.cr4de_quali_cascade);
  const qualiRef = useRef<HTMLDivElement | null>(null);

  const field = getCascadeField(activeCauseScenario, activeEffectScenario);
  const cp = input[field] == null ? -1 : (input[field] as number);

  useEffect(() => {
    return onUnmount;
  }, []);

  const causeScenarios = unwrapScenarios(
    unwrapParameters(riskFile.cr4de_intensity_parameters),
    riskFile.cr4de_scenario_considerable,
    riskFile.cr4de_scenario_major,
    riskFile.cr4de_scenario_extreme
  );

  const effectScenarios = unwrapScenarios(
    unwrapParameters(cascade.cr4de_cause_hazard.cr4de_intensity_parameters),
    cascade.cr4de_cause_hazard.cr4de_scenario_considerable,
    cascade.cr4de_cause_hazard.cr4de_scenario_major,
    cascade.cr4de_cause_hazard.cr4de_scenario_extreme
  );

  function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

  function handleNext() {
    if (
      activeCauseScenario === SCENARIOS.EXTREME &&
      activeEffectScenario === SCENARIOS.EXTREME &&
      (!qualiInput || qualiInput === "") &&
      qualiRef.current
    ) {
      qualiRef.current.scrollIntoView();
    } else {
      onNext();
    }
  }

  interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

  function ArrowThumbComponent(props: AirbnbThumbComponentProps) {
    const { children, ...other } = props;
    return (
      <SliderThumb {...other}>
        {children}
        <KeyboardArrowDownIcon sx={{ color: "white" }} />
      </SliderThumb>
    );
  }

  return (
    <Box sx={{ mx: "123px" }}>
      <Container>
        <Stack direction="column" sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: -72 }} id="cascade-title" />
          <Typography variant="h6" sx={{ mb: 4 }} id="cascade-title-text">
            <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
              <Link to={`/learning/risk/${riskFile.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
                {riskFile.cr4de_title}
              </Link>
            </Tooltip>{" "}
            <Trans i18nKey="2B.causes.description">causes a</Trans>{" "}
            <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
              <Link
                to={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
                component={RouterLink}
                target="_blank"
              >
                {cascade.cr4de_cause_hazard.cr4de_title}
              </Link>
            </Tooltip>{" "}
            ({cascadeIndex + 1}/{effects.length})
          </Typography>

          <Box id="analysis-box">
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  transition: `all ${TRANSITION_S} ease`,
                  left: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "calc(50% - 57.5px)" : "-131px",
                  top: activeCauseScenario === SCENARIOS.EXTREME ? "90px" : "0px",
                  opacity: activeCauseScenario === SCENARIOS.CONSIDERABLE ? 0 : 1,
                }}
                onClick={() => onChangeScenario(SCENARIOS.CONSIDERABLE, null)}
              >
                <FadedScenario scenario={SCENARIOS.CONSIDERABLE} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  transition: `all ${TRANSITION_S} ease`,
                  left:
                    (activeCauseScenario === SCENARIOS.CONSIDERABLE && "calc(100% + 16px)") ||
                    (activeCauseScenario === SCENARIOS.MAJOR && "calc(50% - 57.5px)") ||
                    "-131px",
                  opacity: activeCauseScenario === SCENARIOS.MAJOR ? 0 : 1,
                }}
                onClick={() => onChangeScenario(SCENARIOS.MAJOR, null)}
              >
                <FadedScenario scenario={SCENARIOS.MAJOR} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  transition: `all ${TRANSITION_S} ease`,
                  right: activeCauseScenario === SCENARIOS.EXTREME ? "calc(50% - 57.5px)" : "-131px",
                  top: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "90px" : "0px",
                  opacity: activeCauseScenario === SCENARIOS.EXTREME ? 0 : 1,
                }}
                onClick={() => onChangeScenario(SCENARIOS.EXTREME, null)}
              >
                <FadedScenario scenario={SCENARIOS.EXTREME} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "0px" : "-131px",
                  width: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "100%" : 115,
                  transition: `all ${TRANSITION_S} ease`,
                  pointerEvents: "none",
                }}
              >
                <FullScenario
                  riskType={riskFile.cr4de_risk_type}
                  title={riskFile.cr4de_title}
                  scenario={SCENARIOS.CONSIDERABLE}
                  parameters={causeScenarios.considerable}
                  visible={activeCauseScenario === SCENARIOS.CONSIDERABLE}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left:
                    (activeCauseScenario === SCENARIOS.EXTREME && "-131px") ||
                    (activeCauseScenario === SCENARIOS.MAJOR && "0px") ||
                    "calc(100% + 16px)",
                  width: activeCauseScenario === SCENARIOS.MAJOR ? "100%" : 115,
                  transition: `all ${TRANSITION_S} ease`,
                  pointerEvents: "none",
                }}
              >
                <FullScenario
                  riskType={riskFile.cr4de_risk_type}
                  title={riskFile.cr4de_title}
                  scenario={SCENARIOS.MAJOR}
                  parameters={causeScenarios.major}
                  visible={activeCauseScenario === SCENARIOS.MAJOR}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: (activeCauseScenario === SCENARIOS.EXTREME && "0px") || "calc(100% + 16px)",
                  width: activeCauseScenario === SCENARIOS.EXTREME ? "100%" : 115,
                  transition: `all ${TRANSITION_S} ease`,
                  pointerEvents: "none",
                }}
              >
                <FullScenario
                  riskType={riskFile.cr4de_risk_type}
                  title={riskFile.cr4de_title}
                  scenario={SCENARIOS.EXTREME}
                  parameters={causeScenarios.extreme}
                  visible={activeCauseScenario === SCENARIOS.EXTREME}
                />
              </Box>
              <Box id="cause-scenario">
                <AutoHeight toggle={activeCauseScenario} toggle2={cascade} duration={TRANSITION_S}>
                  <FullScenario
                    riskType={riskFile.cr4de_risk_type}
                    title={riskFile.cr4de_title}
                    scenario={activeCauseScenario}
                    parameters={causeScenarios[activeCauseScenario]}
                    visible={true}
                  />
                </AutoHeight>
              </Box>
            </Box>

            <Stack
              direction="row"
              sx={{
                height: 200,
                my: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "calc(50% - 300px)",
                  right: "calc(50% - 230px)",
                }}
                id="cpx-slider"
              />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  width: 300,
                  left: "calc(50% - 350px)",
                  textAlign: "right",
                }}
              >
                <Trans i18nKey="2B.cp.title">Kans dat de cascade zich voordoet:</Trans>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  width: 64,
                  left: "calc(50% - 370px)",
                }}
              >
                <Tooltip title={t("2B.doneButton.back", "Go back")}>
                  <span>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon sx={{ marginLeft: "8px", marginRight: "-4px" }} />}
                      sx={{
                        padding: "9px 5px",
                        minWidth: "auto",
                        borderRadius: "19px",
                        opacity:
                          cascadeIndex <= 0 &&
                          activeCauseScenario === SCENARIOS.CONSIDERABLE &&
                          activeEffectScenario === SCENARIOS.CONSIDERABLE
                            ? 0
                            : 1,
                        transition: "opacity .5s ease",
                      }}
                      disabled={
                        cascadeIndex <= 0 &&
                        activeCauseScenario === SCENARIOS.CONSIDERABLE &&
                        activeEffectScenario === SCENARIOS.CONSIDERABLE
                      }
                      onClick={onPrevious}
                    />
                  </span>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  width: 300,
                  right: "calc(50% - 200px)",
                  textAlign: "right",
                }}
              >
                {(activeCauseScenario !== SCENARIOS.EXTREME || activeEffectScenario !== SCENARIOS.EXTREME) && (
                  <Tooltip
                    title={
                      cp < 0
                        ? t("2B.doneButton.selectValue", "Please select a value before continuing")
                        : t("2B.doneButton.continue", "Continue")
                    }
                  >
                    <span>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowForwardIcon sx={{ marginLeft: "8px", marginRight: "-4px" }} />}
                        sx={{ padding: "9px 5px", minWidth: "auto", borderRadius: "19px" }}
                        disabled={cp < 0}
                        onClick={handleNext}
                        className="next-button"
                      />
                    </span>
                  </Tooltip>
                )}
              </Box>
              <Slider
                sx={{
                  '& input[type="range"]': {
                    WebkitAppearance: "slider-vertical",
                  },
                  "& .MuiSlider-rail": {
                    width: 8,
                    top: "-2%",
                  },
                  "& .MuiSlider-track": {
                    width: 4,
                    border: "4px solid #fafafa",
                    bottom: "-4% !important",
                  },
                  "& .MuiSlider-thumb": {
                    width: 26,
                    height: 26,
                  },
                }}
                orientation="vertical"
                value={5 - cp}
                onChange={(e, v) => {
                  const newInput = {
                    ...step2BInput,
                    [getCascadeField(activeCauseScenario, activeEffectScenario)]: 5 - (v as number),
                  };
                  const newParentInput = {
                    ...step2BInput,
                    [getCascadeField(activeCauseScenario, activeEffectScenario)]:
                      5 - (v as number) < 0 ? null : 5 - (v as number),
                  };

                  setInput(newInput);
                  setStep2BInput(
                    newParentInput,
                    step2BInput[getCascadeField(activeCauseScenario, activeEffectScenario)] == null ||
                      5 - (v as number) < 0
                  );
                }}
                onChangeCommitted={() => {
                  onSave();
                }}
                min={0}
                max={6}
                aria-label="Conditional Probability"
                valueLabelDisplay="off"
                onKeyDown={preventHorizontalKeyboardNavigation}
                track="inverted"
                components={{ Thumb: ArrowThumbComponent }}
                marks={Array(7)
                  .fill(undefined)
                  .map((_, value) => ({
                    value: value,
                    label:
                      value >= 6 ? (
                        <Typography variant="body2">
                          <Trans i18nKey="2A.slider.none">-</Trans>
                        </Typography>
                      ) : (
                        <Typography id={`step2A-dp-mark-${5 - value}`} variant="body2">
                          <b>CP{5 - value}:</b> {t(CP.intervals[5 - value][0], CP.intervals[5 - value][1])}
                        </Typography>
                      ),
                  }))}
              />
            </Stack>

            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  transition: `all ${TRANSITION_S} ease`,
                  left: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "calc(50% - 57.5px)" : "-131px",
                  top: activeEffectScenario === SCENARIOS.EXTREME ? "90px" : "0px",
                  opacity: activeEffectScenario === SCENARIOS.CONSIDERABLE ? 0 : 1,
                }}
                onClick={() => onChangeScenario(null, SCENARIOS.CONSIDERABLE)}
              >
                <FadedScenario scenario={SCENARIOS.CONSIDERABLE} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  transition: `all ${TRANSITION_S} ease`,
                  left:
                    (activeEffectScenario === SCENARIOS.CONSIDERABLE && "calc(100% + 16px)") ||
                    (activeEffectScenario === SCENARIOS.MAJOR && "calc(50% - 57.5px)") ||
                    "-131px",
                  opacity: activeEffectScenario === SCENARIOS.MAJOR ? 0 : 1,
                }}
                onClick={() => onChangeScenario(null, SCENARIOS.MAJOR)}
              >
                <FadedScenario scenario={SCENARIOS.MAJOR} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  transition: `all ${TRANSITION_S} ease`,
                  right: activeEffectScenario === SCENARIOS.EXTREME ? "calc(50% - 57.5px)" : "-131px",
                  top: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "90px" : "0px",
                  opacity: activeEffectScenario === SCENARIOS.EXTREME ? 0 : 1,
                }}
                onClick={() => onChangeScenario(null, SCENARIOS.EXTREME)}
              >
                <FadedScenario scenario={SCENARIOS.EXTREME} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "0px" : "-131px",
                  width: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "100%" : 115,
                  transition: `all ${TRANSITION_S} ease`,
                  pointerEvents: "none",
                }}
              >
                <FullScenario
                  riskType={cascade.cr4de_effect_hazard.cr4de_risk_type}
                  title={cascade.cr4de_effect_hazard.cr4de_title}
                  scenario={SCENARIOS.CONSIDERABLE}
                  parameters={effectScenarios.considerable}
                  visible={activeEffectScenario === SCENARIOS.CONSIDERABLE}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left:
                    (activeEffectScenario === SCENARIOS.EXTREME && "-131px") ||
                    (activeEffectScenario === SCENARIOS.MAJOR && "0px") ||
                    "calc(100% + 16px)",
                  width: activeEffectScenario === SCENARIOS.MAJOR ? "100%" : 115,
                  transition: `all ${TRANSITION_S} ease`,
                  pointerEvents: "none",
                }}
              >
                <FullScenario
                  riskType={cascade.cr4de_effect_hazard.cr4de_risk_type}
                  title={cascade.cr4de_effect_hazard.cr4de_title}
                  scenario={SCENARIOS.MAJOR}
                  parameters={effectScenarios.major}
                  visible={activeEffectScenario === SCENARIOS.MAJOR}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: (activeEffectScenario === SCENARIOS.EXTREME && "0px") || "calc(100% + 16px)",
                  width: activeEffectScenario === SCENARIOS.EXTREME ? "100%" : 115,
                  transition: `all ${TRANSITION_S} ease`,
                  pointerEvents: "none",
                }}
              >
                <FullScenario
                  riskType={cascade.cr4de_effect_hazard.cr4de_risk_type}
                  title={cascade.cr4de_effect_hazard.cr4de_title}
                  scenario={SCENARIOS.EXTREME}
                  parameters={effectScenarios.extreme}
                  visible={activeEffectScenario === SCENARIOS.EXTREME}
                />
              </Box>
              <Box id="effect-scenario">
                <AutoHeight toggle={activeEffectScenario} toggle2={cascade} duration={TRANSITION_S}>
                  <FullScenario
                    riskType={cascade.cr4de_effect_hazard.cr4de_risk_type}
                    title={cascade.cr4de_effect_hazard.cr4de_title}
                    scenario={activeEffectScenario}
                    parameters={effectScenarios[activeEffectScenario]}
                    visible={true}
                  />
                </AutoHeight>
              </Box>
            </Box>
          </Box>

          <Stack direction="column" sx={{ marginTop: 10 }}>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.causes.summary.1">
                Dans le tableau ci-dessous, vous trouverez, pour chaque lien de cause à effet, un aperçu de l’ensemble
                de vos évaluation quantitatives. Cet aperçu se met à jour automatiquement. Il vous permet de vérifier la
                cohérence de vos évaluations.
              </Trans>
            </Typography>
          </Stack>

          <Box sx={{ margin: "auto", marginTop: 4, maxWidth: 600, width: "100%" }} id="cascade-summary-matrix">
            {/* <CascadeMatrix cascade={cascade} step2B={step2B} /> */}
          </Box>

          <Stack direction="column" sx={{ marginTop: 10 }}>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.causes.quali.1">
                Veuillez utiliser le champ ci-dessous pour développer votre raisonnement concernant l'estimation
                quantitative donnée dans la section précédente. Vous pouvez par exemple justifier ces valeurs en citant
                des faits historiques ou les résultats d'études. Si possible, ajoutez des références bibliographiques
                pour étayer vos arguments.
              </Trans>
            </Typography>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.causes.quali.2">
                Attention, ce champ doit être complété une seule fois pour chaque relation de cause à effet. Vous pouvez
                ajouter des précisions concernant les 9 estimations de la probabilité conditionnelle dans le même champ
                textuel.
              </Trans>
            </Typography>
          </Stack>

          <Box ref={qualiRef} sx={{ marginTop: 2, marginBottom: 3 }}>
            <QualiTextInputBox
              id="quali-input"
              initialValue={qualiInput || ""}
              onSave={(v) => {
                setStep2BInput({
                  ...step2BInput,
                  cr4de_quali_cascade: v || null,
                });
                setQualiInput(v || null);
              }}
              debounceInterval={500}
              error={qualiError}
              attachments={attachments}
              onOpenSourceDialog={onOpenSourceDialog}
              onReloadAttachments={onReloadAttachments}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
