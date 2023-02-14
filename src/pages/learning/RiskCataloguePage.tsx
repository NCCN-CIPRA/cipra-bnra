import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";
import LearningSideBar from "../../components/LearningSideBar";
import { styled } from "@mui/material/styles";
import openInNewTab from "../../functions/openInNewTab";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: `calc(${theme.spacing(7)} + 1px)`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: `${drawerWidth}px`,
  }),
}));

export default function RiskCataloguePage() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);

  // Get all risk file records from O365 dataverse
  const { data: riskFiles } = useRecords<DVRiskFile>({ table: DataTable.RISK_FILE, query: "$orderby=cr4de_hazard_id" });

  usePageTitle(t("learning.general.hazardCatalogue.title", "BNRA 2023 - 2026 Risicocatalogus"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    { name: t("learning.general.hazardCatalogue.breadcrumb", "Risicocatalogus"), url: "/learning/risk-catalogue" },
  ]);

  return (
    <>
      <LearningSideBar open={open} width={320} pageName="risk-catalogue" handleDrawerToggle={() => setOpen(!open)} />
      <Main open={open}>
        <Container>
          <Box>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="learning.general.hazardCatalogue.introduction.1">
                This page shows a list of all the risks included in the BNRA 2023 - 2026 risk catalogue.
              </Trans>
            </Typography>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="learning.general.hazardCatalogue.introduction.2">
                You may click on any risk to explore the associated <b>preliminary</b> risk file. Please be aware that
                the contents of the risk files have not yet been validated, and are subject to change.
              </Trans>
            </Typography>
          </Box>
          <RiskFileList
            riskFiles={riskFiles}
            onClick={async (riskFile) => {
              if (!riskFiles) return;

              openInNewTab(`/learning/risk/${riskFile.cr4de_riskfilesid}`);
            }}
          />
        </Container>
      </Main>
    </>
  );
}
