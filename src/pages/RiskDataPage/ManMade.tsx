import { useState, useMemo } from "react";
import { Box, Stack, Paper, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import {
  DIRECT_ANALYSIS_SECTIONS_MANMADE,
  PARAMETER,
  getQualiFieldName,
  getQuantiFieldNames,
} from "../../functions/inputProcessing";
import TextInputBox from "../../components/TextInputBox";
import { Slider } from "./Slider";
import { CascadeSnapshotMatrix } from "./CascadeMatrix";
import { useOutletContext } from "react-router-dom";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { BasePageContext } from "../BasePage";

const capFirst = (s: string) => {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

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

export default function ManMade({
  riskFile,
  effects,
  catalyzingEffects,
  climateChange,
}: // directAnalyses,
// cascadeAnalyses,
// reloadRiskFile,
// reloadCascades,
{
  riskFile: DVRiskSnapshot;
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  // directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  // cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  // reloadRiskFile: () => Promise<unknown>;
  // reloadCascades: () => Promise<unknown>;
}) {
  return (
    <>
      <Box sx={{ mx: 4 }}>
        {/* {riskFile.cr4de_consensus_type === null && (
          <Box sx={{ mb: 4, border: "1px solid #ff9800aa" }}>
            <Alert severity="warning">
              The consensus phase for this risk file has not yet been started so
              average values for quantitative parameters can not yet be
              displayed.
            </Alert>
          </Box>
        )} */}
        <Box sx={{ mb: 8 }}>
          <ParameterSection
            riskFile={riskFile}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
        </Box>
        <Box sx={{ mb: 8 }}>
          {effects.map((ca) => (
            <AttackSection
              key={ca._cr4de_risk_cascade_value}
              riskFile={riskFile}
              cascade={ca}
              // reloadCascades={reloadCascades}
            />
          ))}
        </Box>
        <Box sx={{ mb: 8 }}>
          {climateChange && (
            <CCSection
              key={climateChange._cr4de_risk_cascade_value}
              riskFile={riskFile}
              cascade={climateChange}
              // directAnalyses={directAnalyses}
              // reloadRiskFile={reloadRiskFile}
              // reloadCascades={reloadCascades}
            />
          )}
          {catalyzingEffects.map((ca) => (
            <EmergingSection
              key={ca._cr4de_risk_cascade_value}
              cascade={ca}
              // reloadCascades={reloadCascades}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

function ParameterSection({
  riskFile,
}: // directAnalyses,
// cascadeAnalyses,
// reloadRiskFile,
{
  riskFile: DVRiskSnapshot;
  // directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  // cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  // reloadRiskFile: () => Promise<unknown>;
}) {
  // const { user } = useOutletContext<AuthPageContext>();
  const section = DIRECT_ANALYSIS_SECTIONS_MANMADE[PARAMETER.DP];
  // const discussionRequired = useMemo(() => {
  //   if (!riskFile.cr4de_discussion_required) return false;

  //   if (
  //     Object.keys(riskFile.cr4de_discussion_required).some(
  //       (k) =>
  //         k.indexOf(section.name) >= 0 &&
  //         riskFile.cr4de_discussion_required &&
  //         riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
  //           DiscussionRequired.REQUIRED
  //     )
  //   )
  //     return DiscussionRequired.REQUIRED;
  //   if (
  //     Object.keys(riskFile.cr4de_discussion_required).some(
  //       (k) =>
  //         k.indexOf(section.name) >= 0 &&
  //         riskFile.cr4de_discussion_required &&
  //         riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
  //           DiscussionRequired.PREFERRED
  //     )
  //   )
  //     return DiscussionRequired.PREFERRED;
  //   if (
  //     Object.keys(riskFile.cr4de_discussion_required).some(
  //       (k) =>
  //         k.indexOf(section.name) >= 0 &&
  //         riskFile.cr4de_discussion_required &&
  //         riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
  //           DiscussionRequired.RESOLVED
  //     )
  //   )
  //     return DiscussionRequired.RESOLVED;
  //   return DiscussionRequired.NOT_NECESSARY;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [riskFile]);

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1 }}>{section.label}</Typography>
        {/* {user.roles.analist &&
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
          )} */}
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          direction="row"
          sx={{ width: "100%", justifyContent: "stretch" }}
        >
          <ScenarioSection
            riskFile={riskFile}
            scenario={SCENARIOS.CONSIDERABLE}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ScenarioSection
            riskFile={riskFile}
            scenario={SCENARIOS.MAJOR}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ScenarioSection
            riskFile={riskFile}
            scenario={SCENARIOS.EXTREME}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function ScenarioSection({
  riskFile,
  scenario,
}: // directAnalyses,
// reloadRiskFile,
{
  riskFile: DVRiskSnapshot;
  scenario: SCENARIOS;
  // directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  // cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  // reloadRiskFile: () => Promise<unknown>;
}) {
  // const api = useAPI();
  const { user } = useOutletContext<BasePageContext>();
  const section = DIRECT_ANALYSIS_SECTIONS_MANMADE[PARAMETER.DP];
  // const discussionRequired = useMemo(() => {
  //   if (!riskFile.cr4de_discussion_required) return false;

  //   return riskFile.cr4de_discussion_required[
  //     `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
  //   ];
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [riskFile]);

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const qualiName = useMemo(
    () => getQualiFieldName(scenario, section),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario]
  );
  const quantiNames = useMemo(
    () => getQuantiFieldNames(scenario, section),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario]
  );

  const [quali, setQuali] = useState<string | null>(
    (riskFile[qualiName as keyof DVRiskSnapshot] as string | null) || ""
  );

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
  //     [qualiName]: quali,
  //     cr4de_discussion_required: JSON.stringify({
  //       ...riskFile.cr4de_discussion_required,
  //       [`${section.name}_${SCENARIO_PARAMS[scenario].prefix}`]:
  //         DiscussionRequired.RESOLVED,
  //     }),
  //   });
  //   await reloadRiskFile();
  //   setSaving(false);
  //   setOpen(false);
  // };

  return (
    <Stack
      direction="column"
      sx={{ flex: open ? 10 : 1, transition: "all .3s ease" }}
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
        onClick={() => setOpen(!open)}
      >
        <ExpandMoreIcon sx={{ transform: open ? "none" : "rotate(-90deg)" }} />
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          {capFirst(scenario)}
        </Typography>
        {/* {user.roles.analist &&
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
          )} */}
      </Paper>

      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">Final Consensus Results:</Typography>
          <Box sx={{ mt: 2, mb: 4 }}>
            {user?.roles.analist ? (
              <TextInputBox
                initialValue={quali}
                setUpdatedValue={(newValue) => {
                  setQuali(newValue || null);
                }}
                // onSave={async (newValue) => handleSave(qualiName, newValue)}
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

            {quantiNames.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiNames.map((n) => (
                  <Stack key={n} direction="row" sx={{ alignItems: "center" }}>
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      <i>Motivation</i> Estimation:
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: "300px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {/* {riskFile.cr4de_consensus_type !== null ? ( */}
                      <Slider
                        initialValue={
                          "M" + riskFile.cr4de_quanti[scenario].dp.yearly.scale
                        }
                        spread={
                          // user.roles.analist
                          //   ? getDASpread(directAnalyses, n)
                          //   : null
                          null
                        }
                        onChange={
                          // user.roles.analist
                          //   ? async (newValue) => {
                          //       await api.updateRiskFile(
                          //         riskFile.cr4de_riskfilesid,
                          //         {
                          //           [n]: newValue,
                          //         }
                          //       );
                          //     }
                          //   : null
                          null
                        }
                      />
                      {/* ) : (
                        <Typography variant="subtitle2">N/A</Typography>
                      )} */}
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
          {/* {user.roles.analist && (
            <Box sx={{ textAlign: "center" }}>
              <Button loading={saving} variant="outlined" onClick={handleSave}>
                Save & Close
              </Button>
            </Box>
          )} */}
        </Box>
      )}
    </Stack>
  );
}

function AttackSection({
  riskFile,
  cascade,
}: // reloadCascades,
{
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>;
  // reloadCascades: () => Promise<unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();
  // const api = useAPI();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required_cause || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
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
            href={`/learning/risk/${riskFile._cr4de_risk_file_value}`}
            target="_blank"
          >
            {riskFile.cr4de_title}
          </Link>{" "}
          causes{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_effect_risk._cr4de_risk_file_value}`}
            target="_blank"
          >
            {cascade.cr4de_effect_risk.cr4de_title}
          </Link>
        </Typography>
        {/* {user.roles.analist &&
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
          )} */}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" sx={{ width: "100%" }}>
          <Box sx={{ maxWidth: "800px", mx: "auto", my: 4, px: 4 }}>
            <CascadeSnapshotMatrix
              cascade={cascade}
              cause={riskFile}
              effect={cascade.cr4de_effect_risk}
              isCause={true}
              onChange={async () => {}}
              // onChange={async (field, newValue) => {
              //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
              //     [field]: newValue,
              //   });
              //   reloadCascades();
              // }}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            {user?.roles.analist ? (
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

function EmergingSection({
  cascade,
}: // reloadCascades,
{
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot>;
  // reloadCascades: () => Promise<unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();

  // const api = useAPI();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
  //     cr4de_quali: quali,
  //     cr4de_discussion_required: DiscussionRequired.RESOLVED,
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
          Catalyzing Risk:{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_risk._cr4de_risk_file_value}`}
            target="_blank"
          >
            {cascade.cr4de_cause_risk.cr4de_title}
          </Link>
        </Typography>
        {/* {user.roles.analist &&
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
          )} */}
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          direction="row"
          sx={{ width: "100%", justifyContent: "stretch" }}
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            {user?.roles.analist ? (
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

function CCSection({
  riskFile,
  cascade,
}: // directAnalyses,
// reloadCascades,
{
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot>;
  // directAnalyses: DVDirectAnalysis[];
  // reloadRiskFile: () => Promise<unknown>;
  // reloadCascades: () => Promise<unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();

  // const api = useAPI();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
  //     cr4de_quali: quali,
  //     cr4de_discussion_required: DiscussionRequired.RESOLVED,
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
          Catalyzing Risk:{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_risk._cr4de_risk_file_value}`}
            target="_blank"
          >
            {cascade.cr4de_cause_risk.cr4de_title}
          </Link>
        </Typography>
        {/* {user.roles.analist &&
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
          )} */}
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          direction="row"
          sx={{ width: "100%", justifyContent: "stretch" }}
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            {user?.roles.analist ? (
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
            <Stack direction="column" sx={{ mt: 2 }}>
              {(
                [
                  "cr4de_climate_change_quanti_c",
                  "cr4de_climate_change_quanti_m",
                  "cr4de_climate_change_quanti_e",
                ] as (keyof DVRiskFile)[]
              ).map((n) => (
                <Stack key={n} direction="row" sx={{ alignItems: "center" }}>
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    <i>DP50</i> Estimation:
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: "300px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {/* {riskFile.cr4de_consensus_type !== null ? ( */}
                    <Slider
                      initialValue={
                        riskFile[n as keyof DVRiskSnapshot] as string
                      }
                      name={n}
                      spread={
                        // user.roles.analist
                        //   ? getDASpread(
                        //       directAnalyses,
                        //       `cr4de_dp50_quanti${n.slice(
                        //         -2
                        //       )}` as keyof DVDirectAnalysis
                        //     )
                        //   : null
                        null
                      }
                      onChange={
                        // user.roles.analist
                        //   ? async (newValue) => {
                        //       await api.updateRiskFile(
                        //         riskFile.cr4de_riskfilesid,
                        //         {
                        //           [n]: newValue,
                        //         }
                        //       );
                        //     }
                        //   : null
                        null
                      }
                    />
                    {/* ) : (
                      <Typography variant="subtitle2">N/A</Typography>
                    )} */}
                  </Box>
                </Stack>
              ))}
            </Stack>
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
