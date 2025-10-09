import { useState, useRef, useEffect, useMemo } from "react";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import {
  Grid,
  Box,
  Card,
  Stack,
  CardContent,
  Typography,
  Container,
  Chip,
  MenuItem,
  Paper,
  Divider,
  Select,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Link,
  ListItemText,
  CardActions,
  Rating,
  Tooltip as MUITooltip,
} from "@mui/material";
import { DVContact } from "../../types/dataverse/DVContact";
import TextInputBox from "../../components/TextInputBox";
import { NO_COMMENT } from "./QualiTextInputBox";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import useAPI from "../../hooks/useAPI";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import ExpertCascadeMatrix from "./CascadeMatrix";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import ScenarioTable from "./ScenarioTable";
import { ScenarioInput, ScenarioInputs } from "./fields";
import {
  STATS,
  avg,
  getConsensusCascade,
  getStats,
} from "../../functions/inputProcessing";
import { DiscussionRequired } from "../../types/DiscussionRequired";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import Attachments from "./Attachments";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ConsensusCascadeMatrix from "./ConsensusCascadeMatrix";

const getQuantiLabel = (
  fieldName: keyof DVDirectAnalysis,
  directAnalyses: DVDirectAnalysis[]
) => {
  const good = directAnalyses.filter((da) => da[fieldName] !== null);

  if (good.length <= 0) return 0;

  const prefix = fieldName.startsWith("cr4de_dp50")
    ? fieldName
    : (good[0][fieldName] as string).slice(0, -1);

  return {
    M: "Motivation",
    DP: "Direct probability",
    Ha: "Fatalities",
    Hb: "Injured / sick people",
    Hc: "People in need of assistance",
    Sa: "Supply shortfalls and unmet human needs",
    Sb: "Diminished public order and domestic security",
    Sc: "Damage to the reputation of Belgium",
    Sd: "Loss of confidence in or functioning of the state and/or its values",
    Ea: "Damaged ecosystems",
    Fa: "Financial asset damages",
    Fb: "Reduction of economic performance",
    CP: "Conditional Probability",
    cr4de_dp50_quanti_c: "Direct probability in 2050 - Considerable scenario",
    cr4de_dp50_quanti_m: "Direct probability in 2050 - Major scenario",
    cr4de_dp50_quanti_e: "Direct probability in 2050 - Extreme scenario",
  }[prefix];
};

export default function Step2BTab({
  riskFile,
  cascades,
  directAnalyses,
  cascadeAnalyses,
}: // reloadCascades,
// reloadDirectAnalyses,
// reloadCascadeAnalyses,
{
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];

  // reloadRiskFile: () => void;
  // reloadCascades: () => void;
  // reloadDirectAnalyses: () => void;
  // reloadCascadeAnalyses: () => void;
}) {
  const api = useAPI();

  const [cascadeIndex, setCascadeIndex] = useState<number>(0);
  const [lastCascadeIndex, setLastCascadeIndex] = useState(0);
  const [consensus, setConsensus] = useState<DVCascadeAnalysis | null>(
    getConsensusCascade(
      cascadeAnalyses.filter(
        (ca) => ca._cr4de_cascade_value === cascades[0].cr4de_bnrariskcascadeid
      )
    )
  );
  // const [isSaving, setIsSaving] = useState(false);
  const [discussionRequired, setDiscussionRequired] =
    useState<DiscussionRequired | null>(null);

  const qualiInput = useRef<null | string>(null);
  const [reloadAttachments, setReloadAttachments] = useState(false);

  useEffect(() => {
    if (reloadAttachments) setReloadAttachments(false);
  }, [reloadAttachments]);

  useEffect(() => {
    if (cascades !== null && riskFile !== null && cascadeIndex === null) {
      if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD) {
        const causeIndex = cascades.findIndex(
          (c) =>
            c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
            c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
        );
        if (causeIndex >= 0) setCascadeIndex(causeIndex);
        else
          setCascadeIndex(
            cascades.findIndex(
              (c) =>
                c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
                c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
            )
          );
      } else if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE) {
        const causeIndex = cascades.findIndex(
          (c) =>
            c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid &&
            c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
        );
        if (causeIndex >= 0) setCascadeIndex(causeIndex);
        else
          setCascadeIndex(
            cascades.findIndex(
              (c) =>
                c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
                c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
            )
          );
      } else {
        setCascadeIndex(
          cascades.findIndex(
            (c) =>
              c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid &&
              c.cr4de_effect_hazard.cr4de_risk_type !== RISK_TYPE.MANMADE
          )
        );
      }
    } else if (cascades !== null && cascadeIndex !== null) {
      if (
        riskFile?.cr4de_riskfilesid !==
        cascades[cascadeIndex]._cr4de_cause_hazard_value
      ) {
        setDiscussionRequired(
          cascades[cascadeIndex]
            .cr4de_discussion_required as DiscussionRequired | null
        );
      } else {
        setDiscussionRequired(
          cascades[cascadeIndex]
            .cr4de_discussion_required_cause as DiscussionRequired | null
        );
      }
    }
  }, [cascades, riskFile, cascadeIndex]);

  useEffect(() => {
    if (cascades === null || cascadeAnalyses === null || cascadeIndex === null)
      return;

    const c = getConsensusCascade(
      cascadeAnalyses.filter(
        (ca) =>
          ca._cr4de_cascade_value ===
          cascades[cascadeIndex].cr4de_bnrariskcascadeid
      )
    );

    setConsensus(c);
  }, [cascades, cascadeIndex, cascadeAnalyses]);

  const dp50Distribution = useMemo(() => {
    if (
      cascades !== null &&
      cascadeIndex !== null &&
      riskFile !== null &&
      directAnalyses !== null &&
      cascadeAnalyses !== null &&
      cascades[cascadeIndex].cr4de_cause_hazard.cr4de_title.indexOf(
        "Climate"
      ) >= 0 &&
      riskFile?.cr4de_riskfilesid !==
        cascades[cascadeIndex]._cr4de_cause_hazard_value
    ) {
      const goodDas = directAnalyses.filter(
        (da) => da.cr4de_dp50_quanti_c !== null
      );
      return {
        [SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].titleDefault]: {
          ...(getStats(
            goodDas.map((da) => da["cr4de_dp50_quanti_c"]),
            goodDas
              .map((da) =>
                cascadeAnalyses.find(
                  (ca) => ca._cr4de_expert_value === da._cr4de_expert_value
                )
              )
              .map((ca) => (ca?.cr4de_quality ? ca?.cr4de_quality : 2.5))
          ) as STATS),
          dp: getStats(
            directAnalyses.map((da) => da.cr4de_dp_quanti_c) as string[],
            directAnalyses.map(
              (da) => (da.cr4de_quality && da.cr4de_quality.dp_c) || 2.5
            )
          )?.avg,
        },
        [SCENARIO_PARAMS[SCENARIOS.MAJOR].titleDefault]: {
          ...(getStats(
            goodDas.map((da) => da["cr4de_dp50_quanti_m"]),
            goodDas
              .map((da) =>
                cascadeAnalyses.find(
                  (ca) => ca._cr4de_expert_value === da._cr4de_expert_value
                )
              )
              .map((ca) => (ca?.cr4de_quality ? ca?.cr4de_quality : 2.5))
          ) as STATS),
          dp: getStats(
            directAnalyses.map((da) => da.cr4de_dp_quanti_m) as string[],
            directAnalyses.map(
              (da) => (da.cr4de_quality && da.cr4de_quality.dp_m) || 2.5
            )
          )?.avg,
        },
        [SCENARIO_PARAMS[SCENARIOS.EXTREME].titleDefault]: {
          ...(getStats(
            goodDas.map((da) => da["cr4de_dp50_quanti_e"]),
            goodDas
              .map((da) =>
                cascadeAnalyses.find(
                  (ca) => ca._cr4de_expert_value === da._cr4de_expert_value
                )
              )
              .map((ca) => (ca?.cr4de_quality ? ca?.cr4de_quality : 2.5))
          ) as STATS),
          dp: getStats(
            directAnalyses.map((da) => da.cr4de_dp_quanti_e) as string[],
            directAnalyses.map(
              (da) => (da.cr4de_quality && da.cr4de_quality.dp_e) || 2.5
            )
          )?.avg,
        },
      };
    }

    return null;
  }, [cascades, cascadeIndex, riskFile, directAnalyses, cascadeAnalyses]);

  const dp50Divergence = dp50Distribution
    ? avg(Object.values(dp50Distribution).map((d) => d.std)) / 6
    : 0;

  const cas = cascadeAnalyses.filter(
    (ca) =>
      ca._cr4de_cascade_value === cascades[cascadeIndex].cr4de_bnrariskcascadeid
  );

  const causes = cascades.filter(
    (c) =>
      c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
  );
  const attacks = cascades.filter(
    (c) =>
      riskFile.cr4de_risk_type === RISK_TYPE.MANMADE &&
      c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid
  );
  const catalyzingEffects = cascades.filter(
    (c) =>
      c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
  );
  const catalyzedRisks = cascades.filter(
    (c) =>
      c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid &&
      riskFile.cr4de_risk_type === RISK_TYPE.EMERGING &&
      c.cr4de_effect_hazard.cr4de_risk_type === RISK_TYPE.STANDARD
  );

  const cascade = cascades[cascadeIndex];

  // const handleSave = async (innerCascadeIndex: number) => {
  //   setIsSaving(true);

  //   if (
  //     riskFile.cr4de_riskfilesid !==
  //     cascades[innerCascadeIndex]._cr4de_cause_hazard_value
  //   ) {
  //     await api.updateCascade(
  //       cascades[innerCascadeIndex].cr4de_bnrariskcascadeid,
  //       {
  //         cr4de_quali: qualiInput.current,
  //       }
  //     );
  //   } else {
  //     await api.updateCascade(
  //       cascades[innerCascadeIndex].cr4de_bnrariskcascadeid,
  //       {
  //         cr4de_quali_cause: qualiInput.current,
  //       }
  //     );
  //   }

  //   await reloadCascades();

  //   setIsSaving(false);
  // };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            zIndex: 0,
            top: 169,
            width: 240,
            boxSizing: "border-box",
            height: "auto",
            minHeight: "calc(100% - 169px)",
            position: "absolute",
          },
        }}
      >
        <Box sx={{ overflow: "auto", mb: 8 }}>
          {causes.length > 0 && (
            <>
              <List>
                <ListItem>
                  <Typography variant="subtitle2">Causes</Typography>
                </ListItem>
                {causes.map((c) => (
                  <ListItem
                    key={c.cr4de_bnrariskcascadeid}
                    disablePadding
                    sx={{ paddingLeft: 2 }}
                  >
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) =>
                              (ca.cr4de_bnrariskcascadeid ===
                                c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText
                        primary={c.cr4de_cause_hazard.cr4de_title}
                        sx={{
                          fontWeight:
                            c.cr4de_bnrariskcascadeid ===
                            cascade.cr4de_bnrariskcascadeid
                              ? "bold"
                              : "regular",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {(attacks.length > 0 ||
                catalyzingEffects.length > 0 ||
                catalyzedRisks.length > 0) && <Divider />}
            </>
          )}
          {attacks.length > 0 && (
            <>
              <List>
                <ListItem>
                  <Typography variant="subtitle2">Potential Attacks</Typography>
                </ListItem>
                {attacks.map((c) => (
                  <ListItem
                    key={c.cr4de_bnrariskcascadeid}
                    disablePadding
                    sx={{ paddingLeft: 2 }}
                  >
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) =>
                              (ca.cr4de_bnrariskcascadeid ===
                                c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText
                        primary={c.cr4de_effect_hazard.cr4de_title}
                        sx={{
                          fontWeight:
                            c.cr4de_bnrariskcascadeid ===
                            cascade.cr4de_bnrariskcascadeid
                              ? "bold"
                              : "regular",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {(catalyzingEffects.length > 0 || catalyzedRisks.length > 0) && (
                <Divider />
              )}
            </>
          )}
          {catalyzingEffects.length > 0 && (
            <>
              <List>
                <ListItem>
                  <Typography variant="subtitle2">
                    Catalyzing Effects
                  </Typography>
                </ListItem>
                {catalyzingEffects.map((c) => (
                  <ListItem
                    key={c.cr4de_bnrariskcascadeid}
                    disablePadding
                    sx={{ paddingLeft: 2 }}
                  >
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) =>
                              (ca.cr4de_bnrariskcascadeid ===
                                c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText
                        primary={c.cr4de_cause_hazard.cr4de_title}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {catalyzedRisks.length > 0 && <Divider />}
            </>
          )}
          {catalyzedRisks.length > 0 && (
            <>
              <List>
                <ListItem>
                  <Typography variant="subtitle2">
                    Catalyzing Effects
                  </Typography>
                </ListItem>
                {catalyzedRisks.map((c) => (
                  <ListItem
                    key={c.cr4de_bnrariskcascadeid}
                    disablePadding
                    sx={{ paddingLeft: 2 }}
                  >
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) =>
                              (ca.cr4de_bnrariskcascadeid ===
                                c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText
                        primary={c.cr4de_effect_hazard.cr4de_title}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </Drawer>
      <Container sx={{ ml: "240px" }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
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
        <Stack spacing={4}>
          <Card>
            <CardContent>
              {riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      Below is a summary of the quantitative results for this
                      cascade:
                    </Typography>
                  </Box>
                  {cascades[cascadeIndex].cr4de_cause_hazard.cr4de_risk_type !==
                    RISK_TYPE.EMERGING && (
                    <Box sx={{ mb: 8 }}>
                      {riskFile && consensus && (
                        <ConsensusCascadeMatrix
                          cause={cascades[cascadeIndex].cr4de_cause_hazard}
                          cascade={consensus}
                        />
                      )}
                    </Box>
                  )}

                  {cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >=
                    0 &&
                    riskFile.cr4de_riskfilesid !==
                      cascade._cr4de_cause_hazard_value &&
                    dp50Distribution && (
                      <Box
                        sx={{
                          width: "100%",
                          height: 300,
                          mt: 4,
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 0,
                          }}
                        >
                          <ResponsiveContainer>
                            <BarChart
                              data={Object.entries(dp50Distribution).map(
                                ([label, distribution]) => {
                                  return {
                                    name: `${label} Input Distribution`,
                                    distFloat: distribution.min - 0.05,
                                    distBot:
                                      distribution.avg - distribution.min,
                                    distAvg: 0.1,
                                    distTop:
                                      distribution.max - distribution.avg,
                                  };
                                }
                              )}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis
                                domain={[-1, 6]}
                                ticks={[0, 1, 2, 3, 4, 5]}
                              />
                              <Tooltip
                                formatter={(value, name, props) => {
                                  if (name === "Minimum")
                                    return props.payload.distFloat + 0.05;
                                  if (name === "Average")
                                    return (
                                      props.payload.distFloat +
                                      0.05 +
                                      props.payload.distBot
                                    );
                                  if (name === "Maximum")
                                    return (
                                      props.payload.distFloat +
                                      0.05 +
                                      props.payload.distBot +
                                      props.payload.distTop
                                    );

                                  return value;
                                }}
                              />
                              <Bar
                                dataKey="distFloat"
                                stackId="a"
                                fill="transparent"
                              />
                              <Bar
                                dataKey="distBot"
                                stackId="a"
                                fill="#82ca9d"
                                name="Minimum"
                              />
                              <Bar
                                dataKey="distAvg"
                                stackId="a"
                                fill="#5a9671"
                                name="Average"
                              />
                              <Bar
                                dataKey="distTop"
                                stackId="a"
                                fill="#82ca9d"
                                name="Maximum"
                              />

                              <ReferenceLine
                                segment={[
                                  {
                                    x: "Considerable Input Distribution",
                                    y:
                                      (dp50Distribution.Considerable.dp || 0) -
                                      0.1,
                                  },
                                  {
                                    x: "Considerable Input Distribution",
                                    y:
                                      (dp50Distribution.Considerable.dp || 0) +
                                      0.1,
                                  },
                                ]}
                                strokeWidth="25%"
                                stroke="rgba(255, 0, 0, 0.3)"
                                label={{
                                  value: "Original DP",
                                  position: "top",
                                }}
                              />

                              <ReferenceLine
                                segment={[
                                  {
                                    x: "Major Input Distribution",
                                    y: (dp50Distribution.Major.dp || 0) - 0.1,
                                  },
                                  {
                                    x: "Major Input Distribution",
                                    y: (dp50Distribution.Major.dp || 0) + 0.1,
                                  },
                                ]}
                                strokeWidth="25%"
                                stroke="rgba(255, 0, 0, 0.3)"
                                label={{
                                  value: "Original DP",
                                  position: "top",
                                }}
                              />

                              <ReferenceLine
                                segment={[
                                  {
                                    x: "Extreme Input Distribution",
                                    y: (dp50Distribution.Extreme.dp || 0) - 0.1,
                                  },
                                  {
                                    x: "Extreme Input Distribution",
                                    y: (dp50Distribution.Extreme.dp || 0) + 0.1,
                                  },
                                ]}
                                strokeWidth="25%"
                                stroke="rgba(255, 0, 0, 0.3)"
                                label={{
                                  value: "Original DP",
                                  position: "top",
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Box>
                    )}

                  <Stack direction="row" sx={{ mt: 2, alignItems: "center" }}>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      Divergence:
                    </Typography>
                    <MUITooltip title={`Divergence: ${100 * dp50Divergence}%`}>
                      <Box>
                        {dp50Divergence < 0.2 && (
                          <Chip label="LOW" color="success" />
                        )}
                        {dp50Divergence >= 0.2 && dp50Divergence < 0.4 && (
                          <Chip label="MEDIUM" color="warning" />
                        )}
                        {dp50Divergence >= 0.4 && (
                          <Chip label="HIGH" color="error" />
                        )}
                      </Box>
                    </MUITooltip>
                  </Stack>
                </>
              )}

              <Stack direction="row" sx={{ mt: 2, alignItems: "center" }}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  Discussion Needed:
                </Typography>
                <Select
                  value={discussionRequired || "unknown"}
                  sx={{ width: 200 }}
                  // onChange={async (e) => {
                  //   setDiscussionRequired(e.target.value as DiscussionRequired);
                  //   if (
                  //     riskFile.cr4de_riskfilesid !==
                  //     cascade._cr4de_cause_hazard_value
                  //   ) {
                  //     await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
                  //       cr4de_discussion_required: e.target.value,
                  //     });
                  //   } else {
                  //     await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
                  //       cr4de_discussion_required_cause: e.target.value,
                  //     });
                  //   }
                  //   reloadCascades();
                  // }}
                >
                  <MenuItem value="unknown">Unknown</MenuItem>
                  <MenuItem value={DiscussionRequired.REQUIRED}>
                    Required
                  </MenuItem>
                  <MenuItem value={DiscussionRequired.PREFERRED}>
                    Preferred
                  </MenuItem>
                  <MenuItem value={DiscussionRequired.NOT_NECESSARY}>
                    Unnecessary
                  </MenuItem>
                </Select>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  The field below can be used to summarize the qualitative
                  responses of the experts or to prepare for the consensus
                  meeting:
                </Typography>
              </Box>
              {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD ? (
                <TextInputBox
                  initialValue={(cascade.cr4de_quali as string | null) || ""}
                  setUpdatedValue={(v) => {
                    qualiInput.current = v || null;
                  }}
                  // onSave={async (newValue) => handleSave(qualiName, newValue)}
                  // disabled={false}
                  reset={lastCascadeIndex !== cascadeIndex}
                  onReset={async () => {
                    setLastCascadeIndex(cascadeIndex);
                    // await handleSave(lastCascadeIndex);
                    qualiInput.current = cascade.cr4de_quali;
                  }}
                />
              ) : (
                <TextInputBox
                  initialValue={
                    (cascade.cr4de_quali_cause as string | null) || ""
                  }
                  setUpdatedValue={(v) => {
                    qualiInput.current = v || null;
                  }}
                  // onSave={async (newValue) => handleSave(qualiName, newValue)}
                  // disabled={false}
                  reset={lastCascadeIndex !== cascadeIndex}
                  onReset={async () => {
                    setLastCascadeIndex(cascadeIndex);
                    // await handleSave(lastCascadeIndex);
                    qualiInput.current = cascade.cr4de_quali_cause;
                  }}
                />
              )}
            </CardContent>
            <CardActions>
              {/* <Button
                loading={isSaving}
                onClick={() => handleSave(cascadeIndex)}
              >
                Save
              </Button> */}
            </CardActions>

            <Attachments
              reset={lastCascadeIndex !== cascadeIndex || reloadAttachments}
              getAttachments={() =>
                api.getAttachments(
                  `$filter=_cr4de_riskcascade_value eq ${cascade.cr4de_bnrariskcascadeid} and _cr4de_cascadeanalysis_value eq null&$expand=cr4de_referencedSource`
                )
              }
              consolidateAttachment={null}
              deleteAttachment={async (attachment: DVAttachment) => {
                await api.deleteAttachment(attachment.cr4de_bnraattachmentid);
                setReloadAttachments(true);
              }}
            />
          </Card>

          <Paper sx={{ p: 2 }}>
            {riskFile.cr4de_title.indexOf("Climate") < 0 &&
            cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0
              ? directAnalyses
                  .filter((da) => da.cr4de_dp50_quanti_c !== null)
                  .map((da, i, a) => (
                    <>
                      <ExpertInputCC
                        directAnalysis={da}
                        cascade={cascade}
                        // reloadDirectAnalyses={reloadDirectAnalyses}
                        setReloadAttachments={() => setReloadAttachments(true)}
                      />
                      {i < a.length - 1 && (
                        <Divider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />
                      )}
                    </>
                  ))
              : cas.map((ca, i, a) => (
                  <>
                    <ExpertInput
                      riskFile={riskFile}
                      cascade={cascade}
                      directAnalysis={
                        directAnalyses.find(
                          (da) =>
                            (da._cr4de_expert_value ===
                              ca._cr4de_expert_value) as boolean
                        ) as DVDirectAnalysis
                      }
                      cascadeAnalysis={ca}
                      // reloadCascadeAnalyses={reloadCascadeAnalyses}
                      setReloadAttachments={() => setReloadAttachments(true)}
                    />
                    {i < a.length - 1 && (
                      <Divider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />
                    )}
                  </>
                ))}
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

function ExpertInput({
  riskFile,
  cascade,
  directAnalysis,
  cascadeAnalysis,
  // reloadCascadeAnalyses,
  setReloadAttachments,
}: {
  riskFile: DVRiskFile;
  cascade: DVRiskCascade<SmallRisk, SmallRisk>;
  directAnalysis: DVDirectAnalysis;
  cascadeAnalysis: DVCascadeAnalysis<unknown, unknown, DVContact>;
  // reloadCascadeAnalyses: () => void;
  setReloadAttachments: () => void;
}) {
  const api = useAPI();
  const [rating, setRating] = useState(cascadeAnalysis.cr4de_quality);
  const [lastCascadeAnalysis, setLastCascadeAnalysis] =
    useState(cascadeAnalysis);

  useEffect(() => {
    if (cascadeAnalysis !== lastCascadeAnalysis) {
      setLastCascadeAnalysis(cascadeAnalysis);
      setRating(cascadeAnalysis.cr4de_quality);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cascadeAnalysis]);

  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid justifyContent="left" size="grow">
        <Stack direction="row">
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            {cascadeAnalysis.cr4de_expert.emailaddress1} says:
          </Typography>
          <Rating
            name="size-small"
            value={rating}
            // onChange={async (_e, newValue) => {
            //   setRating(newValue);
            //   await api.updateCascadeAnalysis(
            //     cascadeAnalysis.cr4de_bnracascadeanalysisid,
            //     {
            //       cr4de_quality: newValue,
            //     }
            //   );
            //   reloadCascadeAnalyses();
            // }}
            size="small"
          />
        </Stack>

        {cascade.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING && (
          <Box sx={{ mb: 8 }}>
            <ExpertCascadeMatrix
              cascadeAnalysis={cascadeAnalysis}
              cause={riskFile}
              effect={cascade.cr4de_effect_hazard as DVRiskFile}
              onChangeScenario={() => {}}
            />
          </Box>
        )}
        {cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 &&
          riskFile.cr4de_riskfilesid !== cascade._cr4de_cause_hazard_value && (
            <ScenarioTable
              inputs={
                [directAnalysis].map((da) => ({
                  considerable: { cr4de_dp50_quanti: da.cr4de_dp50_quanti_c },
                  major: { cr4de_dp50_quanti: da.cr4de_dp50_quanti_m },
                  extreme: { cr4de_dp50_quanti: da.cr4de_dp50_quanti_e },
                }))[0] as unknown as ScenarioInputs
              }
              fields={["cr4de_dp50_quanti" as keyof ScenarioInput]}
            />
          )}
        {(cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0 ||
          (cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 &&
            riskFile.cr4de_riskfilesid ===
              cascade._cr4de_cause_hazard_value)) && (
          <Box
            dangerouslySetInnerHTML={{
              __html: (cascadeAnalysis.cr4de_quali_cascade || "") as string,
            }}
            sx={{ mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
          />
        )}
        {cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 &&
          riskFile.cr4de_riskfilesid !== cascade._cr4de_cause_hazard_value && (
            <Box
              dangerouslySetInnerHTML={{
                __html: (directAnalysis.cr4de_dp50_quali || "") as string,
              }}
              sx={{ mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
            />
          )}

        <Attachments
          reset={lastCascadeAnalysis !== cascadeAnalysis}
          getAttachments={() =>
            api.getAttachments(
              `$filter=_cr4de_cascadeanalysis_value eq ${cascadeAnalysis?.cr4de_bnracascadeanalysisid}`
            )
          }
          consolidateAttachment={async (attachment: DVAttachment) => {
            await api.createAttachment(
              {
                "cr4de_owner@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${attachment._cr4de_owner_value})`,
                cr4de_field: attachment.cr4de_field,
                "cr4de_referencedSource@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${attachment.cr4de_bnraattachmentid})`,
                "cr4de_riskcascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cascadeAnalysis._cr4de_cascade_value})`,
              },
              null
            );

            setReloadAttachments();
          }}
          deleteAttachment={null}
        />
      </Grid>
    </Grid>
  );
}

function ExpertInputCC({
  directAnalysis,
  cascade,
  // reloadDirectAnalyses,
  setReloadAttachments,
}: {
  directAnalysis: DVDirectAnalysis<unknown, DVContact>;
  cascade: DVRiskCascade;
  // reloadDirectAnalyses: () => void;
  setReloadAttachments: () => void;
}) {
  const api = useAPI();

  const [rating] = useState(
    (directAnalysis.cr4de_quality && directAnalysis.cr4de_quality.cc) ?? null
  );

  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid justifyContent="left" size="grow">
        <Stack direction="row">
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            {directAnalysis.cr4de_expert.emailaddress1} says:
          </Typography>
          <Rating
            name="size-small"
            value={rating}
            // onChange={async (_e, newValue) => {
            //   setRating(newValue);
            //   await api.updateDirectAnalysis(
            //     directAnalysis.cr4de_bnradirectanalysisid,
            //     {
            //       cr4de_quality: JSON.stringify({
            //         ...directAnalysis.cr4de_quality,
            //         cc: newValue,
            //       }),
            //     }
            //   );
            //   reloadDirectAnalyses();
            // }}
            size="small"
          />
        </Stack>
        {directAnalysis.cr4de_dp50_quali &&
        directAnalysis.cr4de_dp50_quali !== NO_COMMENT ? (
          <Box
            dangerouslySetInnerHTML={{
              __html: (directAnalysis.cr4de_dp50_quali || "") as string,
            }}
            sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
          />
        ) : (
          <Box
            sx={{ mt: 1, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
          >
            - No comment -
          </Box>
        )}

        <Stack direction="column" sx={{ mt: 2 }}>
          {[
            "cr4de_dp50_quanti_c",
            "cr4de_dp50_quanti_m",
            "cr4de_dp50_quanti_e",
          ].map((n) => (
            <Stack key={n} direction="row">
              <Typography variant="caption" sx={{ flex: 1 }}>
                <i>
                  {getQuantiLabel(n as keyof DVDirectAnalysis, [
                    directAnalysis,
                  ])}
                </i>{" "}
                Estimate:
              </Typography>
              <Typography variant="caption">
                <b>{directAnalysis[n as keyof DVDirectAnalysis] as string}</b>
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Attachments
          reset={false}
          getAttachments={() =>
            api.getAttachments(
              `$filter=_cr4de_directanalysis_value eq ${directAnalysis?.cr4de_bnradirectanalysisid}`
            )
          }
          consolidateAttachment={async (attachment: DVAttachment) => {
            await api.createAttachment(
              {
                "cr4de_owner@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${attachment._cr4de_owner_value})`,
                cr4de_field: attachment.cr4de_field,
                "cr4de_referencedSource@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${attachment.cr4de_bnraattachmentid})`,
                "cr4de_riskcascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cascade.cr4de_bnrariskcascadeid})`,
              },
              null
            );

            setReloadAttachments();
          }}
          deleteAttachment={null}
        />
      </Grid>
    </Grid>
  );
}
