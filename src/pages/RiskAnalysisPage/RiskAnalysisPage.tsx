import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import ManMade from "./ManMade/ManMade";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import "./RiskAnalysisPage.css";
import NCCNLoader from "../../components/NCCNLoader";
import { Environment } from "../../types/global";

export default function RiskAnalysisPage() {
  const {
    environment,
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
  console.log(riskSummary);
  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Standard
          riskSummary={riskSummary}
          riskFile={riskFile}
          results={
            environment === Environment.DYNAMIC ||
            riskSummary.cr4de_last_snapshot
              ? results
              : null
          }
        />
      </Container>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <ManMade
          riskSummary={riskSummary}
          riskFile={riskFile}
          results={
            environment === Environment.DYNAMIC ||
            riskSummary.cr4de_last_snapshot
              ? results
              : null
          }
        />
      </Container>
    );

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Emerging riskSummary={riskSummary} />
    </Container>
  );
}
