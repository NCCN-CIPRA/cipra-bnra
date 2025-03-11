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

export default function Emerging({
  directAnalysis,
  cascadeAnalyses,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalyses: DVCascadeAnalysis<DVRiskCascade<SmallRisk, SmallRisk>>[];
}) {
  return (
    <>
      <Container>
        <Introduction />
      </Container>

      <Box sx={{ mx: 4 }}>
        <Box sx={{ mb: 8 }}>
          {cascadeAnalyses.map((ca) => (
            <EmergingSection key={ca.cr4de_bnracascadeanalysisid} cascadeAnalysis={ca} />
          ))}
        </Box>
      </Box>
    </>
  );
}

function EmergingSection({
  cascadeAnalysis,
}: {
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
          Catalyzed Risk:{" "}
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
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2">Preliminary Consensus Results:</Typography>
            <Box
              dangerouslySetInnerHTML={{
                __html: cascadeAnalysis.cr4de_cascade.cr4de_quali_cause || "",
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
