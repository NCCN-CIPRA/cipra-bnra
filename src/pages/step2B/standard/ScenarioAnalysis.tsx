import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Box, Button, Paper, Fade, Stack, Typography, Drawer, Slider, Alert } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useMemo, useRef, RefObject, useState } from "react";
import { Scenarios, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { unwrap as unwrapParameters } from "../../../functions/intensityParameters";
import { useTheme } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { useInView } from "react-intersection-observer";
import useRecords from "../../../hooks/useRecords";
import { DataTable } from "../../../hooks/useAPI";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import ScenarioBox from "../../step2A/information/ScenarioBox";
import { Step, stepNames, STEPS } from "../../step2A/Steps";
import CPSlider from "../CPSlider";

const scenarioNames: (keyof Scenarios)[] = ["considerable", "major", "extreme"];

export default function ScenarioAnalysis({
  step,
  riskFile,
  causes,
  directAnalysis,
  scenarioName,
}: {
  step: Step;
  riskFile: DVRiskFile;
  causes: DVRiskCascade<DVRiskFile>[];
  directAnalysis: DVDirectAnalysis<any>;
  scenarioName: keyof Scenarios;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { ref, inView } = useInView({ rootMargin: "-96px 0px 0px 0px", threshold: 0.9 });

  const [sourceDialogOpen, setSourceDialogOpen] = useState<string | null>(null);
  const [existingSource, setExistingSource] = useState<DVAttachment | undefined>(undefined);

  const { data: attachments, reloadData: reloadAttachments } = useRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_directanalysis_value eq '${directAnalysis.cr4de_bnradirectanalysisid}'&$expand=cr4de_referencedSource`,
  });

  const scenarios = useMemo(
    () =>
      unwrapScenarios(
        unwrapParameters(riskFile.cr4de_intensity_parameters),
        riskFile.cr4de_scenario_considerable,
        riskFile.cr4de_scenario_major,
        riskFile.cr4de_scenario_extreme
      ),
    [riskFile]
  );

  const scenario = scenarios[scenarioName];

  const handleOpenSourceDialog = (field: string) => (existingSource?: DVAttachment) => {
    setSourceDialogOpen(field);
    setExistingSource(existingSource);
  };

  return (
    <Stack sx={{ mx: 1 }} rowGap={8}>
      <Stack rowGap={2}>
        {/* {inputErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography>
              <Trans i18nKey="2A.errors">
                Some inputs are missing on this page. Please check the error messages below.
              </Trans>
            </Typography>
          </Alert>
        )} */}
        <Typography variant="body2">
          <Trans i18nKey={`2B.info.${scenarioName}.1`}>Explanation about filling in the step 2B for the scenario</Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.info.2">The scenario under review is the following</Trans>
        </Typography>
        <Box sx={{ px: 2 }} id="step2A-scenario-description">
          <TableContainer ref={ref} component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ whiteSpace: "nowrap", pr: 6 }}>Parameter</TableCell>
                  <TableCell width="100%" sx={{}}>
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scenario.map((p) => (
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
        </Box>
        <ScenarioBox
          title={t(step.titleI18N, step.titleDefault)}
          visible={!inView}
          scenario={scenario}
          color={step.color || "#FFE699"}
        />
      </Stack>

      <Stack sx={{}} rowGap={2}>
        <Typography variant="h6">
          <Trans i18nKey="2B.causes.title">Causing Risks</Trans>
        </Typography>

        {causes
          .filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk")
          .map((c) => {
            const causeScenarios = unwrapScenarios(
              unwrapParameters(riskFile.cr4de_intensity_parameters),
              riskFile.cr4de_scenario_considerable,
              riskFile.cr4de_scenario_major,
              riskFile.cr4de_scenario_extreme
            );

            return (
              <Box sx={{ mb: 8 }}>
                <Typography variant="subtitle2">{c.cr4de_cause_hazard.cr4de_title}</Typography>

                <Stack direction="row">
                  {scenarioNames.map((scenarioName, i) => {
                    return (
                      <Stack direction="column" sx={{ px: 2, pt: 2, mb: 4 }} id="step2A-scenario-description">
                        <TableContainer ref={ref} component={Paper} sx={{ width: "50%" }}>
                          <Table size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  colSpan={100}
                                  sx={{ backgroundColor: `${stepNames[(i + 1) as STEPS].color}66` }}
                                >
                                  {t(stepNames[(i + 1) as STEPS].titleI18N, stepNames[(i + 1) as STEPS].titleDefault)}
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
                              {causeScenarios[scenarioName].map((p) => (
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
                        <Box sx={{ width: "50%", p: 2, pl: 4 }}>
                          <Typography variant="body2" sx={{ pb: 4 }}>
                            <Trans i18nKey="2B.cp.quanti.info.1">
                              Please use the slider below to estimate the probability that a{" "}
                              <b>
                                {scenarioName} "{c.cr4de_cause_hazard.cr4de_title}"
                              </b>{" "}
                              will cause a
                              <b>
                                {scenarioName} "{riskFile.cr4de_title}"
                              </b>
                            </Trans>
                          </Typography>

                          <CPSlider initialValue={"CP0"} error={false} onChange={() => {}} />
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}
      </Stack>

      <Stack sx={{}} rowGap={2}>
        <Typography variant="h6">
          <Trans i18nKey="2B.catalyzing.title">Catalyzing Effects</Trans>
        </Typography>

        {causes
          .filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk")
          .map((c) => {
            return (
              <Box>
                <Typography variant="subtitle2">{c.cr4de_cause_hazard.cr4de_title}</Typography>
              </Box>
            );
          })}
      </Stack>
    </Stack>
  );
}
