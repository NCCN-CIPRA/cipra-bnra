import { Alert, Box, Stack, Typography } from "@mui/material";
import { RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { CategoryIcon, RiskTypeIcon } from "../functions/getIcons";
import { useTranslation } from "react-i18next";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import UpdateIcon from "@mui/icons-material/Update";

export default function RiskFileTitle({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const { t } = useTranslation();

  return (
    <Box className="risk-title" sx={{ mb: 8 }}>
      <Typography variant="h2">
        {t(`risk.${riskSummary.cr4de_hazard_id}.name`, riskSummary.cr4de_title)}
      </Typography>
      <Stack direction="row" sx={{ mt: 1 }} columnGap={1}>
        {riskSummary.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <RiskTypeIcon riskFile={riskSummary} />
        )}
        <CategoryIcon category={riskSummary.cr4de_category} />
        {riskSummary.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <RiskTypeIcon riskFile={riskSummary} />
        )}
        {/* {labels.map((l) => (
            <Box sx={{ width: 30, height: 30 }}>
              <CategoryIcon category={riskFile.cr4de_risk_category} />
            </Box>
          </Tooltip>
        ))} */}
      </Stack>
      {riskSummary.cr4de_last_snapshot && (
        <Alert
          icon={<UpdateIcon fontSize="inherit" />}
          severity="success"
          sx={{ mt: 2 }}
        >
          This risk file was last updated on{" "}
          <b>
            {new Date(riskSummary.cr4de_last_snapshot).toLocaleDateString()}
          </b>
        </Alert>
      )}
    </Box>
  );
}
