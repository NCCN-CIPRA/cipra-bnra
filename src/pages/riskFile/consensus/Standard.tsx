import { useState, useMemo } from "react";
import { Container, Box, Stack, Paper, Link, Tooltip, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, DiscussionsRequired, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import Attachments from "../../riskFile/inputManagement/Attachments";
import { NO_COMMENT } from "../../step2A/sections/QualiTextInputBox";
import {
  DIRECT_ANALYSIS_SECTIONS_STANDARD,
  PARAMETER,
  getQualiFieldName,
  getQuantiFieldNames,
  getQuantiLabel,
} from "../../../functions/inputProcessing";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import CascadeMatrix from "../../step2B/information/CascadeMatrix";
import ErrorIcon from "@mui/icons-material/Error";
import { DiscussionRequired } from "../../../types/DiscussionRequired";
import TextInputBox from "../../../components/TextInputBox";
import { DPSlider } from "../../step2A/sections/QuantitativeMarks";

const capFirst = (s: string) => {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

const Accordion = styled((props: AccordionProps) => <MuiAccordion elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(-90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "none",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  // borderBottom: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Standard({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
}) {
  const causes = useMemo(() => {
    return cascades.filter((ca) => ca.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING);
  }, [cascades]);
  const emerging = useMemo(() => {
    return cascades.filter((ca) => ca.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING);
  }, [cascades]);

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Box sx={{ mb: 8 }}>
          <ParameterSection riskFile={riskFile} parameter={PARAMETER.DP} />
          <ParameterSection riskFile={riskFile} parameter={PARAMETER.H} />
          <ParameterSection riskFile={riskFile} parameter={PARAMETER.S} />
          <ParameterSection riskFile={riskFile} parameter={PARAMETER.E} />
          <ParameterSection riskFile={riskFile} parameter={PARAMETER.F} />
          <ParameterSection riskFile={riskFile} parameter={PARAMETER.CB} />
        </Box>
        <Box sx={{ mb: 8 }}>
          {causes.map((ca) => (
            <CauseSection key={ca.cr4de_bnrariskcascadeid} riskFile={riskFile} cascade={ca} />
          ))}
        </Box>
        <Box sx={{ mb: 8 }}>
          {emerging.map((ca) => (
            <EmergingSection key={ca.cr4de_bnrariskcascadeid} cascade={ca} />
          ))}
        </Box>
      </Box>
    </>
  );
}

function ParameterSection({ riskFile, parameter }: { riskFile: DVRiskFile; parameter: PARAMETER }) {
  const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    if (!riskFile.cr4de_discussion_required) return false;

    return Object.keys(riskFile.cr4de_discussion_required).some(
      (k) =>
        k.indexOf(section.name) >= 0 &&
        riskFile.cr4de_discussion_required &&
        riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] !== DiscussionRequired.NOT_NECESSARY
    );
  }, [riskFile, parameter]);

  const [open, setOpen] = useState(discussionRequired);

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setOpen(!open)}>
        <Typography sx={{ flex: 1 }}>{section.label}</Typography>
        {discussionRequired && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}>
          <ScenarioSection riskFile={riskFile} parameter={parameter} scenario={SCENARIOS.CONSIDERABLE} />
          <ScenarioSection riskFile={riskFile} parameter={parameter} scenario={SCENARIOS.MAJOR} />
          <ScenarioSection riskFile={riskFile} parameter={parameter} scenario={SCENARIOS.EXTREME} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function ScenarioSection({
  riskFile,
  parameter,
  scenario,
}: {
  riskFile: DVRiskFile;
  parameter: PARAMETER;
  scenario: SCENARIOS;
}) {
  const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    if (!riskFile.cr4de_discussion_required) return false;

    return (
      Boolean(
        riskFile.cr4de_discussion_required[
          `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
        ]
      ) &&
      riskFile.cr4de_discussion_required[
        `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
      ] !== DiscussionRequired.NOT_NECESSARY
    );
  }, [riskFile, parameter]);

  const [open, setOpen] = useState(discussionRequired);

  const qualiName = useMemo(() => getQualiFieldName(scenario, section), [scenario, parameter]);
  const quantiNames = useMemo(() => getQuantiFieldNames(scenario, section), [scenario, parameter]);

  return (
    <Stack direction="column" sx={{ flex: open ? 10 : 1, transition: "all .3s ease" }}>
      <Paper
        sx={{
          p: 2,
          bgcolor: `${SCENARIO_PARAMS[scenario].color}`,
          color: "white",
          cursor: "pointer",
          "&:hover": { opacity: 0.7 },
          // width: open ? "100%" : "150px",
          transition: "all .3s ease",
          borderRadius: 0,
          display: "flex",
        }}
        onClick={() => setOpen(!open)}
      >
        <ExpandMoreIcon sx={{ transform: open ? "none" : "rotate(-90deg)" }} />
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          {capFirst(scenario)}
        </Typography>
        {discussionRequired && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
      </Paper>

      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">Final Consensus Results:</Typography>
          <Box sx={{ mt: 2 }}>
            <TextInputBox
              initialValue={(riskFile[qualiName as keyof DVRiskFile] as string | null) || ""}
              // onSave={async (newValue) => handleSave(qualiName, newValue)}
            />

            {quantiNames.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiNames.map((n) => (
                  <Stack direction="row" sx={{ alignItems: "center" }}>
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      <i>{getQuantiLabel(n, riskFile)}</i> Estimation:
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: "300px" }}>
                      <DPSlider
                        initialValue={riskFile[n as keyof DVRiskFile] as string}
                        error={false}
                        onChange={() => {}}
                      />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>

          {/* <Attachments
            reset={lastParam !== parameter || reloadAttachments}
            getAttachments={() =>
              api.getAttachments(
                `$filter=_cr4de_risk_file_value eq ${
                  riskFile.cr4de_riskfilesid
                } and _cr4de_directanalysis_value eq null and cr4de_field eq 'cr4de_${getField(parameter)}_${
                  scenarioLetter[scenario]
                }'&$expand=cr4de_referencedSource`
              )
            }
            consolidateAttachment={null}
            deleteAttachment={async (attachment: DVAttachment) => {
              await api.deleteAttachment(attachment.cr4de_bnraattachmentid);
              setReloadAttachments(true);
            }}
          /> */}
          <Box sx={{ textAlign: "center" }}>
            <Button variant="outlined">Save & Close</Button>
          </Box>
        </Box>
      )}
    </Stack>
  );
}

function CauseSection({ riskFile, cascade }: { riskFile: DVRiskFile; cascade: DVRiskCascade<SmallRisk, SmallRisk> }) {
  const discussionRequired = Boolean(
    cascade.cr4de_discussion_required && cascade.cr4de_discussion_required !== DiscussionRequired.NOT_NECESSARY
  );

  const [open, setOpen] = useState(discussionRequired);

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setOpen(!open)}>
        <Typography sx={{ flex: 1 }}>
          <Link href={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`} target="_blank">
            {cascade.cr4de_cause_hazard.cr4de_title}
          </Link>{" "}
          causes{" "}
          <Link href={`/learning/risk/${cascade.cr4de_effect_hazard.cr4de_riskfilesid}`} target="_blank">
            {cascade.cr4de_effect_hazard.cr4de_title}
          </Link>
        </Typography>
        {discussionRequired && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" sx={{ width: "100%" }}>
          <Box sx={{ maxWidth: "800px", mx: "auto", my: 4, px: 4 }}>
            <CascadeMatrix
              cascadeAnalysis={cascade as unknown as DVCascadeAnalysis}
              cause={cascade.cr4de_cause_hazard as DVRiskFile}
              effect={riskFile}
              onChangeScenario={() => {}}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            <TextInputBox
              initialValue={cascade.cr4de_quali || ""}
              // onSave={async (newValue) => handleSave(qualiName, newValue)}
            />
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="outlined">Save & Close</Button>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function EmergingSection({ cascade }: { cascade: DVRiskCascade<SmallRisk> }) {
  const discussionRequired = Boolean(
    cascade.cr4de_discussion_required && cascade.cr4de_discussion_required !== DiscussionRequired.NOT_NECESSARY
  );

  const [open, setOpen] = useState(discussionRequired);

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setOpen(!open)}>
        <Typography sx={{ flex: 1 }}>
          Catalyzing Risk:{" "}
          <Link href={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`} target="_blank">
            {cascade.cr4de_cause_hazard.cr4de_title}
          </Link>
        </Typography>
        {discussionRequired && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}></Stack>
      </AccordionDetails>
    </Accordion>
  );
}
