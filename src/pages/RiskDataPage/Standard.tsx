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
  getAverageDirectImpactDynamic,
  getAverageIndirectImpact,
  getAverageIndirectImpactDynamic,
} from "../../functions/Impact";
import {
  getAverageDirectProbability,
  getAverageDirectProbabilityDynamic,
  getAverageIndirectProbability,
  getAverageIndirectProbabilityDynamic,
} from "../../functions/Probability";
import { CascadeSection, VISUALS } from "./CascadeSection";
import { DirectSection } from "./DirectSection";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import { Environment } from "../../types/global";

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
  const { environment } = useOutletContext<BasePageContext>();
  const parsedRiskFile = parseRiskSnapshotQuali(riskFile);

  const dp = getAverageDirectProbability(riskFile);
  const dpDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectProbabilityDynamic(riskFile, causes)
      : null;
  const causesWithP = causes.map((c) => ({
    ...c,
    ip: getAverageIndirectProbability(c, riskFile),
    ipDynamic:
      environment === Environment.DYNAMIC
        ? getAverageIndirectProbabilityDynamic(c, riskFile, causes)
        : null,
  }));

  const causeElements = [
    ...causesWithP.map((ca) => ({
      p: getAverageIndirectProbability(ca, riskFile),
      el: (
        <CascadeSection
          key={ca._cr4de_risk_cascade_value}
          cause={ca.cr4de_cause_risk}
          effect={riskFile}
          cascade={ca}
          visuals={visuals}
          subtitle={
            <Stack direction="column" sx={{ textAlign: "right" }}>
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(
                    10000 * (ca.ipDynamic !== null ? ca.ipDynamic : ca.ip)
                  ) / 100}
                  %
                </b>{" "}
                of total probability
              </Typography>
              {ca.ipDynamic !== null && (
                <Typography variant="caption">
                  {ca.ipDynamic >= ca.ip ? "+" : ""}
                  {Math.round(10000 * (ca.ipDynamic - ca.ip)) / 100}% compared
                  to public environment
                </Typography>
              )}
            </Stack>
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
            <Stack direction="column" sx={{ textAlign: "right" }}>
              <Typography variant="body1" color="warning">
                <b>
                  {Math.round(10000 * (dpDynamic !== null ? dpDynamic : dp)) /
                    100}
                  %
                </b>{" "}
                of total probability
              </Typography>
              {dpDynamic !== null && (
                <Typography variant="caption">
                  {dpDynamic >= dp ? "+" : ""}
                  {Math.round(10000 * (dpDynamic - dp)) / 100}% compared to
                  public environment
                </Typography>
              )}
            </Stack>
          }
        />
      ),
    },
  ];

  const effectsWithI = effects.map((e) => ({
    cascade: e,
    i: getAverageIndirectImpact(e, riskFile),
    iDynamic:
      environment === Environment.DYNAMIC
        ? getAverageIndirectImpactDynamic(e, riskFile, effects)
        : null,
  }));

  const iDirectH = getAverageDirectImpact(riskFile, ["ha", "hb", "hc"]);
  const iDirectHDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, ["ha", "hb", "hc"])
      : null;
  const iDirectS = getAverageDirectImpact(riskFile, ["sa", "sb", "sc", "sd"]);
  const iDirectSDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, [
          "sa",
          "sb",
          "sc",
          "sd",
        ])
      : null;
  const iDirectE = getAverageDirectImpact(riskFile, ["ea"]);
  const iDirectEDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, ["ea"])
      : null;
  const iDirectF = getAverageDirectImpact(riskFile, ["fa", "fb"]);
  const iDirectFDynamic =
    environment === Environment.DYNAMIC
      ? getAverageDirectImpactDynamic(riskFile, effects, ["fa", "fb"])
      : null;

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Potential causes
        </Typography>

        <Box sx={{ mb: 8 }}>
          {causeElements.sort((a, b) => b.p - a.p).map((ca) => ca.el)}
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Potential consequences
        </Typography>

        <Box sx={{ mb: 8 }}>
          {effectsWithI
            .sort((a, b) => b.i - a.i)
            .map((e) => (
              <CascadeSection
                key={e.cascade._cr4de_risk_cascade_value}
                cause={riskFile}
                effect={e.cascade.cr4de_effect_risk}
                cascade={e.cascade}
                visuals={visuals}
                subtitle={
                  <Stack direction="column" sx={{ textAlign: "right" }}>
                    <Typography variant="body1" color="warning">
                      <b>
                        {Math.round(
                          10000 * (e.iDynamic !== null ? e.iDynamic : e.i)
                        ) / 100}
                        %
                      </b>{" "}
                      of expected impact
                    </Typography>
                    {e.iDynamic !== null && (
                      <Typography variant="caption">
                        {e.iDynamic >= e.i ? "+" : ""}
                        {Math.round(10000 * (e.iDynamic - e.i)) / 100}% compared
                        to public environment
                      </Typography>
                    )}
                  </Stack>
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
              <Stack direction="column" sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectHDynamic !== null ? iDirectHDynamic : iDirectH)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectHDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectHDynamic >= iDirectH ? "+" : ""}
                    {Math.round(10000 * (iDirectHDynamic - iDirectH)) / 100}%
                    compared to public environment
                  </Typography>
                )}
              </Stack>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Societal impact"
            quantiFields={["sa", "sb", "sc", "sd"]}
            qualiField="s"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectSDynamic !== null ? iDirectSDynamic : iDirectS)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectSDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectSDynamic >= iDirectS ? "+" : ""}
                    {Math.round(10000 * (iDirectSDynamic - iDirectS)) / 100}%
                    compared to public environment
                  </Typography>
                )}
              </Stack>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Environmental impact"
            quantiFields={["ea"]}
            qualiField="e"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectEDynamic !== null ? iDirectEDynamic : iDirectE)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectEDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectEDynamic >= iDirectE ? "+" : ""}
                    {Math.round(10000 * (iDirectEDynamic - iDirectE)) / 100}%
                    compared to public environment
                  </Typography>
                )}
              </Stack>
            }
          />
          <DirectSection
            riskFile={parsedRiskFile}
            title="Financial impact"
            quantiFields={["fa", "fb"]}
            qualiField="f"
            subtitle={
              <Stack direction="column" sx={{ textAlign: "right" }}>
                <Typography variant="body1" color="warning">
                  <b>
                    {Math.round(
                      10000 *
                        (iDirectFDynamic !== null ? iDirectFDynamic : iDirectF)
                    ) / 100}
                    %
                  </b>{" "}
                  of expected impact
                </Typography>
                {iDirectFDynamic !== null && (
                  <Typography variant="caption">
                    {iDirectFDynamic >= iDirectF ? "+" : ""}
                    {Math.round(10000 * (iDirectFDynamic - iDirectF)) / 100}%
                    compared to public environment
                  </Typography>
                )}
              </Stack>
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
