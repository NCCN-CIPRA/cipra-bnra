import { Box, Stack, Typography } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { CategoryIcon, RiskTypeIcon } from "../functions/getIcons";
import { useTranslation } from "react-i18next";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";

export default function RiskFileTitle({
  riskFile,
}: {
  riskFile: DVRiskFile | DVRiskSummary;
}) {
  const { t } = useTranslation();

  return (
    <Box className="risk-title" sx={{ mb: 8 }}>
      <Typography variant="h2">
        {t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title)}
      </Typography>
      <Stack direction="row" sx={{ mt: 1 }} columnGap={1}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <RiskTypeIcon riskFile={riskFile} />
        )}
        <CategoryIcon
          category={
            "cr4de_risk_category" in riskFile
              ? riskFile.cr4de_risk_category
              : riskFile.cr4de_category
          }
        />
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <RiskTypeIcon riskFile={riskFile} />
        )}
        {/* {labels.map((l) => (
            <Box sx={{ width: 30, height: 30 }}>
              <CategoryIcon category={riskFile.cr4de_risk_category} />
            </Box>
          </Tooltip>
        ))} */}
      </Stack>
    </Box>
  );
}
