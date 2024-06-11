import { useOutletContext } from "react-router-dom";
import { Container } from "@mui/material";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import ManMade from "./ManMade/ManMade";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import "./RiskAnalysisPage.css";

export default function RiskAnalysisPage() {
  const { user, hazardCatalogue, riskFile, cascades, calculation, reloadRiskFile, isEditing, setIsEditing } =
    useOutletContext<RiskFilePageContext>();

  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 4, pb: 8 }}>
        <Standard
          riskFile={riskFile}
          cascades={cascades[riskFile.cr4de_riskfilesid].all}
          calculation={calculation}
          mode="edit"
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
        />
      </Container>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 4, pb: 8 }}>
        <ManMade
          riskFile={riskFile}
          cascades={cascades[riskFile.cr4de_riskfilesid]}
          calculation={calculation}
          mode="edit"
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
        />
      </Container>
    );

  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <Emerging
        riskFile={riskFile}
        cascades={cascades[riskFile.cr4de_riskfilesid].all}
        mode="edit"
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
      />
    </Container>
  );
}
