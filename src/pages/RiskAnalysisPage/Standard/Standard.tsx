import { Alert, Box, Typography } from "@mui/material";
import { SCENARIOS } from "../../../functions/scenarios";
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
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";
import {
  pScale7FromReturnPeriodMonths,
  pTimeframeFromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
} from "../../../functions/indicators/probability";

export default function Standard({
  riskSummary,
  riskFile,
  results,
}: {
  riskSummary: DVRiskSummary;
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
  results: RiskFileQuantiResults | null;
}) {
  const { environment } = useOutletContext<BasePageContext>();
  const { t } = useTranslation();
  const api = useAPI();

  const MRS = riskSummary.cr4de_mrs || SCENARIOS.EXTREME;
  const [scenario, setScenario] = useState(MRS);

  const meanDailyP =
    results?.[riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE]
      .probabilityStatistics?.sampleMean || 0;

  const p7 = pScale7FromReturnPeriodMonths(
    returnPeriodMonthsFromYearlyEventRate(meanDailyP),
  );
  const rp = returnPeriodMonthsFromYearlyEventRate(meanDailyP);
  const pYearly = pTimeframeFromReturnPeriodMonths(rp, 12);

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskSummary={riskSummary} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          {t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}
        </Typography>

        <SankeyDiagram
          riskSummary={riskSummary}
          riskFile={riskFile}
          scenario={scenario}
          results={results}
          setScenario={setScenario}
        />
      </Box>

      {scenario !== MRS && (
        <Box>
          <Alert severity="warning">
            {t(
              "risks.analysis.scenarioChange",
              "You have changed the scenario is the sankey diagram above. Please be aware the the qualitative analysis results below only apply to the Most Relevant Scenario.",
            )}
          </Alert>
        </Box>
      )}

      {riskFile.cr4de_intensity_parameters && (
        <Box className="mrs" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Most Relevant Scenario")}</Typography>

          {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

          <Scenario riskFile={riskFile} scenario={MRS} results={results} />
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
          <Typography variant="body1" sx={{ mb: 2 }}>
            This risk scenario scores a <b>{p7}/7</b> on the probability scale,
            which represents an estimated <b>{Math.round(100 * pYearly)}%</b>{" "}
            chance for an{" "}
            <i>
              {riskFile.cr4de_mrs} {riskFile.cr4de_title.toLocaleLowerCase()}
            </i>{" "}
            to occur in the next year. This is equivalent to a return period of
            approximately <b>{Math.round(rp)} months</b>.
          </Typography>
          <ProbabilitySection riskFile={riskFile} results={results} />
        </Box>
      </Box>

      <Box className="impact-assess" sx={{ mt: 8 }}>
        <Typography variant="h5">{t("Impact Assessment")}</Typography>

        <ImpactSection
          riskFile={riskFile}
          impactName="human"
          results={results}
        />

        <ImpactSection
          riskFile={riskFile}
          impactName="societal"
          results={results}
        />

        <ImpactSection
          riskFile={riskFile}
          impactName="environmental"
          results={results}
        />

        <ImpactSection
          riskFile={riskFile}
          impactName="financial"
          results={results}
        />

        <CBSection riskFile={riskFile} />
      </Box>

      <RiskFileBibliography riskFileId={riskSummary._cr4de_risk_file_value} />

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={handleExportRiskfile(riskSummary, api, environment)}
        HelpComponent={StandardAnalysisTutorial}
      />
    </Box>
  );
}
