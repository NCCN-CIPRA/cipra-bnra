import { Stack, Typography, Box } from "@mui/material";
import { SCENARIOS } from "../../../functions/scenarios";
import ProbabilityBars from "../../../components/charts/ProbabilityBars";
import ImpactBarChart from "../../../components/charts/ImpactBars";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ProbabilitySankeyBox } from "../../../components/charts/ProbabilitySankey";
import { ImpactSankeyBox } from "../../../components/charts/ImpactSankey";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import { ScenarioButtons } from "../../../components/ScenarioButtons";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";
import {
  pScale5FromReturnPeriodMonths,
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
} from "../../../functions/indicators/probability";
import { BasePageContext } from "../../BasePage";
import { Indicators } from "../../../types/global";
import { DAMAGE_INDICATOR, IMPACT_CATEGORY } from "../../../functions/Impact";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";

export default function SankeyDiagram({
  riskSummary,
  riskFile,
  scenario,
  results,
  setScenario,
}: {
  riskSummary: DVRiskSummary;
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
  setScenario: (s: SCENARIOS) => void;
  debug?: boolean;
}) {
  const { indicators } = useOutletContext<BasePageContext>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [focusedImpact, setFocusedImpact] = useState<
    null | IMPACT_CATEGORY | DAMAGE_INDICATOR
  >(null);

  useEffect(() => {
    setScenario(scenario);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFile]);

  const goToRiskFile = (id: string) => {
    navigate(`/risks/${id}/analysis`);
  };

  let tp;
  if (indicators === Indicators.V2) {
    if (results) {
      tp = pScale7FromReturnPeriodMonths(
        returnPeriodMonthsFromYearlyEventRate(
          results[scenario].probabilityStatistics!.sampleMean,
        ),
        100,
      );
    } else {
      tp = riskFile.cr4de_quanti[scenario].tp.yearly.scale;
    }
  } else {
    if (results) {
      tp = pScale5FromReturnPeriodMonths(
        returnPeriodMonthsFromYearlyEventRate(
          results[scenario].probabilityStatistics!.sampleMean,
        ),
        100,
      );
    } else {
      tp = riskFile.cr4de_quanti[scenario].tp.scale5TP;
    }
  }

  return (
    <Stack className="bnra-sankey" direction="row" sx={{ mb: 8 }}>
      <Box
        className="sankey-probability"
        sx={{ width: "calc(50% - 150px)", height: 600 }}
      >
        <ProbabilitySankeyBox
          riskSummary={riskSummary}
          riskSnapshot={riskFile}
          scenario={scenario}
          results={results}
          onClick={goToRiskFile}
        />
      </Box>
      <Stack
        className="sankey-charts"
        direction="column"
        justifyContent="center"
        sx={{ width: 300, p: "50px" }}
      >
        <Box
          className="sankey-probability-bars"
          sx={{
            width: "100%",
          }}
        >
          <ProbabilityBars tp={tp} chartWidth={200} />
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
          <ScenarioButtons scenario={scenario} setScenario={setScenario} />
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
          <ImpactBarChart
            riskFile={riskFile}
            scenario={scenario}
            results={results}
            focusedImpact={focusedImpact}
            onClickBar={(i: IMPACT_CATEGORY | DAMAGE_INDICATOR) => {
              if (focusedImpact === i) {
                setFocusedImpact(null);
              } else {
                setFocusedImpact(i);
              }
            }}
          />
        </Box>
      </Stack>
      <Box
        className="sankey-impact"
        sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}
      >
        <ImpactSankeyBox
          riskSummary={riskSummary}
          riskSnapshot={riskFile}
          scenario={scenario}
          results={results}
          focusedImpact={focusedImpact}
          onClick={goToRiskFile}
        />
      </Box>
    </Stack>
  );
}
