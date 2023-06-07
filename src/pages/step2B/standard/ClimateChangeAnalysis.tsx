import { useState, useEffect, useRef, MutableRefObject } from "react";
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
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DP50Slider } from "../information/DP50Slider";

const TRANSITION_MS = 1000;
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
}: {
  riskFile: DVRiskFile;
  step2A: DVDirectAnalysis;
  step2AInput: MutableRefObject<string | null>;
  qualiError: boolean;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const api = useAPI();

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
          <Box sx={{ mb: 4 }}>
            <FullScenario
              riskType={riskFile.cr4de_risk_type}
              title={riskFile.cr4de_title}
              scenario={SCENARIOS.CONSIDERABLE}
              parameters={effectScenarios.considerable}
              visible
            />
            <Box component={Paper} sx={{ mt: 2, p: 2, mb: 4 }} id="step2A-dp-quantitative-box">
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

            <Box component={Paper} sx={{ mt: 2, p: 2, mb: 4 }} id="step2A-dp-quantitative-box">
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

            <Box component={Paper} sx={{ mt: 2, p: 2, mb: 4 }} id="step2A-dp-quantitative-box">
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
              <Trans i18nKey="2B.climateChange.quali.1">CLIMATE CHANGE QUALI DESCRIPTION (1/2)</Trans>
            </Typography>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.climateChange.quali.2">CLIMATE CHANGE QUALI DESCRIPTION (2/2)</Trans>
            </Typography>
          </Stack>

          <Box sx={{ marginTop: 2, marginBottom: 3 }}>
            <QualiTextInputBox
              id="quali-input"
              initialValue={step2A.cr4de_dp50_quali}
              onSave={(v) => {}}
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
