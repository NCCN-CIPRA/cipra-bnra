import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import ManMade from "./ManMade/ManMade";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import "./RiskAnalysisPage.css";
import NCCNLoader from "../../components/NCCNLoader";

export default function RiskAnalysisPage() {
  const {
    riskSummary,
    riskSnapshot: riskFile,
    results,
  } = useOutletContext<RiskFilePageContext>();

  if (!riskFile)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Standard
          riskSummary={riskSummary}
          riskFile={riskFile}
          results={results}
        />
      </Container>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <ManMade
          riskSummary={riskSummary}
          riskFile={riskFile}
          results={results}
        />
      </Container>
    );

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Emerging riskSummary={riskSummary} />
    </Container>
  );
}
