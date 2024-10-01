import { Box, Stack, Typography } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { CategoryIcon, RiskTypeIcon } from "../functions/getCategoryColor";
import { useTranslation } from "react-i18next";

export default function RiskFileTitle({ riskFile }: { riskFile: DVRiskFile }) {
  const { t } = useTranslation();

  return (
    <Box className="risk-title" sx={{ mb: 8 }}>
      <Typography variant="h2">{t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title)}</Typography>
      <Stack direction="row" sx={{ mt: 1 }} columnGap={1}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && <RiskTypeIcon riskFile={riskFile} />}
        <CategoryIcon category={riskFile.cr4de_risk_category} />
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && <RiskTypeIcon riskFile={riskFile} />}
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
