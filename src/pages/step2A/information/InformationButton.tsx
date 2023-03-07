import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ArticleIcon from "@mui/icons-material/Article";
import HubIcon from "@mui/icons-material/Hub";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslation } from "react-i18next";
import openInNewTab from "../../../functions/openInNewTab";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";

export default function InformationButton({ riskFile }: { riskFile: DVRiskFile | undefined }) {
  const { t } = useTranslation();

  const actions = [
    {
      icon: <CategoryIcon />,
      name: t("speeddial.scales", "Quantitative Scales"),
      onClick: () => riskFile && openInNewTab("/learning/quantitative-categories", "Quantitative Categories"),
    },
    // { icon: <HubIcon />, name: t("speeddial.bwotie", "Bowtie Diagram") },
    {
      icon: <ArticleIcon />,
      name: t("speeddial.riskFile", "Risk File"),
      onClick: () => riskFile && openInNewTab(`/learning/risk/${riskFile.cr4de_riskfilesid}`, riskFile.cr4de_title),
    },
  ];
  return (
    <SpeedDial ariaLabel="SpeedDial basic example" sx={{ position: "fixed", bottom: 72, left: 16 }} icon={<InfoIcon />}>
      {actions.map((action) => (
        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.onClick} />
      ))}
    </SpeedDial>
  );
}
