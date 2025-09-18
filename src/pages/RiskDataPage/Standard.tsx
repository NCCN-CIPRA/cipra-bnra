import { useState, useMemo } from "react";
import { Box, Stack, Paper, Link, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import {
  PARAMETER,
  DIRECT_ANALYSIS_SECTIONS_STANDARD,
  getSnapshotQuantiFieldNames,
  quantiLabels,
} from "../../functions/inputProcessing";
import ErrorIcon from "@mui/icons-material/Error";
import { DiscussionRequired } from "../../types/DiscussionRequired";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CascadeSnapshotMatrix } from "./CascadeMatrix";
import TornadoIcon from "@mui/icons-material/Tornado";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import {
  DVRiskSnapshot,
  parseRiskSnapshotQuali,
  RiskSnapshotQualis,
  RiskSnapshotResults,
  RiskSnapshotScenarioQualis,
} from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { BasePageContext } from "../BasePage";
import { Slider } from "./Slider";
import { getImpactScaleFloat } from "../../functions/Impact";

const QUALI_FIELDS = {
  [PARAMETER.DP]: "dp",
  [PARAMETER.H]: "h",
  [PARAMETER.S]: "s",
  [PARAMETER.E]: "e",
  [PARAMETER.F]: "f",
  [PARAMETER.CB]: "cb",
};

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

export default function Standard({
  riskFile,
  causes,
  effects,
  catalyzingEffects,
  climateChange,
}: // directAnalyses,
// cascadeAnalyses,
// reloadRiskFile,
// reloadCascades,
{
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  // directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  // cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  // reloadRiskFile: () => Promise<unknown>;
  // reloadCascades: () => Promise<unknown>;
}) {
  const parsedRiskFile = parseRiskSnapshotQuali(riskFile);

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
            riskFile={parsedRiskFile}
            parameter={PARAMETER.DP}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={parsedRiskFile}
            parameter={PARAMETER.H}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={parsedRiskFile}
            parameter={PARAMETER.S}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={parsedRiskFile}
            parameter={PARAMETER.E}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={parsedRiskFile}
            parameter={PARAMETER.F}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={parsedRiskFile}
            parameter={PARAMETER.CB}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
        </Box>
        <Box sx={{ mb: 8 }}>
          {causes.map((ca) => (
            <CauseSection
              key={ca._cr4de_risk_cascade_value}
              riskFile={riskFile}
              cascade={ca}
              // reloadCascades={reloadCascades}
            />
          ))}
        </Box>
        <Box sx={{ mb: 8 }}>
          {effects.map((ca) => (
            <EffectSection
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
  parameter,
}: // directAnalyses,
// cascadeAnalyses,
// reloadRiskFile,
{
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults, RiskSnapshotQualis>;
  parameter: PARAMETER;
  // directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  // cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  // reloadRiskFile: () => Promise<unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();

  const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    return DiscussionRequired.NOT_NECESSARY;

    // if (!riskFile.cr4de_discussion_required) return false;

    // if (
    //   Object.keys(riskFile.cr4de_discussion_required).some(
    //     (k) =>
    //       k.indexOf(`${section.name}_`) >= 0 &&
    //       riskFile.cr4de_discussion_required &&
    //       riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
    //         DiscussionRequired.REQUIRED
    //   )
    // )
    //   return DiscussionRequired.REQUIRED;
    // if (
    //   Object.keys(riskFile.cr4de_discussion_required).some(
    //     (k) =>
    //       k.indexOf(`${section.name}_`) >= 0 &&
    //       riskFile.cr4de_discussion_required &&
    //       riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
    //         DiscussionRequired.PREFERRED
    //   )
    // )
    //   return DiscussionRequired.PREFERRED;
    // if (
    //   Object.keys(riskFile.cr4de_discussion_required).some(
    //     (k) =>
    //       k.indexOf(`${section.name}_`) >= 0 &&
    //       riskFile.cr4de_discussion_required &&
    //       riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
    //         DiscussionRequired.RESOLVED
    //   )
    // )
    //   return DiscussionRequired.RESOLVED;
    // return DiscussionRequired.NOT_NECESSARY;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFile, parameter]);

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1 }}>{section.label}</Typography>
        {user?.roles.analist &&
          discussionRequired === DiscussionRequired.REQUIRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="warning" />
            </Tooltip>
          )}
        {user?.roles.analist &&
          discussionRequired === DiscussionRequired.PREFERRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="info" />
            </Tooltip>
          )}
        {user?.roles.analist &&
          discussionRequired === DiscussionRequired.RESOLVED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <CheckCircleIcon color="success" />
            </Tooltip>
          )}
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          direction="row"
          sx={{ width: "100%", justifyContent: "stretch" }}
        >
          <ScenarioSection
            riskFile={riskFile}
            parameter={parameter}
            scenario={SCENARIOS.CONSIDERABLE}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ScenarioSection
            riskFile={riskFile}
            parameter={parameter}
            scenario={SCENARIOS.MAJOR}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={reloadRiskFile}
          />
          <ScenarioSection
            riskFile={riskFile}
            parameter={parameter}
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
  parameter,
  scenario,
}: // directAnalyses,
// reloadRiskFile,
{
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults, RiskSnapshotQualis>;
  parameter: PARAMETER;
  scenario: SCENARIOS;
  // directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  // cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  // reloadRiskFile: () => Promise<unknown>;
}) {
  // const api = useAPI();
  const { user } = useOutletContext<BasePageContext>();
  // const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    return DiscussionRequired.NOT_NECESSARY;
    // if (!riskFile.cr4de_discussion_required) return false;

    // return riskFile.cr4de_discussion_required[
    //   `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
    // ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFile, parameter]);

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  // const qualiName = useMemo(
  //   () => getQualiFieldName(scenario, section),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [scenario, parameter]
  // );
  const quantiNames = useMemo(
    () => getSnapshotQuantiFieldNames(parameter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario, parameter]
  );

  const [quali] = useState<string | null>(
    (riskFile.cr4de_quali[scenario][
      QUALI_FIELDS[parameter] as keyof RiskSnapshotScenarioQualis
    ] as string | null) || ""
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
        {user?.roles.analist &&
          discussionRequired === DiscussionRequired.REQUIRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="warning" />
            </Tooltip>
          )}
        {user?.roles.analist &&
          discussionRequired === DiscussionRequired.PREFERRED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <ErrorIcon color="info" />
            </Tooltip>
          )}
        {user?.roles.analist &&
          discussionRequired === DiscussionRequired.RESOLVED && (
            <Tooltip title="The input received for this section was divergent and may require further discussion">
              <CheckCircleIcon color="success" />
            </Tooltip>
          )}
      </Paper>

      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">Final Consensus Results:</Typography>
          <Box sx={{ mt: 2, mb: 4 }}>
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

            {quantiNames.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiNames.map((n) => (
                  <Stack key={n} direction="row" sx={{ alignItems: "center" }}>
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      <i>{quantiLabels[n]}</i> Estimation:
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
                          n === "dp"
                            ? riskFile.cr4de_quanti[scenario].dp.scale
                            : getImpactScaleFloat(
                                riskFile.cr4de_quanti[scenario].di[n].abs,
                                1
                              )
                        }
                        prefix={n === "dp" ? n.toUpperCase() : capFirst(n)}
                        maxScale={5}
                        // spread={
                        //   // user.roles.analist
                        //   //   ? getDASpread(
                        //   //       directAnalyses,
                        //   //       n as keyof DVDirectAnalysis
                        //   //     )
                        //   //   : null
                        //   null
                        // }
                        // onChange={
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
                        //   null
                        // }
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

function CauseSection({
  riskFile,
  cascade,
}: // reloadCascades,
{
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>;
  // reloadCascades: () => Promise<unknown>;
}) {
  // const api = useAPI();
  // const { user } = useOutletContext<AuthPageContext>();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;
  // const discussionRequired = DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
    false
  );
  // const [saving, setSaving] = useState(false);

  const [quali] = useState<string | null>(cascade.cr4de_quali || "");

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
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_risk._cr4de_risk_file_value}`}
            target="_blank"
          >
            {cascade.cr4de_cause_risk.cr4de_title}
          </Link>{" "}
          causes{" "}
          <Link
            href={`/learning/risk/${riskFile._cr4de_risk_file_value}`}
            target="_blank"
          >
            {riskFile.cr4de_title}
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
              cause={cascade.cr4de_cause_risk}
              effect={riskFile}
              onChange={async () => {
                // onChange={async (field, newValue) => {
                // await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
                //   [field]: newValue,
                // });
                // reloadCascades();
              }}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
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

function EffectSection({
  riskFile,
  cascade,
}: // reloadCascades,
{
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>;
  // reloadCascades: () => Promise<unknown>;
}) {
  // const api = useAPI();
  // const { user } = useOutletContext<AuthPageContext>();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const [quali] = useState<string | null>(cascade.cr4de_quali || "");

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
          {" "}
          <Link
            href={`/learning/risk/${riskFile._cr4de_risk_file_value}`}
            target="_blank"
          >
            {riskFile.cr4de_title}
          </Link>
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
              effect={cascade.cr4de_effect_risk}
              cause={riskFile}
              onChange={async () => {
                // onChange={async (field, newValue) => {
                // await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
                //   [field]: newValue,
                // });
                // reloadCascades();
              }}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
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
  // const api = useAPI();
  // const { user } = useOutletContext<AuthPageContext>();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const [quali] = useState<string | null>(cascade.cr4de_quali || "");

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
  // const api = useAPI();
  // const { user } = useOutletContext<AuthPageContext>();
  // const discussionRequired =
  //   cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    false
    // discussionRequired === DiscussionRequired.PREFERRED ||
    //   discussionRequired === DiscussionRequired.REQUIRED
  );
  // const [saving, setSaving] = useState(false);

  const [quali] = useState<string | null>(cascade.cr4de_quali || "");
  const { t } = useTranslation();

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
            <Stack direction="column" sx={{ mt: 2 }}>
              {[SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map(
                (n) => (
                  <Stack key={n} direction="row" sx={{ alignItems: "center" }}>
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      <i>Direct probability in 2050</i> Estimation:
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
                      <Box
                        id={`DP50-slider-${n}`}
                        sx={{ mx: 2, mt: 3, position: "relative" }}
                      >
                        <Tooltip
                          title={t(
                            "2B.DP50.originalValue",
                            "The original DP value selected in the previous step."
                          )}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: -18,
                              left: `calc(${
                                (riskFile.cr4de_quanti[n].dp50.scale + 0) *
                                18.18
                              }% - 15px)`,
                              width: 30,
                              height: 30,
                            }}
                            className="original-dp-value"
                          >
                            <TornadoIcon
                              color="secondary"
                              sx={{ fontSize: 30 }}
                            />
                          </Box>
                        </Tooltip>
                        <Slider
                          // mx={0}
                          initialValue={riskFile.cr4de_quanti[n].dp50.scale}
                          prefix={"DP"}
                          maxScale={5}
                          // name={`cr4de_climate_change_quanti${getScenarioSuffix(
                          //   n
                          // )}`}
                          // spread={
                          //   // user.roles.analist
                          //   //   ? getDASpread(
                          //   //       directAnalyses,
                          //   //       `cr4de_dp50_quanti${n.slice(
                          //   //         -2
                          //   //       )}` as keyof DVDirectAnalysis
                          //   //     )
                          //   //   : null
                          //   null
                          // }
                          // onChange={
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
                          //   null
                          // }
                        />
                      </Box>
                      {/* ) : (
                      <Typography variant="subtitle2">N/A</Typography>
                    )} */}
                    </Box>
                  </Stack>
                )
              )}
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
