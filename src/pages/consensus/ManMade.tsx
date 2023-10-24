import { useState, useMemo } from "react";
import { Container, Box, Stack, Paper, Link, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Introduction from "./Introduction";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import Attachments from "../riskFile/inputManagement/Attachments";
import { NO_COMMENT } from "../step2A/sections/QualiTextInputBox";
import {
  DIRECT_ANALYSIS_SECTIONS_MANMADE,
  DIRECT_ANALYSIS_SECTIONS_STANDARD,
  PARAMETER,
  getQualiFieldName,
  getQuantiFieldNames,
  getQuantiLabel,
} from "../../functions/inputProcessing";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import CascadeMatrix from "../step2B/information/CascadeMatrix";
import ErrorIcon from "@mui/icons-material/Error";
import { DiscussionRequired } from "../../types/DiscussionRequired";

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

export default function ManMade({
  directAnalysis,
  cascadeAnalyses,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalyses: DVCascadeAnalysis<DVRiskCascade<SmallRisk, SmallRisk>>[];
}) {
  const causes = useMemo(() => {
    return cascadeAnalyses.filter((ca) => ca.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING);
  }, [cascadeAnalyses]);
  const emerging = useMemo(() => {
    return cascadeAnalyses.filter((ca) => ca.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING);
  }, [cascadeAnalyses]);

  return (
    <>
      <Container>
        <Introduction />
      </Container>

      <Box sx={{ mx: 4 }}>
        <Box sx={{ mb: 8 }}>
          <ParameterSection directAnalysis={directAnalysis} />
        </Box>
        <Box sx={{ mb: 8 }}>
          {causes.map((ca) => (
            <CauseSection
              key={ca.cr4de_bnracascadeanalysisid}
              riskFile={directAnalysis.cr4de_risk_file}
              cascadeAnalysis={ca}
            />
          ))}
        </Box>
        <Box sx={{ mb: 8 }}>
          {emerging.map((ca) => (
            <EmergingSection key={ca.cr4de_bnracascadeanalysisid} cascadeAnalysis={ca} />
          ))}
        </Box>
      </Box>
    </>
  );
}

function ParameterSection({ directAnalysis }: { directAnalysis: DVDirectAnalysis<DVRiskFile> }) {
  const section = DIRECT_ANALYSIS_SECTIONS_MANMADE[PARAMETER.DP];
  const discussionRequired = useMemo(() => {
    if (!directAnalysis.cr4de_risk_file.cr4de_discussion_required) return false;

    const json = JSON.parse(directAnalysis.cr4de_risk_file.cr4de_discussion_required as unknown as string);

    return Object.keys(json).some((k) => k.indexOf(section.name) >= 0 && json[k] !== DiscussionRequired.NOT_NECESSARY);
  }, [directAnalysis]);

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
          <ScenarioSection directAnalysis={directAnalysis} parameter={PARAMETER.DP} scenario={SCENARIOS.CONSIDERABLE} />
          <ScenarioSection directAnalysis={directAnalysis} parameter={PARAMETER.DP} scenario={SCENARIOS.MAJOR} />
          <ScenarioSection directAnalysis={directAnalysis} parameter={PARAMETER.DP} scenario={SCENARIOS.EXTREME} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function ScenarioSection({
  directAnalysis,
  parameter,
  scenario,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  parameter: PARAMETER;
  scenario: SCENARIOS;
}) {
  const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    if (!directAnalysis.cr4de_risk_file.cr4de_discussion_required) return false;

    const json = JSON.parse(directAnalysis.cr4de_risk_file.cr4de_discussion_required as unknown as string);

    return (
      Boolean(json[`${section.name}_${SCENARIO_PARAMS[scenario].prefix}`]) &&
      json[`${section.name}_${SCENARIO_PARAMS[scenario].prefix}`] !== DiscussionRequired.NOT_NECESSARY
    );
  }, [directAnalysis, parameter]);

  const [open, setOpen] = useState(discussionRequired);

  const qualiName = useMemo(() => getQualiFieldName(scenario, section), [scenario, parameter]);
  const quantiNames = useMemo(() => getQuantiFieldNames(scenario, section), [scenario, parameter]);

  return (
    <Stack
      direction="column"
      sx={{ flex: open ? 10 : 1, transition: "all .3s ease" }}
      className={`consensus-scenario-stack${open ? "-expanded" : ""}`}
    >
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
        className="consensus-scenario"
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
          <Typography variant="subtitle2">Preliminary Consensus Results:</Typography>
          <Box sx={{ ml: 1 }}>
            <Box
              dangerouslySetInnerHTML={{
                __html: (directAnalysis.cr4de_risk_file[qualiName as keyof DVRiskFile] as string | null) || "",
              }}
              sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
            />

            {quantiNames.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiNames.map((n) => (
                  <Stack direction="row">
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      <i>{getQuantiLabel(n, directAnalysis)}</i> Average:
                    </Typography>
                    <Typography variant="caption">
                      <b>{directAnalysis.cr4de_risk_file[n as keyof DVRiskFile] as string}</b>
                    </Typography>
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

          <Typography variant="subtitle2" sx={{ mt: 4 }}>
            Your Input:
          </Typography>

          {directAnalysis[qualiName] && directAnalysis[qualiName] !== NO_COMMENT ? (
            <Box
              dangerouslySetInnerHTML={{ __html: (directAnalysis[qualiName] || "") as string }}
              sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
            />
          ) : (
            <Box sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}>- No comment -</Box>
          )}

          {quantiNames.length > 0 && (
            <Stack direction="column" sx={{ mt: 2 }}>
              {quantiNames.map((n) => (
                <Stack direction="row">
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    <i>{getQuantiLabel(n, directAnalysis)}</i> Estimate:
                  </Typography>
                  <Typography variant="caption">
                    <b>{directAnalysis[n] as string}</b>
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  );
}

function CauseSection({
  riskFile,
  cascadeAnalysis,
}: {
  riskFile: DVRiskFile;
  cascadeAnalysis: DVCascadeAnalysis<DVRiskCascade<SmallRisk, SmallRisk>>;
}) {
  const discussionRequired = Boolean(
    cascadeAnalysis.cr4de_cascade.cr4de_discussion_required &&
      cascadeAnalysis.cr4de_cascade.cr4de_discussion_required !== DiscussionRequired.NOT_NECESSARY
  );

  const [open, setOpen] = useState(discussionRequired);

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setOpen(!open)}>
        <Typography sx={{ flex: 1 }}>
          <Link
            href={`/learning/risk/${cascadeAnalysis.cr4de_cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascadeAnalysis.cr4de_cascade.cr4de_cause_hazard.cr4de_title}
          </Link>{" "}
          causes{" "}
          <Link
            href={`/learning/risk/${cascadeAnalysis.cr4de_cascade.cr4de_effect_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascadeAnalysis.cr4de_cascade.cr4de_effect_hazard.cr4de_title}
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
              cascadeAnalysis={cascadeAnalysis}
              cause={cascadeAnalysis.cr4de_cascade.cr4de_cause_hazard as DVRiskFile}
              effect={riskFile}
              onChangeScenario={() => {}}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2">Preliminary Consensus Results:</Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: cascadeAnalysis.cr4de_cascade.cr4de_quali || "",
              }}
              sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
            />

            <Typography variant="subtitle2" sx={{ mt: 4 }}>
              Your Input:
            </Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: cascadeAnalysis.cr4de_quali_cascade || "",
              }}
              sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
            />
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function EmergingSection({ cascadeAnalysis }: { cascadeAnalysis: DVCascadeAnalysis<DVRiskCascade<SmallRisk>> }) {
  const discussionRequired = Boolean(
    cascadeAnalysis.cr4de_cascade.cr4de_discussion_required &&
      cascadeAnalysis.cr4de_cascade.cr4de_discussion_required !== DiscussionRequired.NOT_NECESSARY
  );

  const [open, setOpen] = useState(discussionRequired);

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={() => setOpen(!open)}>
        <Typography sx={{ flex: 1 }}>
          Catalyzing Risk:{" "}
          <Link
            href={`/learning/risk/${cascadeAnalysis.cr4de_cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascadeAnalysis.cr4de_cascade.cr4de_cause_hazard.cr4de_title}
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
