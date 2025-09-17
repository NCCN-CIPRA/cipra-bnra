import { Alert, Box, Typography } from "@mui/material";
import { SCENARIOS } from "../../../functions/scenarios";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Scenario from "./Scenario";
import { useState } from "react";
import ProbabilitySection from "./ProbabilitySection";
import ImpactSection from "./ImpactSection";
import CBSection from "./CBSection";
import DisclaimerSection from "../DisclaimerSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import StandardAnalysisTutorial from "./StandardAnalysisTutorial";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import SankeyDiagram from "./SankeyDiagram";
import RiskFileBibliography from "../../../components/RiskFileBibliography";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../BasePage";
import { CascadeSnapshots } from "../../../functions/cascades";

export default function Standard({
  riskSummary,
  riskFile,
  cascades,
}: {
  riskSummary: DVRiskSummary;
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
}) {
  const { environment } = useOutletContext<BasePageContext>();
  const { t } = useTranslation();
  const api = useAPI();

  const MRS = riskSummary.cr4de_mrs || SCENARIOS.EXTREME;
  const [scenario, setScenario] = useState(MRS);

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskSummary} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          {t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}
        </Typography>

        <SankeyDiagram
          riskSummary={riskSummary}
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

      {riskFile.cr4de_intensity_parameters && (
        <Box className="mrs" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Most Relevant Scenario")}</Typography>

          <ScenarioMatrix riskFile={riskFile} mrs={MRS} />

          {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

          <Scenario riskFile={riskFile} scenario={MRS} />
        </Box>
      )}

      <DisclaimerSection riskFile={riskFile} />

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
          <ProbabilitySection riskFile={riskFile} />
        </Box>
      </Box>

      <Box className="impact-assess" sx={{ mt: 8 }}>
        <Typography variant="h5">{t("Impact Assessment")}</Typography>

        <ImpactSection riskFile={riskFile} impactName="human" />

        <ImpactSection riskFile={riskFile} impactName="societal" />

        <ImpactSection riskFile={riskFile} impactName="environmental" />

        <ImpactSection riskFile={riskFile} impactName="financial" />

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
          <CBSection riskFile={riskFile} />
        </Box>
      </Box>

      <RiskFileBibliography risk={riskSummary} />

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={handleExportRiskfile(riskSummary, api, environment)}
        HelpComponent={StandardAnalysisTutorial}
      />
    </Box>
  );
}
