import {
  DVRiskFile,
  RISK_CATEGORY,
  RISK_TYPE,
} from "../types/dataverse/DVRiskFile";
import { ReactComponent as CyberIcon } from "../assets/icons/cyber_icon.svg";
import { ReactComponent as EcotechIcon } from "../assets/icons/eco_tech_risk_icon.svg";
import { ReactComponent as EmergingIcon } from "../assets/icons/emerging_risk_icon.svg";
import { ReactComponent as HealthIcon } from "../assets/icons/health_risk_icon.svg";
import { ReactComponent as ManMadeIcon } from "../assets/icons/man_made_risk_icon.svg";
import { ReactComponent as NaturalIcon } from "../assets/icons/natural_risk_icon.svg";
import { ReactComponent as SocietalIcon } from "../assets/icons/Societal_risk_icon.svg";
import { Box, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ArticleIcon from "@mui/icons-material/Article";

export function CategoryIcon({
  category,
  size = 30,
  tooltip = true,
}: {
  category: RISK_CATEGORY;
  size?: number;
  tooltip?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Tooltip title={tooltip ? t(category, category) : ""}>
      <Box sx={{ width: size, height: size }}>
        {category === RISK_CATEGORY.CYBER && <CyberIcon />}
        {category === RISK_CATEGORY.EMERGING && <EmergingIcon />}
        {category === RISK_CATEGORY.ECOTECH && <EcotechIcon />}
        {category === RISK_CATEGORY.HEALTH && <HealthIcon />}
        {category === RISK_CATEGORY.MANMADE && <ManMadeIcon />}
        {category === RISK_CATEGORY.NATURE && <NaturalIcon />}
        {category === RISK_CATEGORY.TRANSVERSAL && <SocietalIcon />}
      </Box>
    </Tooltip>
  );
}

export function RiskTypeIcon({ riskFile }: { riskFile: DVRiskFile }) {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(riskFile.cr4de_risk_type, riskFile.cr4de_risk_type)}>
      <Box
        sx={{
          width: 30,
          height: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && <ArticleIcon />}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && <QueryStatsIcon />}
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <SensorOccupiedIcon />
        )}
      </Box>
    </Tooltip>
  );
}
