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
import { snapshotFromRiskCascade } from "../../../functions/snapshot";
import { Environment } from "../../../types/global";
import { parseCascadeSnapshot } from "../../../types/dataverse/DVRiskCascade";

export default function Emerging({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const { user, environment, smallRiskMap } =
    useOutletContext<BasePageContext>();

  const { t } = useTranslation();
  const api = useAPI();

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
    select: (data) =>
      data.map((d) => ({
        ...d,
        cr4de_removed: false,
        cr4de_cause_risk: riskSummary,
        cr4de_effect_risk: smallRiskMap[d._cr4de_effect_risk_value],
      })),
    enabled: Boolean(
      user && user.roles.verified && environment === Environment.PUBLIC,
    ),
  });

  const { data: cascades } = useQuery({
    queryKey: [
      DataTable.RISK_CASCADE,
      "emerging",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getRiskCascades(
        `$filter=_cr4de_cause_hazard_value eq ${riskSummary._cr4de_risk_file_value}`,
      ),
    select: (data) =>
      data
        .map((d) => parseCascadeSnapshot(snapshotFromRiskCascade(d)))
        .map(
          (d) =>
            ({
              ...d,
              cr4de_removed: false,
              cr4de_cause_risk: riskSummary,
              cr4de_effect_risk: smallRiskMap[d._cr4de_effect_risk_value],
            }) as DVCascadeSnapshot<unknown, DVRiskSummary, SmallRisk>,
        ),
    enabled: Boolean(
      user && user.roles.analist && environment === Environment.DYNAMIC,
    ),
  });

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskSummary={riskSummary} />

        <Box className="catalyzing" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Catalysing Effects")}</Typography>

          <CatalyzingSection
            cascades={
              (environment === Environment.DYNAMIC
                ? cascades
                : cascadeSnapshots) || []
            }
          />
        </Box>

        <RiskFileBibliography riskFileId={riskSummary._cr4de_risk_file_value} />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskSummary, api, environment)}
          HelpComponent={EmergingAnalysisTutorial}
        />
      </Box>
    </>
  );
}
