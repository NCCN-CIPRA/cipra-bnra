import { useOutletContext } from "react-router-dom";
import { Container } from "@mui/material";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import Manmade from "./Manmade/Manmade";

export default function RiskDescriptionPage() {
  const { riskSummary } = useOutletContext<RiskFilePageContext>();

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
