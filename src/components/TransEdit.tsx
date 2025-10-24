import { Trans, useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../pages/BasePage";
import { MouseEvent, ReactElement, useState } from "react";
import { Box, IconButton, Typography, TypographyProps } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TranslationDialog from "./TranslationDialog";
import { DVTranslation } from "../types/dataverse/DVTranslation";
import NCCNLoader from "./NCCNLoader";

/**
 * Replace regex: <TTypography (.*)>\n.*<Trans i18nKey="(.*)">
 */

export default function TTypography({
  i18nKey,
  children,
  ...typographyProps
}: {
  i18nKey: string;
  children?: string | ReactElement | (string | ReactElement)[];
} & TypographyProps) {
  const { user } = useOutletContext<BasePageContext>();

  if (!user || !user.roles.analist)
    return (
      <Typography {...typographyProps}>
        <Trans i18nKey={i18nKey}>{children || i18nKey}</Trans>
      </Typography>
    );

  return (
    <TransEditUser i18nKey={i18nKey} children={children} {...typographyProps} />
  );
}

function TransEditUser({
  i18nKey,
  children,
  ...typographyProps
}: {
  i18nKey: string;
  children?: string | ReactElement | (string | ReactElement)[];
} & TypographyProps) {
  const { i18n } = useTranslation();

  const [showButton, setShowButton] = useState(false);
  const [editTranslation, setEditTranslation] =
    useState<Partial<DVTranslation> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditTranslation = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    i18n.loadLanguages(["id", "en", "fr", "nl", "de"], () => {
      setEditTranslation({
        cr4de_bnratranslationid: i18n.getResource("id", "translation", i18nKey),
        cr4de_name: i18nKey,
        cr4de_en: i18n.getResource("en", "translation", i18nKey),
        cr4de_nl: i18n.getResource("nl", "translation", i18nKey),
        cr4de_fr: i18n.getResource("fr", "translation", i18nKey),
        cr4de_de: i18n.getResource("de", "translation", i18nKey),
      });
    });
  };

  return (
    <Box
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      style={{ position: "relative", opacity: isLoading ? 0.5 : 1 }}
    >
      {editTranslation && (
        <TranslationDialog
          open={true}
          translation={editTranslation}
          isLoading={false}
          setIsLoading={setIsLoading}
          onClose={() => setEditTranslation(null)}
          reloadData={async () => {
            await i18n.services.backendConnector.backend.refetchTranslations();
            return i18n.reloadResources();
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
          textAlign: "center",
        }}
      >
        {isLoading ? (
          <NCCNLoader />
        ) : (
          <IconButton
            sx={{
              opacity: showButton ? 1 : 0,
              border: "1px solid rgba(0,0,0,0.4)",
              bgcolor: "rgba(255,255,255,0.6)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
            onClick={handleEditTranslation}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography {...typographyProps}>
        <Trans i18nKey={i18nKey}>{children || i18nKey}</Trans>
      </Typography>
    </Box>
  );
}
