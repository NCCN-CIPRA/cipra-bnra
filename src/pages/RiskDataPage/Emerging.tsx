import { useState } from "react";
import { Box, Stack, Link, Tooltip, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import ErrorIcon from "@mui/icons-material/Error";
import { DiscussionRequired } from "../../types/DiscussionRequired";
import TextInputBox from "../../components/TextInputBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../AuthPage";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  // "&:not(:last-child)": {
  //   borderBottom: 0,
  // },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
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

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
  // borderBottom: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Emerging({
  riskFile,
  effects,
}: // reloadCascades,
{
  riskFile: DVRiskFile;
  effects: DVRiskCascade<unknown, SmallRisk>[];
  // reloadCascades: () => Promise<unknown>;
}) {
  return (
    <>
      <Box sx={{ mx: 4 }}>
        {riskFile.cr4de_consensus_type === null && (
          <Box sx={{ mb: 4, border: "1px solid #ff9800aa" }}>
            <Alert severity="warning">
              The consensus phase for this risk file has not yet been started so
              average values for quantitative parameters can not yet be
              displayed.
            </Alert>
          </Box>
        )}
        <Box sx={{ mb: 8 }}>
          {effects.map((ca) => (
            <CatalyzedSection
              key={ca.cr4de_bnrariskcascadeid}
              riskFile={riskFile}
              cascade={ca}
              // reloadCascades={reloadCascades}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

function CatalyzedSection({
  riskFile,
  cascade,
}: // reloadCascades,
{
  riskFile: DVRiskFile;
  cascade: DVRiskCascade<unknown, SmallRisk>;
  // reloadCascades: () => Promise<unknown>;
}) {
  // const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();
  const discussionRequired =
    cascade.cr4de_discussion_required_cause || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const [quali, setQuali] = useState<string | null>(
    cascade.cr4de_quali_cause || ""
  );

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
  //     cr4de_quali_cause: quali,
  //     cr4de_discussion_required_cause: DiscussionRequired.RESOLVED,
  //   });
  //   await reloadCascades();
  //   setSaving(false);
  //   setOpen(false);
  // };

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1 }}>
          <Link
            href={`/learning/risk/${riskFile.cr4de_riskfilesid}`}
            target="_blank"
          >
            {riskFile.cr4de_title}
          </Link>{" "}
          catalyzes{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_effect_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascade.cr4de_effect_hazard.cr4de_title}
          </Link>
        </Typography>
        {user.roles.analist &&
          discussionRequired === DiscussionRequired.REQUIRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="warning" />
            </Tooltip>
          )}
        {user.roles.analist &&
          discussionRequired === DiscussionRequired.PREFERRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="info" />
            </Tooltip>
          )}
        {user.roles.analist &&
          discussionRequired === DiscussionRequired.RESOLVED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <CheckCircleIcon color="success" />
            </Tooltip>
          )}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" sx={{ width: "100%" }}>
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            {user.roles.analist ? (
              <TextInputBox
                initialValue={quali}
                setUpdatedValue={(newValue) => {
                  setQuali(newValue || null);
                }}
              />
            ) : (
              <Box
                dangerouslySetInnerHTML={{
                  __html: quali || "",
                }}
                sx={{
                  mt: 1,
                  mb: 2,
                  ml: 1,
                  pl: 1,
                  borderLeft: "4px solid #eee",
                }}
              />
            )}
            {/* {user.roles.analist && (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  loading={saving}
                  onClick={handleSave}
                  variant="outlined"
                >
                  Save & Close
                </Button>
              </Box>
            )} */}
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
