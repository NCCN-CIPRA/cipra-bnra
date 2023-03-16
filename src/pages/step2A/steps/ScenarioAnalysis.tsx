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
import { DPRows, DPs } from "../../learning/QuantitativeScales/P";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { DISlider, DPSlider } from "../sections/QuantitativeMarks";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { getScenarioInputs, ScenarioInput, ScenarioInputs, SCENARIO_SUFFIX } from "../fields";
import TextInputBox from "../../../components/TextInputBox";
import ScenarioBox from "../information/ScenarioBox";
import { useInView } from "react-intersection-observer";
import DPSection from "../sections/DPSection";
import HSection from "../sections/HSection";
import SSection from "../sections/SSection";
import { Step } from "../Steps";
import ESection from "../sections/ESection";
import FSection from "../sections/FSection";
import CBSection from "../sections/CBSection";
import AttachmentsDialog from "../sections/AttachmentsDialog";
import useRecords from "../../../hooks/useRecords";
import { DataTable } from "../../../hooks/useAPI";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export function validateScenarioInputs(inputs: ScenarioInput): (keyof ScenarioInput)[] {
  return Object.entries(inputs).reduce((acc, [fieldName, value]) => {
    if (value !== null && value !== "") return acc;

    return [...acc, fieldName as keyof ScenarioInput];
  }, [] as (keyof ScenarioInput)[]);
}

export default function ScenarioAnalysis({
  step,
  riskFile,
  directAnalysis,
  scenarioName,
  inputRef,
  inputErrors,
}: {
  step: Step;
  riskFile: DVRiskFile;
  directAnalysis: DVDirectAnalysis<any>;
  scenarioName: keyof Scenarios;
  inputRef: RefObject<ScenarioInputs>;
  inputErrors: (keyof ScenarioInput)[];
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

  if (!inputRef.current) return null;

  const handleOpenSourceDialog = (field: string) => (existingSource?: DVAttachment) => {
    setSourceDialogOpen(field);
    setExistingSource(existingSource);
  };

  return (
    <Stack sx={{ mx: 1 }} rowGap={8}>
      <Stack rowGap={2}>
        {inputErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography>
              <Trans i18nKey="2A.errors">
                Some inputs are missing on this page. Please check the error messages below.
              </Trans>
            </Typography>
          </Alert>
        )}
        <Typography variant="body2">
          <Trans i18nKey={`2A.quanti.info.${scenarioName}.1`}>
            Explanation about filling in the direct analysis for the scenario
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.quanti.info.2">The scenario under review is the following</Trans>
        </Typography>
        <Box sx={{ px: 2 }}>
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

      <DPSection
        fieldsRef={inputRef.current[scenarioName]}
        inputErrors={inputErrors}
        attachments={
          attachments?.filter((a) => a.cr4de_field === `cr4de_dp_quali${SCENARIO_SUFFIX[scenarioName]}`) ?? null
        }
        onOpenSourceDialog={handleOpenSourceDialog(`cr4de_dp_quali${SCENARIO_SUFFIX[scenarioName]}`)}
        onReloadAttachments={reloadAttachments}
      />

      <HSection
        fieldsRef={inputRef.current[scenarioName]}
        inputErrors={inputErrors}
        attachments={
          attachments?.filter((a) => a.cr4de_field === `cr4de_di_quali_h${SCENARIO_SUFFIX[scenarioName]}`) ?? null
        }
        onOpenSourceDialog={handleOpenSourceDialog(`cr4de_di_quali_h${SCENARIO_SUFFIX[scenarioName]}`)}
        onReloadAttachments={reloadAttachments}
      />

      <SSection
        fieldsRef={inputRef.current[scenarioName]}
        inputErrors={inputErrors}
        attachments={
          attachments?.filter((a) => a.cr4de_field === `cr4de_di_quali_s${SCENARIO_SUFFIX[scenarioName]}`) ?? null
        }
        onOpenSourceDialog={handleOpenSourceDialog(`cr4de_di_quali_s${SCENARIO_SUFFIX[scenarioName]}`)}
        onReloadAttachments={reloadAttachments}
      />

      <ESection
        fieldsRef={inputRef.current[scenarioName]}
        inputErrors={inputErrors}
        attachments={
          attachments?.filter((a) => a.cr4de_field === `cr4de_di_quali_e${SCENARIO_SUFFIX[scenarioName]}`) ?? null
        }
        onOpenSourceDialog={handleOpenSourceDialog(`cr4de_di_quali_e${SCENARIO_SUFFIX[scenarioName]}`)}
        onReloadAttachments={reloadAttachments}
      />

      <FSection
        fieldsRef={inputRef.current[scenarioName]}
        inputErrors={inputErrors}
        attachments={
          attachments?.filter((a) => a.cr4de_field === `cr4de_di_quali_f${SCENARIO_SUFFIX[scenarioName]}`) ?? null
        }
        onOpenSourceDialog={handleOpenSourceDialog(`cr4de_di_quali_f${SCENARIO_SUFFIX[scenarioName]}`)}
        onReloadAttachments={reloadAttachments}
      />

      <CBSection
        fieldsRef={inputRef.current[scenarioName]}
        inputErrors={inputErrors}
        attachments={
          attachments?.filter(
            (a) => a.cr4de_field === `cr4de_cross_border_impact_quali${SCENARIO_SUFFIX[scenarioName]}`
          ) ?? null
        }
        onOpenSourceDialog={handleOpenSourceDialog(`cr4de_cross_border_impact_quali${SCENARIO_SUFFIX[scenarioName]}`)}
        onReloadAttachments={reloadAttachments}
      />

      <AttachmentsDialog
        field={sourceDialogOpen ?? ""}
        riskFile={riskFile}
        directAnalysis={directAnalysis}
        open={sourceDialogOpen !== null}
        existingSource={existingSource}
        onClose={() => setSourceDialogOpen(null)}
        onSaved={() => reloadAttachments()}
      />
    </Stack>
  );
}
