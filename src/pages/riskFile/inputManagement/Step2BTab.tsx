import { useState, useRef, useEffect } from "react";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import {
  Grid,
  Box,
  Card,
  Stack,
  CardContent,
  Typography,
  useTheme,
  Container,
  Chip,
  MenuItem,
  CardHeader,
  Paper,
  Divider,
  Select,
  CircularProgress,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CardActions,
  Button,
  Rating,
} from "@mui/material";
import { DVContact } from "../../../types/dataverse/DVContact";
import TextInputBox from "../../../components/TextInputBox";
import { getAbsoluteImpact, getImpactScale } from "../../../functions/Impact";
import { getAbsoluteProbability, getProbabilityScale, getProbabilityScaleNumber } from "../../../functions/Probability";
import { NO_COMMENT } from "../../step2A/sections/QualiTextInputBox";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import useAPI from "../../../hooks/useAPI";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import CascadeMatrix from "../../step2B/information/CascadeMatrix";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { LoadingButton } from "@mui/lab";
import ScenarioTable from "../../step2A/information/ScenarioTable";
import { ScenarioInput, ScenarioInputs } from "../../step2A/fields";
import { avg, getAverage, getCADivergence, getDADivergence } from "../../../functions/inputProcessing";
import { DiscussionRequired } from "../../../types/DiscussionRequired";

const scenarioLetter = {
  [SCENARIOS.CONSIDERABLE]: "c",
  [SCENARIOS.MAJOR]: "m",
  [SCENARIOS.EXTREME]: "e",
};

const getQualiFieldName = (scenario: SCENARIOS, parameter: string): keyof DVDirectAnalysis => {
  if (parameter === "dp") {
    return `cr4de_dp_quali_${scenarioLetter[scenario]}` as keyof DVDirectAnalysis;
  }

  return `cr4de_di_quali_${parameter}_${scenarioLetter[scenario]}` as keyof DVDirectAnalysis;
};

const getQuantiFieldNames = (scenario: SCENARIOS, parameter: string): (keyof DVDirectAnalysis)[] => {
  if (parameter === "dp") {
    return [`cr4de_dp_quanti_${scenarioLetter[scenario]}` as keyof DVDirectAnalysis];
  }

  return DIRECT_ANALYSIS_QUANTI_FIELDS.filter((f) =>
    f.match(new RegExp(`cr4de_di_quanti_${parameter}.{1}_${scenarioLetter[scenario]}`, "g"))
  );
};

const getQuantiLabel = (fieldName: keyof DVDirectAnalysis, directAnalyses: DVDirectAnalysis[]) => {
  const good = directAnalyses.filter((da) => da[fieldName] !== null);

  if (good.length <= 0) return 0;

  const prefix = (good[0][fieldName] as string).slice(0, -1);

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
  }[prefix];
};

const capFirst = (s: string) => {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export default function Step2BTab({
  riskFile,
  cascades,
  directAnalyses,
  cascadeAnalyses,

  reloadRiskFile,
  reloadCascades,
  reloadCascadeAnalyses,
}: {
  riskFile: DVRiskFile | null;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;

  reloadRiskFile: () => void;
  reloadCascades: () => void;
  reloadCascadeAnalyses: () => void;
}) {
  const theme = useTheme();
  const api = useAPI();

  const [cascadeIndex, setCascadeIndex] = useState<number | null>(null);
  const [lastCascadeIndex, setLastCascadeIndex] = useState(0);
  const [consensus, setConsensus] = useState<DVCascadeAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [discussionRequired, setDiscussionRequired] = useState<DiscussionRequired | null>(null);

  const qualiInput = useRef<null | string>(null);

  useEffect(() => {
    if (cascades !== null && riskFile !== null && cascadeIndex === null) {
      const causeIndex = cascades.findIndex(
        (c) =>
          c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
          c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
      );
      if (causeIndex >= 0) setCascadeIndex(causeIndex);
      else if (riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING)
        setCascadeIndex(
          cascades.findIndex(
            (c) =>
              c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
              c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
          )
        );
      else setCascadeIndex(cascades.findIndex((c) => c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid));
    }
  }, [cascades, riskFile, cascadeIndex]);

  useEffect(() => {
    if (cascades === null || cascadeAnalyses === null || cascadeIndex === null) return;

    const c: any = { ...cascades[cascadeIndex] };

    for (let field of CASCADE_ANALYSIS_QUANTI_FIELDS) {
      if (c[field] === null) {
        c[field] = getProbabilityScale(
          cascadeAnalyses
            .filter((ca) => ca._cr4de_cascade_value === c.cr4de_bnrariskcascadeid && ca[field] !== null)
            .reduce((avg, ca, i, all) => avg + getAbsoluteProbability(ca[field] as string) / all.length, 0),
          "CP"
        );
      }
    }

    setConsensus(c);
    setDiscussionRequired(c.cr4de_discussion_required);
  }, [cascades, cascadeIndex, cascadeAnalyses]);

  if (
    !riskFile ||
    cascades === null ||
    directAnalyses === null ||
    cascadeAnalyses === null ||
    cascadeIndex === null ||
    consensus === null
  )
    return <LoadingTab />;
  console.log(cascades, cascadeIndex);
  const cas = cascadeAnalyses.filter(
    (ca) => ca._cr4de_cascade_value === cascades[cascadeIndex].cr4de_bnrariskcascadeid
  );

  const causes = cascades.filter(
    (c) =>
      c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
  );
  const catalyzingEffects = cascades.filter(
    (c) =>
      c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
  );
  const catalyzedRisks = cascades.filter(
    (c) => c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid && riskFile.cr4de_risk_type === RISK_TYPE.EMERGING
  );

  const cascade = cascades[cascadeIndex];

  const handleSave = async (innerCascadeIndex: number) => {
    setIsSaving(true);

    await api.updateCascade(cascades[innerCascadeIndex].cr4de_bnrariskcascadeid, {
      cr4de_quali: qualiInput.current,
    });

    await reloadCascades();

    setIsSaving(false);
  };

  const divergence =
    cascades[cascadeIndex].cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0
      ? avg([
          getDADivergence(directAnalyses, SCENARIOS.CONSIDERABLE, { name: "dp50", label: "" }),
          getDADivergence(directAnalyses, SCENARIOS.MAJOR, { name: "dp50", label: "" }),
          getDADivergence(directAnalyses, SCENARIOS.EXTREME, { name: "dp50", label: "" }),
        ])
      : getCADivergence(cascadeAnalyses);
  console.log(divergence);
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
                {causes.map((c, i) => (
                  <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding sx={{ paddingLeft: 2 }}>
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) => (ca.cr4de_bnrariskcascadeid === c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText
                        primary={c.cr4de_cause_hazard.cr4de_title}
                        sx={{
                          fontWeight:
                            c.cr4de_bnrariskcascadeid === cascade.cr4de_bnrariskcascadeid ? "bold" : "regular",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {(catalyzingEffects.length > 0 || catalyzedRisks.length > 0) && <Divider />}
            </>
          )}
          {catalyzingEffects.length > 0 && (
            <>
              <List>
                <ListItem>
                  <Typography variant="subtitle2">Catalyzing Effects</Typography>
                </ListItem>
                {catalyzingEffects.map((c) => (
                  <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding sx={{ paddingLeft: 2 }}>
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) => (ca.cr4de_bnrariskcascadeid === c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
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
                  <Typography variant="subtitle2">Catalyzing Effects</Typography>
                </ListItem>
                {catalyzedRisks.map((c) => (
                  <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding sx={{ paddingLeft: 2 }}>
                    <ListItemButton
                      onClick={() => {
                        setCascadeIndex(
                          cascades.findIndex(
                            (ca) => (ca.cr4de_bnrariskcascadeid === c.cr4de_bnrariskcascadeid) as boolean
                          )
                        );
                      }}
                    >
                      <ListItemText primary={c.cr4de_effect_hazard.cr4de_title} />
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
          {cascade.cr4de_cause_hazard.cr4de_title} causes {cascade.cr4de_effect_hazard.cr4de_title}
        </Typography>
        <Stack spacing={4}>
          <Card>
            <CardContent>
              {riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      Below is a summary of the quantitative results for this cascade:
                    </Typography>
                  </Box>
                  {cascades[cascadeIndex].cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING && (
                    <Box sx={{ mb: 8 }}>
                      <CascadeMatrix
                        cascadeAnalysis={consensus as DVCascadeAnalysis}
                        cause={cascades[cascadeIndex].cr4de_cause_hazard as DVRiskFile}
                        effect={riskFile}
                        onChangeScenario={() => {}}
                      />
                    </Box>
                  )}

                  {cascades[cascadeIndex].cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 && (
                    <ScenarioTable
                      inputs={
                        {
                          considerable: {
                            cr4de_dp50_quanti: getAverage(directAnalyses.map((da) => da.cr4de_dp50_quanti_c)),
                          },
                          major: {
                            cr4de_dp50_quanti: getAverage(directAnalyses.map((da) => da.cr4de_dp50_quanti_m)),
                          },
                          extreme: {
                            cr4de_dp50_quanti: getAverage(directAnalyses.map((da) => da.cr4de_dp50_quanti_e)),
                          },
                        } as unknown as ScenarioInputs
                      }
                      fields={["cr4de_dp50_quanti" as keyof ScenarioInput]}
                    />
                  )}

                  <Stack direction="row" sx={{ mt: 2, alignItems: "center" }}>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      Divergence:
                    </Typography>
                    {divergence < 0.2 && <Chip label="LOW" color="success" />}
                    {divergence >= 0.2 && divergence < 0.4 && <Chip label="MEDIUM" color="warning" />}
                    {divergence >= 0.4 && <Chip label="HIGH" color="error" />}
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
                  onChange={async (e) => {
                    setDiscussionRequired(e.target.value as DiscussionRequired);
                    await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
                      cr4de_discussion_required: e.target.value,
                    });
                    reloadCascades();
                  }}
                >
                  <MenuItem value="unknown">Unknown</MenuItem>
                  <MenuItem value={DiscussionRequired.REQUIRED}>Required</MenuItem>
                  <MenuItem value={DiscussionRequired.PREFERRED}>Preferred</MenuItem>
                  <MenuItem value={DiscussionRequired.NOT_NECESSARY}>Unnecessary</MenuItem>
                </Select>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  The field below can be used to summarize the qualitative responses of the experts or to prepare for
                  the consensus meeting:
                </Typography>
              </Box>
              <TextInputBox
                initialValue={(cascade.cr4de_quali as string | null) || ""}
                setUpdatedValue={(v) => {
                  qualiInput.current = v || null;
                }}
                // onSave={async (newValue) => handleSave(qualiName, newValue)}
                // disabled={false}
                reset={lastCascadeIndex !== cascadeIndex}
                onReset={async (value: string | null) => {
                  setLastCascadeIndex(cascadeIndex);
                  // await handleSave(lastCascadeIndex);
                  qualiInput.current = cascade.cr4de_quali;
                }}
              />
            </CardContent>
            <CardActions>
              <LoadingButton loading={isSaving} onClick={() => handleSave(cascadeIndex)}>
                Save
              </LoadingButton>
            </CardActions>
          </Card>

          <Paper sx={{ p: 2 }}>
            {cas.map((ca, i, a) => (
              <>
                <ExpertInput
                  riskFile={riskFile}
                  cascade={cascade}
                  directAnalysis={
                    directAnalyses.find(
                      (da) => (da._cr4de_expert_value === ca._cr4de_expert_value) as boolean
                    ) as DVDirectAnalysis
                  }
                  cascadeAnalysis={ca}
                  reloadCascadeAnalyses={reloadCascadeAnalyses}
                />
                {i < a.length - 1 && <Divider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />}
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
  reloadCascadeAnalyses,
}: {
  riskFile: DVRiskFile;
  cascade: DVRiskCascade<SmallRisk, SmallRisk>;
  directAnalysis: DVDirectAnalysis;
  cascadeAnalysis: DVCascadeAnalysis<unknown, unknown, DVContact>;
  reloadCascadeAnalyses: () => void;
}) {
  const api = useAPI();
  const [rating, setRating] = useState(cascadeAnalysis.cr4de_quality);
  const [lastCascadeAnalysis, setLastCascadeAnalysis] = useState(cascadeAnalysis);

  useEffect(() => {
    if (cascadeAnalysis !== lastCascadeAnalysis) {
      setLastCascadeAnalysis(cascadeAnalysis);
      setRating(cascadeAnalysis.cr4de_quality);
    }
  }, [cascadeAnalysis]);

  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <Stack direction="row">
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            {cascadeAnalysis.cr4de_expert.emailaddress1} says:
          </Typography>
          <Rating
            name="size-small"
            value={rating}
            onChange={async (e, newValue) => {
              setRating(newValue);
              await api.updateCascadeAnalysis(cascadeAnalysis.cr4de_bnracascadeanalysisid, {
                cr4de_quality: newValue,
              });
              reloadCascadeAnalyses();
            }}
            size="small"
          />
        </Stack>

        {cascade.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING && (
          <Box sx={{ mb: 8 }}>
            <CascadeMatrix
              cascadeAnalysis={cascadeAnalysis}
              cause={riskFile}
              effect={cascade.cr4de_effect_hazard as DVRiskFile}
              onChangeScenario={() => {}}
            />
          </Box>
        )}
        {cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 && (
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
        {cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0 && (
          <Box
            dangerouslySetInnerHTML={{ __html: (cascadeAnalysis.cr4de_quali_cascade || "") as string }}
            sx={{ mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
          />
        )}
        {cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0 && (
          <Box
            dangerouslySetInnerHTML={{
              __html: (directAnalysis.cr4de_dp50_quali || "") as string,
            }}
            sx={{ mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
          />
        )}
      </Grid>
    </Grid>
  );
}
