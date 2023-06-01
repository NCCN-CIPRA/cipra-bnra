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

export default function CatalysingEffectsAnalysis({
  riskFile,
  causes,
  cascade,
  cascadeIndex,
  step2B,
  step2BInput,
  activeCauseScenario,
  activeEffectScenario,
  attachments,
  setStep2BInput,
  onNext,
  onPrevious,
  onChangeScenario,
  onUnmount,
  onOpenSourceDialog,
  onReloadAttachments,
}: {
  riskFile: DVRiskFile;
  causes: DVRiskCascade[];
  cascade: DVRiskCascade<DVRiskFile, DVRiskFile>;
  cascadeIndex: number;
  step2B: DVCascadeAnalysis;
  step2BInput: CascadeAnalysisInput;
  activeCauseScenario: SCENARIOS;
  activeEffectScenario: SCENARIOS;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  setStep2BInput: (input: CascadeAnalysisInput, update?: boolean) => void;
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
  const [qualiInput, setQualiInput] = useState<string | null | undefined>(step2B.cr4de_quali_cascade);
  const qualiRef = useRef<HTMLDivElement | null>(null);

  const field = getCascadeField(activeCauseScenario, activeEffectScenario);
  const cp = input[field] == null ? -1 : (input[field] as number);

  useEffect(() => {
    return onUnmount;
  }, []);

  const causeScenarios = unwrapScenarios(
    unwrapParameters(cascade.cr4de_cause_hazard.cr4de_intensity_parameters),
    cascade.cr4de_cause_hazard.cr4de_scenario_considerable,
    cascade.cr4de_cause_hazard.cr4de_scenario_major,
    cascade.cr4de_cause_hazard.cr4de_scenario_extreme
  );

  const effectScenarios = unwrapScenarios(
    unwrapParameters(riskFile.cr4de_intensity_parameters),
    riskFile.cr4de_scenario_considerable,
    riskFile.cr4de_scenario_major,
    riskFile.cr4de_scenario_extreme
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
        <Stack direction="column">
          <Typography variant="h6" sx={{ mb: 4 }}>
            <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
              <Link
                to={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
                component={RouterLink}
                target="_blank"
              >
                {cascade.cr4de_cause_hazard.cr4de_title}
              </Link>
            </Tooltip>{" "}
            <Trans i18nKey="2B.causes.description">causes a</Trans>{" "}
            <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
              <Link to={`/learning/risk/${riskFile.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
                {riskFile.cr4de_title}
              </Link>
            </Tooltip>{" "}
            ({cascadeIndex + 1}/{causes.length})
          </Typography>

          <Stack direction="column" sx={{ marginTop: 2 }}>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.catalysing.quali.1">CATALYSING EFFECTS QUALI DESCRIPTION (1/2)</Trans>
            </Typography>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.catalysing.quali.2">CATALYSING EFFECTS QUALI DESCRIPTION (2/2)</Trans>
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
