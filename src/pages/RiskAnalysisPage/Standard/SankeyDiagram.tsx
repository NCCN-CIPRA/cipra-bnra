import { Stack, Typography, Box, Button } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import ProbabilityBars from "../../../components/charts/ProbabilityBars";
import ImpactBarChart from "../../../components/charts/ImpactBars";
import { useNavigate } from "react-router-dom";
import ProbabilitySankey from "../../../components/charts/ProbabilitySankey";
import ImpactSankey from "../../../components/charts/ImpactSankey";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";

export default function SankeyDiagram({
  riskSummary,
  riskFile,
  scenario,
  setScenario,
  debug = false,
}: {
  riskSummary: DVRiskSummary;
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
  scenario: SCENARIOS;
  setScenario: (s: SCENARIOS) => void;
  debug?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setScenario(scenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFile]);

  const goToRiskFile = (id: string) => {
    navigate(`/risks/${id}/analysis`);
  };

  return (
    <Stack className="bnra-sankey" direction="row" sx={{ mb: 8 }}>
      <Box
        className="sankey-probability"
        sx={{ width: "calc(50% - 150px)", height: 600 }}
      >
        <ProbabilitySankey
          riskSummary={riskSummary}
          riskFile={riskFile}
          maxCauses={null}
          shownCausePortion={0.8}
          minCausePortion={null}
          scenario={scenario}
          onClick={goToRiskFile}
          debug={debug}
          manmade={false}
        />
      </Box>
      <Stack
        className="sankey-charts"
        direction="column"
        justifyContent="center"
        sx={{ width: 300, p: "50px" }}
      >
        {/* <Box
        sx={{
          width: 200,
          height: 200,
        }}
      >
        <ProbabilityOriginPieChart riskFile={riskFile} />
      </Box>
      <Box
        sx={{
          width: 200,
          height: 200,
        }}
      >
        <ImpactOriginPieChart riskFile={riskFile} />
      </Box> */}
        {/* <Box sx={{ width: "100%", textAlign: "center", mb: 6 }}>
          <Typography variant="h6">{calculation.riskTitle}</Typography>
        </Box> */}
        <Box
          className="sankey-probability-bars"
          sx={{
            width: "100%",
          }}
        >
          <ProbabilityBars
            tp={riskFile.cr4de_quanti[scenario].tp.yearly.scale || 0}
            chartWidth={200}
          />
        </Box>
        <Box
          className="sankey-scenarios"
          sx={{
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mt: 0, mb: 1 }}>
            <Typography variant="subtitle2">{t("Scenario")}</Typography>
          </Box>
          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                fontWeight:
                  scenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
                opacity: scenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
                borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                borderRadius: "50%",
                backgroundColor: `${
                  SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
                }20`,
                width: 48,
                minWidth: 48,
                height: 48,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: `${
                    SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
                  }20`,
                  borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                },
              }}
              onClick={() => setScenario(SCENARIOS.CONSIDERABLE)}
            >
              C
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                fontWeight: scenario === SCENARIOS.MAJOR ? "bold" : "normal",
                opacity: scenario === SCENARIOS.MAJOR ? 1 : 0.3,
                borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                borderRadius: "50%",
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
                width: 48,
                minWidth: 48,
                height: 48,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: `${
                    SCENARIO_PARAMS[SCENARIOS.MAJOR].color
                  }20`,
                  borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                },
              }}
              onClick={() => setScenario(SCENARIOS.MAJOR)}
            >
              M
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                fontWeight: scenario === SCENARIOS.EXTREME ? "bold" : "normal",
                opacity: scenario === SCENARIOS.EXTREME ? 1 : 0.15,
                borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                borderRadius: "50%",
                backgroundColor: `${
                  SCENARIO_PARAMS[SCENARIOS.EXTREME].color
                }20`,
                width: 48,
                minWidth: 48,
                height: 48,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: `${
                    SCENARIO_PARAMS[SCENARIOS.EXTREME].color
                  }20`,
                  borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                },
              }}
              onClick={() => setScenario(SCENARIOS.EXTREME)}
            >
              E
            </Button>
          </Stack>
        </Box>
        <Box
          className="category-impacts"
          sx={{
            width: "100%",
            height: 350,
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mt: 3 }}>
            <Typography variant="subtitle2">
              {t("Damage Indicators")}
            </Typography>
          </Box>
          <ImpactBarChart riskFile={riskFile} scenario={scenario} />
        </Box>
      </Stack>
      <Box
        className="sankey-impact"
        sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}
      >
        <ImpactSankey
          riskSummary={riskSummary}
          riskFile={riskFile}
          maxEffects={null}
          shownEffectPortion={0.8}
          minEffectPortion={null}
          scenario={scenario}
          onClick={goToRiskFile}
          debug={debug}
        />
      </Box>
    </Stack>
  );
}
