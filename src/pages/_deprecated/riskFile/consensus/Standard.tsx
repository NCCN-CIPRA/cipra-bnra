import { useState, useMemo } from "react";
import {
  Container,
  Box,
  Stack,
  Paper,
  Link,
  Tooltip,
  Button,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import {
  DVRiskFile,
  DiscussionsRequired,
  RISK_TYPE,
} from "../../../types/dataverse/DVRiskFile";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
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
  getDASpread,
  getQualiFieldName,
  getQuantiFieldNames,
  getQuantiLabel,
  getQuantiNumber,
} from "../../../functions/inputProcessing";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import ErrorIcon from "@mui/icons-material/Error";
import { DiscussionRequired } from "../../../types/DiscussionRequired";
import TextInputBox from "../../../components/TextInputBox";
import { DPSlider } from "../../step2A/sections/QuantitativeMarks";
import { Slider } from "./Slider";
import useAPI from "../../../hooks/useAPI";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import CascadeMatrix from "./CascadeMatrix";
import TornadoIcon from "@mui/icons-material/Tornado";
import { useTranslation } from "react-i18next";

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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  // borderBottom: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Standard({
  riskFile,
  cascades,
  directAnalyses,
  cascadeAnalyses,
  reloadRiskFile,
  reloadCascades,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  reloadRiskFile: () => Promise<unknown>;
  reloadCascades: () => Promise<unknown>;
}) {
  const causes = useMemo(() => {
    return cascades.filter(
      (ca) =>
        ca.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING &&
        ca._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid
    );
  }, [cascades]);
  const emerging = useMemo(() => {
    return cascades.filter(
      (ca) => ca.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
    );
  }, [cascades]);

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
          <ParameterSection
            riskFile={riskFile}
            parameter={PARAMETER.DP}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={riskFile}
            parameter={PARAMETER.H}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={riskFile}
            parameter={PARAMETER.S}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={riskFile}
            parameter={PARAMETER.E}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={riskFile}
            parameter={PARAMETER.F}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ParameterSection
            riskFile={riskFile}
            parameter={PARAMETER.CB}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
        </Box>
        <Box sx={{ mb: 8 }}>
          {causes.map((ca) => (
            <CauseSection
              key={ca.cr4de_bnrariskcascadeid}
              riskFile={riskFile}
              cascade={ca}
              reloadCascades={reloadCascades}
            />
          ))}
        </Box>
        <Box sx={{ mb: 8 }}>
          {emerging.map((ca) =>
            ca.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 ? (
              <CCSection
                key={ca.cr4de_bnrariskcascadeid}
                riskFile={riskFile}
                cascade={ca}
                directAnalyses={directAnalyses}
                reloadRiskFile={reloadRiskFile}
                reloadCascades={reloadCascades}
              />
            ) : (
              <EmergingSection
                key={ca.cr4de_bnrariskcascadeid}
                cascade={ca}
                reloadCascades={reloadCascades}
              />
            )
          )}
        </Box>
      </Box>
    </>
  );
}

function ParameterSection({
  riskFile,
  parameter,
  directAnalyses,
  cascadeAnalyses,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  parameter: PARAMETER;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  reloadRiskFile: () => Promise<unknown>;
}) {
  const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    if (!riskFile.cr4de_discussion_required) return false;

    if (
      Object.keys(riskFile.cr4de_discussion_required).some(
        (k) =>
          k.indexOf(`${section.name}_`) >= 0 &&
          riskFile.cr4de_discussion_required &&
          riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
            DiscussionRequired.REQUIRED
      )
    )
      return DiscussionRequired.REQUIRED;
    if (
      Object.keys(riskFile.cr4de_discussion_required).some(
        (k) =>
          k.indexOf(`${section.name}_`) >= 0 &&
          riskFile.cr4de_discussion_required &&
          riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
            DiscussionRequired.PREFERRED
      )
    )
      return DiscussionRequired.PREFERRED;
    if (
      Object.keys(riskFile.cr4de_discussion_required).some(
        (k) =>
          k.indexOf(`${section.name}_`) >= 0 &&
          riskFile.cr4de_discussion_required &&
          riskFile.cr4de_discussion_required[k as keyof DiscussionsRequired] ===
            DiscussionRequired.RESOLVED
      )
    )
      return DiscussionRequired.RESOLVED;
    return DiscussionRequired.NOT_NECESSARY;
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
        {discussionRequired === DiscussionRequired.REQUIRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.PREFERRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="info" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.RESOLVED && (
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
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ScenarioSection
            riskFile={riskFile}
            parameter={parameter}
            scenario={SCENARIOS.MAJOR}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
          />
          <ScenarioSection
            riskFile={riskFile}
            parameter={parameter}
            scenario={SCENARIOS.EXTREME}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={reloadRiskFile}
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
  directAnalyses,
  cascadeAnalyses,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  parameter: PARAMETER;
  scenario: SCENARIOS;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  reloadRiskFile: () => Promise<unknown>;
}) {
  const api = useAPI();
  const section = DIRECT_ANALYSIS_SECTIONS_STANDARD[parameter];
  const discussionRequired = useMemo(() => {
    if (!riskFile.cr4de_discussion_required) return false;

    return riskFile.cr4de_discussion_required[
      `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
    ];
  }, [riskFile, parameter]);

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );
  const [saving, setSaving] = useState(false);

  const qualiName = useMemo(
    () => getQualiFieldName(scenario, section),
    [scenario, parameter]
  );
  const quantiNames = useMemo(
    () => getQuantiFieldNames(scenario, section) as (keyof DVRiskFile)[],
    [scenario, parameter]
  );

  const [quali, setQuali] = useState<string | null>(
    (riskFile[qualiName as keyof DVRiskFile] as string | null) || ""
  );

  const handleSave = async () => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      [qualiName]: quali,
      cr4de_discussion_required: JSON.stringify({
        ...riskFile.cr4de_discussion_required,
        [`${section.name}_${SCENARIO_PARAMS[scenario].prefix}`]:
          DiscussionRequired.RESOLVED,
      }),
    });
    await reloadRiskFile();
    setSaving(false);
    setOpen(false);
  };

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
        {discussionRequired === DiscussionRequired.REQUIRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.PREFERRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="info" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.RESOLVED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <CheckCircleIcon color="success" />
          </Tooltip>
        )}
      </Paper>

      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">Final Consensus Results:</Typography>
          <Box sx={{ mt: 2, mb: 4 }}>
            <TextInputBox
              initialValue={quali}
              setUpdatedValue={(newValue) => {
                setQuali(newValue || null);
              }}
              // onSave={async (newValue) => handleSave(qualiName, newValue)}
            />

            {quantiNames.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiNames.map((n) => (
                  <Stack direction="row" sx={{ alignItems: "center" }}>
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      <i>
                        {getQuantiLabel(n as keyof DVDirectAnalysis, riskFile)}
                      </i>{" "}
                      Estimation:
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: "300px",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {riskFile.cr4de_consensus_type !== null ? (
                        <Slider
                          initialValue={
                            riskFile[n as keyof DVRiskFile] as string
                          }
                          name={n}
                          spread={getDASpread(
                            directAnalyses,
                            n as keyof DVDirectAnalysis
                          )}
                          onChange={async (newValue) => {
                            await api.updateRiskFile(
                              riskFile.cr4de_riskfilesid,
                              {
                                [n]: newValue,
                              }
                            );
                          }}
                        />
                      ) : (
                        <Typography variant="subtitle2">N/A</Typography>
                      )}
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
            <Button loading={saving} variant="outlined" onClick={handleSave}>
              Save & Close
            </Button>
          </Box>
        </Box>
      )}
    </Stack>
  );
}

function CauseSection({
  riskFile,
  cascade,
  reloadCascades,
}: {
  riskFile: DVRiskFile;
  cascade: DVRiskCascade<SmallRisk, SmallRisk>;
  reloadCascades: () => Promise<unknown>;
}) {
  const api = useAPI();
  const discussionRequired =
    cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );
  const [saving, setSaving] = useState(false);

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

  const handleSave = async () => {
    setSaving(true);
    await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
      cr4de_quali: quali,
      cr4de_discussion_required: DiscussionRequired.RESOLVED,
    });
    await reloadCascades();
    setSaving(false);
    setOpen(false);
  };

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1 }}>
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascade.cr4de_cause_hazard.cr4de_title}
          </Link>{" "}
          causes{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_effect_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascade.cr4de_effect_hazard.cr4de_title}
          </Link>
        </Typography>
        {discussionRequired === DiscussionRequired.REQUIRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.PREFERRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="info" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.RESOLVED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <CheckCircleIcon color="success" />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" sx={{ width: "100%" }}>
          <Box sx={{ maxWidth: "800px", mx: "auto", my: 4, px: 4 }}>
            <CascadeMatrix
              cascade={cascade}
              cause={cascade.cr4de_cause_hazard as DVRiskFile}
              effect={riskFile}
              onChange={async (field, newValue) => {
                await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
                  [field]: newValue,
                });
                reloadCascades();
              }}
            />
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            <TextInputBox
              initialValue={quali}
              setUpdatedValue={(newValue) => {
                setQuali(newValue || null);
              }}
            />
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button loading={saving} onClick={handleSave} variant="outlined">
                Save & Close
              </Button>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function EmergingSection({
  cascade,
  reloadCascades,
}: {
  cascade: DVRiskCascade<SmallRisk>;
  reloadCascades: () => Promise<unknown>;
}) {
  const api = useAPI();
  const discussionRequired =
    cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );
  const [saving, setSaving] = useState(false);

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

  const handleSave = async () => {
    setSaving(true);
    await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
      cr4de_quali: quali,
      cr4de_discussion_required: DiscussionRequired.RESOLVED,
    });
    await reloadCascades();
    setSaving(false);
    setOpen(false);
  };

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1 }}>
          Catalyzing Risk:{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascade.cr4de_cause_hazard.cr4de_title}
          </Link>
        </Typography>
        {discussionRequired === DiscussionRequired.REQUIRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.PREFERRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="info" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.RESOLVED && (
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
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            <TextInputBox
              initialValue={quali}
              setUpdatedValue={(newValue) => {
                setQuali(newValue || null);
              }}
            />
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button loading={saving} onClick={handleSave} variant="outlined">
                Save & Close
              </Button>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function CCSection({
  riskFile,
  cascade,
  directAnalyses,
  reloadRiskFile,
  reloadCascades,
}: {
  riskFile: DVRiskFile;
  cascade: DVRiskCascade<SmallRisk>;
  directAnalyses: DVDirectAnalysis[];
  reloadRiskFile: () => Promise<unknown>;
  reloadCascades: () => Promise<unknown>;
}) {
  const api = useAPI();
  const discussionRequired =
    cascade.cr4de_discussion_required || DiscussionRequired.NOT_NECESSARY;

  const [open, setOpen] = useState(
    discussionRequired === DiscussionRequired.PREFERRED ||
      discussionRequired === DiscussionRequired.REQUIRED
  );
  const [saving, setSaving] = useState(false);

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");
  const { t } = useTranslation();

  const handleSave = async () => {
    setSaving(true);
    await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
      cr4de_quali: quali,
      cr4de_discussion_required: DiscussionRequired.RESOLVED,
    });
    await reloadCascades();
    setSaving(false);
    setOpen(false);
  };

  return (
    <Accordion expanded={open} TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => setOpen(!open)}
      >
        <Typography sx={{ flex: 1 }}>
          Catalyzing Risk:{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_hazard.cr4de_riskfilesid}`}
            target="_blank"
          >
            {cascade.cr4de_cause_hazard.cr4de_title}
          </Link>
        </Typography>
        {discussionRequired === DiscussionRequired.REQUIRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="warning" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.PREFERRED && (
          <Tooltip title="The input received for this section was divergent and may require further discussion">
            <ErrorIcon color="info" />
          </Tooltip>
        )}
        {discussionRequired === DiscussionRequired.RESOLVED && (
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
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Final Consensus Results:
            </Typography>
            <TextInputBox
              initialValue={quali}
              setUpdatedValue={(newValue) => {
                setQuali(newValue || null);
              }}
            />
            <Stack direction="column" sx={{ mt: 2 }}>
              {(
                [
                  "cr4de_climate_change_quanti_c",
                  "cr4de_climate_change_quanti_m",
                  "cr4de_climate_change_quanti_e",
                ] as (keyof DVRiskFile)[]
              ).map((n) => (
                <Stack direction="row" sx={{ alignItems: "center" }}>
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    <i>
                      {getQuantiLabel(n as keyof DVDirectAnalysis, riskFile)}
                    </i>{" "}
                    Estimation:
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: "300px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {riskFile.cr4de_consensus_type !== null ? (
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
                                (getQuantiNumber(
                                  (riskFile[
                                    `cr4de_dp_quanti_${n.slice(
                                      -1
                                    )}` as keyof DVRiskFile
                                  ] as string) || "DP0"
                                ).number +
                                  0) *
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
                          mx={0}
                          initialValue={
                            (riskFile[n as keyof DVRiskFile] as string) || "DP0"
                          }
                          name={n}
                          spread={getDASpread(
                            directAnalyses,
                            `cr4de_dp50_quanti${n.slice(
                              -2
                            )}` as keyof DVDirectAnalysis
                          )}
                          onChange={async (newValue) => {
                            await api.updateRiskFile(
                              riskFile.cr4de_riskfilesid,
                              {
                                [n]: newValue,
                              }
                            );
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="subtitle2">N/A</Typography>
                    )}
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button loading={saving} onClick={handleSave} variant="outlined">
                Save & Close
              </Button>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
