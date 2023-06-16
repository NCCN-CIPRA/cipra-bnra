import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ArticleIcon from "@mui/icons-material/Article";
import HubIcon from "@mui/icons-material/Hub";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import { useTranslation } from "react-i18next";
import openInNewTab from "../../../functions/openInNewTab";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import { STEPS } from "../Steps";

export default function InformationButton({
  showTutorial,
  riskFile,
  onRunTutorial = () => {},
}: {
  showTutorial: boolean;
  riskFile?: DVRiskFile;
  onRunTutorial?: () => void;
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    ...(showTutorial
      ? [
          {
            icon: <HelpIcon />,
            name: t("speeddial.tutorial", "Play Tutorial"),
            onClick: onRunTutorial,
          },
        ]
      : []),
    {
      icon: <CategoryIcon />,
      name: t("speeddial.scales", "Quantitative Scales"),
      onClick: () => riskFile && openInNewTab("/learning/quantitative-categories", "Quantitative Categories"),
    },
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "fixed", bottom: 72, left: 16 }}
      icon={<InfoIcon />}
      id="step2A-information-button"
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.onClick} />
      ))}
    </SpeedDial>
  );
}
