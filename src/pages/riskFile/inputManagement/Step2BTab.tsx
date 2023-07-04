import { useState, useEffect } from "react";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
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
  MenuItem,
  CardHeader,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { DVContact } from "../../../types/dataverse/DVContact";
import TextInputBox from "../../../components/TextInputBox";
import { getAbsoluteImpact, getImpactScale } from "../../../functions/Impact";
import { getAbsoluteProbability, getProbabilityScale, getProbabilityScaleNumber } from "../../../functions/Probability";
import { NO_COMMENT } from "../../step2A/sections/QualiTextInputBox";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import useAPI from "../../../hooks/useAPI";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import CascadeMatrix from "../../step2B/information/CascadeMatrix";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

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

const getAverage = (fieldName: keyof DVDirectAnalysis, directAnalyses: DVDirectAnalysis[]) => {
  const good = directAnalyses.filter((da) => da[fieldName] !== null);

  if (good.length <= 0) return 0;

  const prefix = (good[0][fieldName] as string).slice(0, -1);

  const avg = directAnalyses
    .filter((da) => da[fieldName] !== null)
    .reduce((avg, da, i, a) => avg + parseFloat((da[fieldName] as string).replace(prefix, "")) / a.length, 0);

  if (["DP", "M", "CP"].indexOf(prefix) >= 0) return getProbabilityScale(avg, prefix);
  else return getImpactScale(avg, prefix);
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
}: {
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
  parameter: string;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  initialOpen?: Boolean;

  reloadRiskFile: () => void;
}) {
  const api = useAPI();
  const [open, setOpen] = useState(initialOpen);
  const [isSaving, setIsSaving] = useState(false);
  const [lastParam, setLastParam] = useState(parameter);

  const qualiName = getQualiFieldName(scenario, parameter);
  const quantiNames = getQuantiFieldNames(scenario, parameter);

  const handleSave = async (field: string, value: string | null) => {
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      [field]: value,
    });

    await reloadRiskFile();

    setIsSaving(false);
  };

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
              <TextInputBox
                initialValue={(riskFile[qualiName as keyof DVRiskFile] as string | null) || ""}
                onSave={async (newValue) => handleSave(qualiName, newValue)}
                disabled={false}
                reset={lastParam !== parameter}
                onReset={(value: string | null) => {
                  handleSave(getQualiFieldName(scenario, lastParam), value);
                  setLastParam(parameter);
                }}
              />

              <Stack direction="row">
                <Stack direction="column" sx={{ mt: 2, flex: 1 }}>
                  {quantiNames.map((n) => (
                    <Stack direction="row">
                      <Typography variant="caption" sx={{ flex: 1 }}>
                        Average <i>{getQuantiLabel(n, directAnalyses)}</i> Estimate:
                      </Typography>
                      <Typography variant="caption">
                        <b>{getAverage(n, directAnalyses)}</b>
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="column" sx={{ ml: 2, mt: 2.5, width: 32, textAlign: "right" }}>
                  {isSaving && <CircularProgress size={10} />}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Paper sx={{ p: 2 }}>
            {directAnalyses
              .filter((da) => da[qualiName] && da[qualiName] !== NO_COMMENT)
              .map((da, i, a) => (
                <>
                  <Grid container wrap="nowrap" spacing={2}>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                      <Typography variant="subtitle2">{da.cr4de_expert.emailaddress1} says:</Typography>
                      <Box
                        dangerouslySetInnerHTML={{ __html: (da[qualiName] || "") as string }}
                        sx={{ mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
                      />

                      <Stack direction="column" sx={{ mt: 2 }}>
                        {quantiNames.map((n) => (
                          <Stack direction="row">
                            <Typography variant="caption" sx={{ flex: 1 }}>
                              <i>{getQuantiLabel(n, directAnalyses)}</i> Estimate:
                            </Typography>
                            <Typography variant="caption">
                              <b>{da[n] as string}</b>
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                  {i < a.length - 1 && <Divider variant="fullWidth" sx={{ mt: 2, mb: 4 }} />}
                </>
              ))}
          </Paper>
        </>
      )}
    </Stack>
  );
}

export default function Step2BTab({
  riskFile,
  cascades,
  directAnalyses,
  cascadeAnalyses,

  reloadRiskFile,
  reloadCascades,
}: {
  riskFile: DVRiskFile | null;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;

  reloadRiskFile: () => void;
  reloadCascades: () => void;
}) {
  const theme = useTheme();

  const [cascadeIndex, setCascadeIndex] = useState(0);

  if (!riskFile || cascades === null || directAnalyses === null || cascadeAnalyses === null) return <LoadingTab />;

  const cas = cascadeAnalyses.filter(
    (ca) => ca._cr4de_cascade_value === cascades[cascadeIndex].cr4de_bnrariskcascadeid
  );

  return (
    <Container>
      <Stack spacing={4}>
        <CascadeMatrix
          cascadeAnalysis={cascades[cascadeIndex] as unknown as DVCascadeAnalysis}
          cause={riskFile}
          effect={cascades[cascadeIndex].cr4de_effect_hazard as DVRiskFile}
          onChangeScenario={() => {}}
        />
        {cas.map((c) => (
          <CascadeMatrix
            cascadeAnalysis={c}
            cause={riskFile}
            effect={cascades[cascadeIndex].cr4de_effect_hazard as DVRiskFile}
            onChangeScenario={() => {}}
          />
        ))}
      </Stack>
    </Container>
  );
}
