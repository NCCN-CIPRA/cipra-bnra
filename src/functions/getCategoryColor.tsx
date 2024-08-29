import { DVRiskFile, RISK_CATEGORY, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { ReactComponent as CyberIcon } from "../icons/cyber_icon.svg";
import { ReactComponent as EcotechIcon } from "../icons/eco_tech_risk_icon.svg";
import { ReactComponent as EmergingIcon } from "../icons/emerging_risk_icon.svg";
import { ReactComponent as HealthIcon } from "../icons/health_risk_icon.svg";
import { ReactComponent as ManMadeIcon } from "../icons/man_made_risk_icon.svg";
import { ReactComponent as NaturalIcon } from "../icons/natural_risk_icon.svg";
import { ReactComponent as SocietalIcon } from "../icons/Societal_risk_icon.svg";
import { Box, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ArticleIcon from "@mui/icons-material/Article";

export const colors: { [key: string]: string } = {
  Cyber: "#7D5C65",
  EcoTech: "#A69658",
  "Emerging Risk": "#E5BEED",
  Health: "#74b9ff",
  "Man-made": "#ff7675",
  Nature: "#7EA16B",
  Transversal: "#636e72",
};

export default function getCategoryColor(category: string) {
  if (colors[category]) return colors[category];

  return "rgb(0, 164, 154)";
}

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
      <Box sx={{ width: 30, height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && <ArticleIcon />}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && <QueryStatsIcon />}
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && <SensorOccupiedIcon />}
      </Box>
    </Tooltip>
  );
}
