import { Alert, Box, Typography } from "@mui/material";
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
import { CascadeSnapshots } from "../../../functions/cascades";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import RiskFileBibliography from "../../../components/RiskFileBibliography";
// import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../BasePage";

export default function ManMade({
  riskSummary,
  riskFile,
  cascades,
}: {
  riskSummary: DVRiskSummary;
  riskFile: DVRiskSnapshot;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
}) {
  const { environment } = useOutletContext<BasePageContext>();
  const { t } = useTranslation();
  const api = useAPI();

  const MRS = riskSummary.cr4de_mrs || SCENARIOS.EXTREME;
  const [scenario, setScenario] = useState(MRS);

  const rf = riskFile;

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskSummary} />

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}
          </Typography>

          <MMSankeyDiagram
            riskSummary={riskSummary}
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

            <CapacitiesSection riskFile={riskFile} scenario={MRS} />
          </Box>
        )}

        <Box className="actions-assess" sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("Preferred Malicious Actions")}
          </Typography>

          <ActionsSection riskFile={riskFile} />
        </Box>

        <Box className="impact-assess" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Other Impactful Actions")}</Typography>

          <MMImpactSection riskFile={riskFile} />
        </Box>

        <RiskFileBibliography risk={riskSummary} />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskSummary, api, environment)}
          HelpComponent={MMAnalysisTutorial}
        />
      </Box>
    </>
  );
}
