import { Alert, Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../../functions/scenarios";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import { useState } from "react";
import CapacitiesSection from "./CapacitiesSection";
import ActionsSection from "./PreferredActionsSection";
import MMSankeyDiagram from "./MMSankeyDiagram";
import MMImpactSection from "./MMImpactSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import MMAnalysisTutorial from "./MMAnalysisTutorial";
import { Cascades } from "../../../functions/cascades";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import RiskFileBibliography from "../../../components/RiskFileBibliography";

export default function ManMade({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
}) {
  const { t } = useTranslation();
  const api = useAPI();

  const MRS = riskFile.cr4de_mrs || SCENARIOS.EXTREME;
  const [scenario, setScenario] = useState(MRS);

  const rf = riskFile;

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}
          </Typography>

          <MMSankeyDiagram
            riskFile={riskFile}
            cascades={cascades}
            manmade
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
          <Box className="mrag" sx={{ mt: 8 }}>
            <Typography variant="h5">
              {t("Most Relevant Actor Group")}
            </Typography>

            <ScenarioMatrix riskFile={riskFile} mrs={MRS} />

            <CapacitiesSection riskFile={rf} scenario={MRS} />
          </Box>
        )}

        <Box className="actions-assess" sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("Preferred Malicious Actions")}
          </Typography>

          <ActionsSection riskFile={rf} />
        </Box>

        <Box className="impact-assess" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Other Impactful Actions")}</Typography>

          <MMImpactSection riskFile={rf} />
        </Box>

        <RiskFileBibliography risk={riskFile} />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskFile, api)}
          HelpComponent={MMAnalysisTutorial}
        />
      </Box>
    </>
  );
}
