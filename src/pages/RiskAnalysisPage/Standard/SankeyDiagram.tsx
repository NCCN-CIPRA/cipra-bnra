import { Stack, Typography, Box } from "@mui/material";
import { SCENARIOS } from "../../../functions/scenarios";
import ProbabilityBars from "../../../components/charts/ProbabilityBars";
import ImpactBarChart from "../../../components/charts/ImpactBars";
import { useNavigate } from "react-router-dom";
import { ProbabilitySankeyBox } from "../../../components/charts/ProbabilitySankey";
import { ImpactSankeyBox } from "../../../components/charts/ImpactSankey";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import { CascadeSnapshots } from "../../../functions/cascades";
import { ScenarioButtons } from "../../../components/ScenarioButtons";

export default function SankeyDiagram({
  riskFile,
  cascades,
  scenario,
  setScenario,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
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
        <ProbabilitySankeyBox
          riskSnapshot={riskFile}
          cascades={cascades}
          scenario={scenario}
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
          <ImpactBarChart riskFile={riskFile} scenario={scenario} />
        </Box>
      </Stack>
      <Box
        className="sankey-impact"
        sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}
      >
        <ImpactSankeyBox
          riskSnapshot={riskFile}
          cascades={cascades}
          scenario={scenario}
          onClick={goToRiskFile}
        />
      </Box>
    </Stack>
  );
}
