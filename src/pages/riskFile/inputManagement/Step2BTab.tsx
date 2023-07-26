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
  MenuItem,
  CardHeader,
  Paper,
  Divider,
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
  const api = useAPI();

  const [cascadeIndex, setCascadeIndex] = useState<number | null>(null);
  const [lastCascadeIndex, setLastCascadeIndex] = useState(0);
  const [consensus, setConsensus] = useState<DVCascadeAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const qualiInput = useRef<null | string>(null);

  useEffect(() => {
    if (cascades !== null && riskFile !== null && cascadeIndex === null) {
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

  const cascade = cascades[cascadeIndex];

  const handleSave = async (innerCascadeIndex: number) => {
    setIsSaving(true);

    await api.updateCascade(cascades[innerCascadeIndex].cr4de_bnrariskcascadeid, {
      cr4de_quali: qualiInput.current,
    });

    await reloadCascades();

    setIsSaving(false);
  };

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
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem>
              <Typography variant="subtitle2">Causes</Typography>
            </ListItem>
            {causes.map((c, i) => (
              <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding sx={{ paddingLeft: 2 }}>
                <ListItemButton
                  onClick={() => {
                    setCascadeIndex(
                      cascades.findIndex((ca) => (ca.cr4de_bnrariskcascadeid === c.cr4de_bnrariskcascadeid) as boolean)
                    );
                  }}
                >
                  <ListItemText
                    primary={c.cr4de_cause_hazard.cr4de_title}
                    sx={{
                      fontWeight: c.cr4de_bnrariskcascadeid === cascade.cr4de_bnrariskcascadeid ? "bold" : "regular",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <Typography variant="subtitle2">Catalyzing Effects</Typography>
            </ListItem>
            {catalyzingEffects.map((c) => (
              <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding sx={{ paddingLeft: 2 }}>
                <ListItemButton>
                  <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container>
        <Typography variant="h6" sx={{ mb: 4 }}>
          {cascade.cr4de_cause_hazard.cr4de_title} causes {cascade.cr4de_effect_hazard.cr4de_title}
        </Typography>
        <Stack spacing={4}>
          <Card>
            <CardHeader subheader="Consensus results:" />
            <CardContent>
              <CascadeMatrix
                cascadeAnalysis={consensus as DVCascadeAnalysis}
                cause={riskFile}
                effect={cascades[cascadeIndex].cr4de_effect_hazard as DVRiskFile}
                onChangeScenario={() => {}}
              />
              <Box sx={{ mt: 8 }}>
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
                    await handleSave(lastCascadeIndex);
                    qualiInput.current = cascade.cr4de_quali;
                  }}
                />
              </Box>
            </CardContent>
            <CardActions>
              <LoadingButton loading={isSaving} onClick={() => handleSave(cascadeIndex)}>
                Save
              </LoadingButton>
            </CardActions>
          </Card>
          {cas.map((c) => (
            <Card>
              <CardHeader subheader={`${c.cr4de_expert.emailaddress1} answered:`} />
              <CardContent>
                <CascadeMatrix
                  cascadeAnalysis={c}
                  cause={riskFile}
                  effect={cascades[cascadeIndex].cr4de_effect_hazard as DVRiskFile}
                  onChangeScenario={() => {}}
                />
                <Box
                  dangerouslySetInnerHTML={{ __html: (c.cr4de_quali_cascade || "") as string }}
                  sx={{ mt: 4, mb: 2, ml: 1, pl: 1, borderLeft: "4px solid #eee" }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  );
}
