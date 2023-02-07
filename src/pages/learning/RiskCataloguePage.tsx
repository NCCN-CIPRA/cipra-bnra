import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { useState } from "react";
import { Container } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";
import LearningSideBar from "../../components/LearningSideBar";
import { styled } from "@mui/material/styles";

const openInNewTab = (url: string): void => {
  window.open(url, "newwindow", "width=1300,height=900");
};

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
