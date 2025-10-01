import { useState } from "react";
import { Box, Stack, Link, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SCENARIOS } from "../../functions/scenarios";
import TornadoIcon from "@mui/icons-material/Tornado";
import { useTranslation } from "react-i18next";
import {
  DVRiskSnapshot,
  parseRiskSnapshotQuali,
} from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { Slider } from "./Slider";
import {
  getAverageDirectImpact,
  getAverageIndirectImpact,
} from "../../functions/Impact";
import {
  getAverageDirectProbability,
  getAverageIndirectProbability,
} from "../../functions/Probability";
import { CascadeSection, VISUALS } from "./CascadeSection";
import { DirectSection } from "./DirectSection";

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
  visuals,
}: {
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
  visuals: VISUALS;
}) {
  const parsedRiskFile = parseRiskSnapshotQuali(riskFile);

  const causesWithDP = [
    ...causes.map((ca) => ({
      p: getAverageIndirectProbability(ca, riskFile),
      el: (
        <CascadeSection
          key={ca._cr4de_risk_cascade_value}
          cause={ca.cr4de_cause_risk}
          effect={riskFile}
          cascade={ca}
          visuals={visuals}
          subtitle={
            <Typography variant="body1" color="warning">
              <b>
                {Math.round(
                  10000 * getAverageIndirectProbability(ca, riskFile)
                ) / 100}
                %
              </b>{" "}
              of total probabitity
            </Typography>
          }
        />
      ),
    })),
    {
      p: getAverageDirectProbability(riskFile),
      el: (
        <DirectSection
          riskFile={parsedRiskFile}
          qualiField="dp"
          quantiFields={["dp"]}
          title="Other causes"
          subtitle={
            <Typography variant="body1" color="warning">
              <b>
                {Math.round(10000 * getAverageDirectProbability(riskFile)) /
                  100}
                %
              </b>{" "}
              of total probabitity
            </Typography>
          }
        />
      ),
    },
  ];

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Potential causes
        </Typography>

        <Box sx={{ mb: 8 }}>
          {causesWithDP.sort((a, b) => b.p - a.p).map((ca) => ca.el)}
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Potential consequences
        </Typography>

        <Box sx={{ mb: 8 }}>
          {effects
            .sort(
              (a, b) =>
                getAverageIndirectImpact(b, riskFile) -
                getAverageIndirectImpact(a, riskFile)
            )
            .map((ca) => (
              <CascadeSection
                key={ca._cr4de_risk_cascade_value}
                cause={riskFile}
                effect={ca.cr4de_effect_risk}
                cascade={ca}
                visuals={visuals}
                subtitle={
                  <Typography variant="body1" color="warning">
                    <b>
                      {Math.round(
                        10000 * getAverageIndirectImpact(ca, riskFile)
                      ) / 100}
                      %
                    </b>{" "}
                    of total impact
                  </Typography>
                }
              />
            ))}
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Remaining impact
        </Typography>

        <Box sx={{ mb: 8 }}>
          <DirectSection
            riskFile={parsedRiskFile}
            title="Human impact"
            quantiFields={["ha", "hb", "hc"]}
            qualiField="h"
            subtitle={
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(
                    10000 * getAverageDirectImpact(riskFile, ["ha", "hb", "hc"])
                  ) / 100}
                  %
                </b>{" "}
                of expected impact
              </Typography>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Societal impact"
            quantiFields={["sa", "sb", "sc", "sd"]}
            qualiField="s"
            subtitle={
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(
                    10000 *
                      getAverageDirectImpact(riskFile, ["sa", "sb", "sc", "sd"])
                  ) / 100}
                  %
                </b>{" "}
                of total impact
              </Typography>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Environmental impact"
            quantiFields={["ea"]}
            qualiField="e"
            subtitle={
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(
                    10000 * getAverageDirectImpact(riskFile, ["ea"])
                  ) / 100}
                  %
                </b>{" "}
                of total impact
              </Typography>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Financial impact"
            quantiFields={["fa", "fb"]}
            qualiField="f"
            subtitle={
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(
                    10000 * getAverageDirectImpact(riskFile, ["fa", "fb"])
                  ) / 100}
                  %
                </b>{" "}
                of total impact
              </Typography>
            }
          />
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Catalyzing risks
        </Typography>

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
                          value={riskFile.cr4de_quanti[n].dp50.scale}
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
