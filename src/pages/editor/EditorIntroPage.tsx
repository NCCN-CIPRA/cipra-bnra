import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";

export default function EditorIntroPage() {
  const navigate = useNavigate();

  // Get all risk file records from O365 dataverse
  const { data: riskFiles } = useRecords<DVRiskFile>({ table: DataTable.RISK_FILE });

  return (
    <>
      <Container>
        <Box mt={5}>
          <Typography variant="body1" my={2}>
            Welcome to the <b>BNRA 2023 - 2026 Risk File Editor Application</b>
          </Typography>
        </Box>

        <RiskFileList
          riskFiles={riskFiles}
          onClick={async (riskFile) => {
            if (!riskFiles) return;

            navigate(`/editor/${riskFile.cr4de_riskfilesid}`);
          }}
        />
      </Container>
    </>
  );
}
