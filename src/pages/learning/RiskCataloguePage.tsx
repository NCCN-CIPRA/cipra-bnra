import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";

const openInNewTab = (url: string): void => {
  window.open(url, "newwindow", "width=1300,height=900");
};

export default function RiskCataloguePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      <Container>
        <RiskFileList
          riskFiles={riskFiles}
          onClick={async (riskFile) => {
            if (!riskFiles) return;

            openInNewTab(`/#/learning/risk/${riskFile.cr4de_riskfilesid}`);
          }}
        />
      </Container>
    </>
  );
}
