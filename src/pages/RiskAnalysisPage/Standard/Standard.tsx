import { Alert, Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { getScenarioSuffix, SCENARIOS } from "../../../functions/scenarios";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Scenario from "./Scenario";
import { lazy, Suspense, useState } from "react";
import ProbabilitySection from "./ProbabilitySection";
import ImpactSection from "./ImpactSection";
import CBSection from "./CBSection";
import DisclaimerSection from "../DisclaimerSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import StandardAnalysisTutorial from "./StandardAnalysisTutorial";
import { Cascades } from "../../../functions/cascades";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import SankeyDiagram from "./SankeyDiagram";
import RiskFileBibliography from "../../../components/RiskFileBibliography";

export default function Standard({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
}) {
  const { t } = useTranslation();
  const api = useAPI();

  const MRS = riskFile.cr4de_mrs || SCENARIOS.EXTREME;
  const MRSSuffix = getScenarioSuffix(MRS);
  const [scenario, setScenario] = useState(MRS);

  const rf = riskFile;

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">
          {t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}
        </Typography>

        <SankeyDiagram
          riskFile={riskFile}
          cascades={cascades}
          scenario={scenario}
          setScenario={setScenario}
        />
      </Box>

      {scenario !== MRS && (
        <Box>
          <Alert severity="warning">
            {t(
              "risks.analysis.scenarioChange",
              "You have changed the scenario is the sankey diagram above. Please be aware the the qualitative analysis results below only apply to the Most Relevant Scenario."
            )}
          </Alert>
        </Box>
      )}

      {rf.cr4de_intensity_parameters && (
        <Box className="mrs" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Most Relevant Scenario")}</Typography>

          <ScenarioMatrix riskFile={riskFile} mrs={MRS} />

          {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

          <Scenario riskFile={rf} scenario={MRS} />
        </Box>
      )}

      <DisclaimerSection riskFile={rf} />

      <Box className="probability-assess" sx={{ mt: 8, clear: "both" }}>
        <Typography variant="h5">{t("Probability Assessment")}</Typography>
        <Box
          sx={{
            borderLeft: "solid 8px #eee",
            px: 2,
            py: 2,
            mt: 2,
            backgroundColor: "white",
          }}
        >
          <ProbabilitySection riskFile={rf} />
        </Box>
      </Box>

      <Box className="impact-assess" sx={{ mt: 8 }}>
        <Typography variant="h5">{t("Impact Assessment")}</Typography>

        <ImpactSection riskFile={rf} impactName="human" />

        <ImpactSection riskFile={rf} impactName="societal" />

        <ImpactSection riskFile={rf} impactName="environmental" />

        <ImpactSection riskFile={rf} impactName="financial" />

        <Box
          className="cb-impact"
          sx={{
            borderLeft: "solid 8px #eee",
            px: 2,
            py: 1,
            mt: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h6">Cross-border Impact</Typography>
          <CBSection riskFile={riskFile} scenarioSuffix={MRSSuffix} />
        </Box>
      </Box>

      <RiskFileBibliography risk={riskFile} />

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={handleExportRiskfile(riskFile, api)}
        HelpComponent={StandardAnalysisTutorial}
      />
    </Box>
  );
}
