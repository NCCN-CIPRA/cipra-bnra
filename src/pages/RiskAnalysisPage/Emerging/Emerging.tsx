import { Box, Typography } from "@mui/material";
import CatalyzingSection from "./CatalyzingSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import EmergingAnalysisTutorial from "./EmergingAnalysisTutorial";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import RiskFileBibliography from "../../../components/RiskFileBibliography";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import { DVCascadeSnapshot } from "../../../types/dataverse/DVCascadeSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../BasePage";
import { useQuery } from "@tanstack/react-query";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

export default function Emerging({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const { user, environment, riskSummaryMap } =
    useOutletContext<BasePageContext>();

  const { t } = useTranslation();
  const api = useAPI();
  console.log(riskSummary);
  const { data: cascadeSnapshots } = useQuery<
    DVCascadeSnapshot<unknown, DVRiskSummary, SmallRisk>[]
  >({
    queryKey: [
      DataTable.CASCADE_SNAPSHOT,
      "emerging",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getCascadeSnapshots(
        `$filter=_cr4de_cause_risk_value eq ${riskSummary._cr4de_risk_file_value}&$select=cr4de_description,_cr4de_effect_risk_value`,
      ),
    select: (d) =>
      d.map((d) => ({
        ...d,
        cr4de_removed: false,
        cr4de_cause_risk: riskSummary,
        cr4de_effect_risk: riskSummaryMap[d._cr4de_effect_risk_value],
      })),
    enabled: Boolean(user && user.roles.verified),
  });

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskSummary} />

        <Box className="catalyzing" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Catalysing Effects")}</Typography>

          <CatalyzingSection cascades={cascadeSnapshots || []} />
        </Box>

        <RiskFileBibliography risk={riskSummary} />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskSummary, api, environment)}
          HelpComponent={EmergingAnalysisTutorial}
        />
      </Box>
    </>
  );
}
