import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import Manmade from "./Manmade/Manmade";
import NCCNLoader from "../../components/NCCNLoader";

export default function RiskDescriptionPage() {
  const { riskSummary } = useOutletContext<RiskFilePageContext>();

  if (!riskSummary)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  if (riskSummary.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Standard riskSummary={riskSummary} />
      </Container>
    );

  if (riskSummary.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Manmade riskSummary={riskSummary} />
      </Container>
    );

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Emerging riskSummary={riskSummary} />
    </Container>
  );
}
