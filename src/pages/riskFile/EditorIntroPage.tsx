import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

export default function EditorIntroPage() {
  const navigate = useNavigate();

  // Get all risk file records from O365 dataverse
  const { data: riskFiles } = useRecords<DVRiskFile>({ table: DataTable.RISK_FILE, query: "$orderby=cr4de_hazard_id" });

  usePageTitle("BNRA 2023 - 2026 Hazard Catalogue");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Hazard Catalogue", url: "/hazards" },
  ]);

  return (
    <>
      <Container>
        <RiskFileList
          riskFiles={riskFiles}
          onClick={async (riskFile) => {
            if (!riskFiles) return;

            navigate(`/hazards/${riskFile.cr4de_riskfilesid}`);
          }}
        />
      </Container>
    </>
  );
}
