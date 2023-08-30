import { useState, useRef } from "react";
import {
  DIRECT_ANALYSIS_QUANTI_FIELDS,
  DVDirectAnalysis,
  FieldQuality,
} from "../../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile, DiscussionsRequired } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import {
  Grid,
  Box,
  Card,
  Stack,
  CardContent,
  Typography,
  useTheme,
  Select,
  Chip,
  MenuItem,
  CardHeader,
  Paper,
  Divider,
  CircularProgress,
  CardActions,
  Rating,
} from "@mui/material";
import { DVContact } from "../../../types/dataverse/DVContact";
import TextInputBox from "../../../components/TextInputBox";
import { getAbsoluteImpact, getImpactScale } from "../../../functions/Impact";
import { getAbsoluteProbability, getProbabilityScale, getProbabilityScaleNumber } from "../../../functions/Probability";
import { NO_COMMENT } from "../../step2A/sections/QualiTextInputBox";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import useAPI from "../../../hooks/useAPI";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LoadingButton } from "@mui/lab";
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

  if (parameter === "cb") {
    return `cr4de_cross_border_impact_quali_${scenarioLetter[scenario]}` as keyof DVDirectAnalysis;
  }

  return `cr4de_di_quali_${parameter}_${scenarioLetter[scenario]}` as keyof DVDirectAnalysis;
};

const getQuantiFieldNames = (scenario: SCENARIOS, parameter: string): (keyof DVDirectAnalysis)[] => {
  if (parameter === "dp") {
    return [`cr4de_dp_quanti_${scenarioLetter[scenario]}` as keyof DVDirectAnalysis];
  }

  if (parameter === "cb") {
    return [];
  }

  return DIRECT_ANALYSIS_QUANTI_FIELDS.filter((f) =>
    f.match(new RegExp(`cr4de_di_quanti_${parameter}.{1}_${scenarioLetter[scenario]}`, "g"))
  );
};

const getPrefix = (parameter: string, fieldName: string) => {
  if (parameter === "dp") return "DP";

  return capFirst(fieldName.slice(0, -2).slice(-2));
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

const getAverage = (fieldName: keyof DVDirectAnalysis, directAnalyses: DVDirectAnalysis[]) => {
  const good = directAnalyses.filter((da) => da[fieldName] !== null);

  if (good.length <= 0) return 0;

  const prefix = (good[0][fieldName] as string).slice(0, -1);

  return `${prefix}${good.reduce(
    (avg, cur) => avg + parseInt((cur[fieldName] as string).slice(-1), 10) / good.length,
    0
  )}`;
};

const capFirst = (s: string) => {
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

function ScenarioSection({
  riskFile,
  scenario,
  parameter,
  directAnalyses,
  initialOpen = false,

  reloadRiskFile,
  reloadDirectAnalyses,
}: {
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
  parameter: string;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  initialOpen?: Boolean;

  reloadRiskFile: () => void;
  reloadDirectAnalyses: () => void;
}) {
  const api = useAPI();
  const [open, setOpen] = useState(initialOpen);
  const [isSaving, setIsSaving] = useState(false);
  const [lastParam, setLastParam] = useState(parameter);
  const [discussionRequired, setDiscussionRequired] = useState(
    riskFile.cr4de_discussion_required
      ? riskFile.cr4de_discussion_required[
          `${parameter}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
        ]
      : null
  );

  const qualiName = getQualiFieldName(scenario, parameter);
  const quantiNames = getQuantiFieldNames(scenario, parameter);

  const qualiInput = useRef<null | string>(null);

  const handleSave = async (field: string, value: string | null) => {
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      [field]: value,
    });

    await reloadRiskFile();

    setIsSaving(false);
  };

  const distribution = quantiNames.reduce((dist, field) => {
    const good = directAnalyses.filter((da) => da[field] !== null);

    if (good.length <= 0) return { ...dist, [field]: { min: 0, avg: 0, max: 0 } };

    return {
      ...dist,
      [field]: good
        .map((da) => parseInt((da[field] as string).slice(-1), 10))
        .reduce(
          (dom, cur) => {
            return {
              min: cur < dom.min ? cur : dom.min,
              avg: dom.avg + cur / good.length,
              max: cur > dom.max ? cur : dom.max,
            };
          },
          {
            min: Infinity,
            avg: 0,
            max: -Infinity,
          }
        ),
    };
  }, {} as { [key in keyof DVDirectAnalysis]: { min: number; avg: number; max: number } });

  const std_avg = quantiNames.reduce((cum, field) => {
    const good = directAnalyses.filter((da) => da[field] !== null);

    if (good.length <= 0) return { ...cum, [field]: 0 };

    return {
      ...cum,
      [field]: Math.sqrt(
        good
          .map((da) => parseInt((da[field] as string).slice(-1), 10))
          .reduce((varTot, cur) => varTot + Math.pow(cur - distribution[field].avg, 2), 0) / good.length
      ),
    };
  }, {} as { [key in keyof DVDirectAnalysis]: number });
  const std = Object.values(std_avg).reduce((avg, cur, i, all) => avg + cur / all.length, 0);

  return (
    <Stack direction="column" spacing={2} sx={{ flex: open ? 1 : 0, transition: "all .3s ease" }}>
      <Paper
        sx={{
          p: 2,
          bgcolor: `${SCENARIO_PARAMS[scenario].color}`,
          color: "white",
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
          width: open ? "100%" : "150px",
          transition: "all .3s ease",
        }}
        onClick={() => setOpen(!open)}
      >
        {capFirst(scenario)}
      </Paper>

      {open && (
        <>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Below is a summary of the quantitative results for this parameter:
                </Typography>
              </Box>
              {quantiNames.length > 0 && (
                <Box sx={{ width: "100%", height: 300, mt: 4, position: "relative" }}>
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
                        data={quantiNames.map((n) => {
                          return {
                            name: `${getPrefix(parameter, n)} Input Distribution`,
                            distFloat: distribution[n].min - 0.05,
                            distBot: distribution[n].avg - distribution[n].min,
                            distAvg: 0.1,
                            distTop: distribution[n].max - distribution[n].avg,
                          };
                        })}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[-1, 6]} ticks={[0, 1, 2, 3, 4, 5]} />
                        <Tooltip
                          formatter={(value, name, props) => {
                            if (name === "Minimum") return props.payload.distFloat + 0.05;
                            if (name === "Average") return props.payload.distFloat + 0.05 + props.payload.distBot;
                            if (name === "Maximum")
                              return props.payload.distFloat + 0.05 + props.payload.distBot + props.payload.distTop;

                            return value;
                          }}
                        />
                        <Bar dataKey="distFloat" stackId="a" fill="transparent" />
                        <Bar dataKey="distBot" stackId="a" fill="#82ca9d" name="Minimum" />
                        <Bar dataKey="distAvg" stackId="a" fill="#5a9671" name="Average" />
                        <Bar dataKey="distTop" stackId="a" fill="#82ca9d" name="Maximum" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              )}

              <Stack direction="row">
                {quantiNames.length > 0 && (
                  <Stack direction="column" sx={{ mt: 2, flex: 1 }} spacing={1}>
                    {quantiNames.map((n) => (
                      <Stack direction="row">
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          Average <i>{getQuantiLabel(n, directAnalyses)}</i> Estimate:
                        </Typography>
                        <Chip label={getAverage(n, directAnalyses)} sx={{ fontWeight: "bold" }}></Chip>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>

              <Stack direction="row" sx={{ mt: 2, alignItems: "center" }}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  Divergence:
                </Typography>
                {std < 1 && <Chip label="LOW" color="success" />}
                {std >= 1 && std < 2 && <Chip label="MEDIUM" color="warning" />}
                {std >= 2 && <Chip label="HIGH" color="error" />}
              </Stack>

              <Stack direction="row" sx={{ mt: 2, alignItems: "center" }}>
                <Typography variant="body1" sx={{ flex: 1 }}>
                  Discussion Needed:
                </Typography>
                <Select
                  value={discussionRequired || "unknown"}
                  sx={{ width: 200 }}
                  onChange={async (e) => {
                    setDiscussionRequired(e.target.value as DiscussionRequired);
                    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
                      cr4de_discussion_required: JSON.stringify({
                        ...riskFile.cr4de_discussion_required,
                        [`${parameter}_${SCENARIO_PARAMS[scenario].prefix}`]: e.target.value,
                      }),
                    });
                    reloadRiskFile();
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
                initialValue={(riskFile[qualiName as keyof DVRiskFile] as string | null) || ""}
                // onSave={async (newValue) => handleSave(qualiName, newValue)}
                disabled={false}
                setUpdatedValue={(v) => {
                  qualiInput.current = v || null;
                }}
                // onSave={async (newValue) => handleSave(qualiName, newValue)}
                // disabled={false}
                reset={lastParam !== parameter}
                onReset={async (value: string | null) => {
                  await handleSave(getQualiFieldName(scenario, lastParam), value);
                  setLastParam(parameter);
                  qualiInput.current = (riskFile[qualiName as keyof DVRiskFile] as string | null) || "";
                }}
              />
            </CardContent>
            <CardActions>
              <LoadingButton loading={isSaving} onClick={() => handleSave(qualiName, qualiInput.current)}>
                Save
              </LoadingButton>
            </CardActions>
          </Card>

          <Paper sx={{ p: 2 }}>
            {directAnalyses.map((da, i, a) => (
              <>
                <ExpertInput
                  directAnalysis={da}
                  parameter={parameter}
                  qualiName={qualiName}
                  quantiNames={quantiNames}
                  scenario={scenario}
                  reloadDirectAnalyses={reloadDirectAnalyses}
                />
                {i < a.length - 1 && <Divider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />}
              </>
            ))}
          </Paper>
        </>
      )}
    </Stack>
  );
}

function ExpertInput({
  directAnalysis,
  parameter,
  qualiName,
  quantiNames,
  scenario,
  reloadDirectAnalyses,
}: {
  directAnalysis: DVDirectAnalysis<unknown, DVContact>;
  parameter: string;
  qualiName: keyof DVDirectAnalysis<unknown, unknown>;
  quantiNames: (keyof DVDirectAnalysis<unknown, unknown>)[];
  scenario: SCENARIOS;
  reloadDirectAnalyses: () => void;
}) {
  const api = useAPI();

  const [rating, setRating] = useState(
    (directAnalysis.cr4de_quality &&
      directAnalysis.cr4de_quality[`${parameter}_${SCENARIO_PARAMS[scenario].prefix}` as keyof FieldQuality]) ??
      null
  );

  return (
    <Grid container wrap="nowrap" spacing={2}>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <Stack direction="row">
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            {directAnalysis.cr4de_expert.emailaddress1} says:
          </Typography>
          <Rating
            name="size-small"
            value={rating}
            onChange={async (e, newValue) => {
              setRating(newValue);
              await api.updateDirectAnalysis(directAnalysis.cr4de_bnradirectanalysisid, {
                cr4de_quality: JSON.stringify({
                  ...directAnalysis.cr4de_quality,
                  [`${parameter}_${SCENARIO_PARAMS[scenario].prefix}`]: newValue,
                }),
              });
              reloadDirectAnalyses();
            }}
            size="small"
          />
        </Stack>
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
                  <i>{getQuantiLabel(n, [directAnalysis])}</i> Estimate:
                </Typography>
                <Typography variant="caption">
                  <b>{directAnalysis[n] as string}</b>
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}

export default function Step2APage({
  riskFile,
  participants,
  directAnalyses,

  reloadRiskFile,
  reloadDirectAnalyses,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;

  reloadRiskFile: () => void;
  reloadDirectAnalyses: () => void;
}) {
  const theme = useTheme();
  const [parameter, setParameter] = useState("dp");

  if (!riskFile || directAnalyses === null) return <LoadingTab />;

  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2} sx={{ bgcolor: theme.palette.background.paper }}>
        <Select value={parameter} sx={{ flex: 1 }} onChange={(e) => setParameter(e.target.value)}>
          <MenuItem value={"dp"}>Direct Probability</MenuItem>
          <MenuItem value={"h"}>Direct Human Impact</MenuItem>
          <MenuItem value={"s"}>Direct Societal Impact</MenuItem>
          <MenuItem value={"e"}>Direct Environmental Impact</MenuItem>
          <MenuItem value={"f"}>Direct Financial</MenuItem>
          <MenuItem value={"cb"}>Cross-border Effects</MenuItem>
        </Select>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
        <ScenarioSection
          riskFile={riskFile}
          scenario={SCENARIOS.CONSIDERABLE}
          parameter={parameter}
          directAnalyses={directAnalyses}
          initialOpen={true}
          reloadRiskFile={reloadRiskFile}
          reloadDirectAnalyses={reloadDirectAnalyses}
        />
        <ScenarioSection
          riskFile={riskFile}
          scenario={SCENARIOS.MAJOR}
          parameter={parameter}
          directAnalyses={directAnalyses}
          reloadRiskFile={reloadRiskFile}
          reloadDirectAnalyses={reloadDirectAnalyses}
        />
        <ScenarioSection
          riskFile={riskFile}
          scenario={SCENARIOS.EXTREME}
          parameter={parameter}
          directAnalyses={directAnalyses}
          reloadRiskFile={reloadRiskFile}
          reloadDirectAnalyses={reloadDirectAnalyses}
        />
      </Stack>
    </Stack>
  );
}
