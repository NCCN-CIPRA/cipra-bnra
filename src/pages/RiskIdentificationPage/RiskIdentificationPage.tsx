import { useOutletContext } from "react-router-dom";
import { Container } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import * as S from "../../functions/scenarios";
import * as HE from "../../functions/historicalEvents";
import * as IP from "../../functions/intensityParameters";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import Manmade from "./Manmade/Manmade";
import { useEffect } from "react";

export interface ProcessedRiskFile extends DVRiskFile {
  historicalEvents: HE.HistoricalEvent[];
  intensityParameters: IP.IntensityParameter[];
  scenarios: S.Scenarios;
}

export default function RiskIdentificationPage() {
  const {
    user,
    hazardCatalogue,
    riskFile,
    cascades,
    reloadRiskFile,
    isEditing,
    setIsEditing,
    attachments,
    loadAttachments,
  } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, [attachments, loadAttachments]);

  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Standard
          riskFile={riskFile}
          cascades={cascades[riskFile.cr4de_riskfilesid]}
          mode={user && user.roles.analist ? "edit" : "view"}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
          attachments={attachments || []}
          hazardCatalogue={hazardCatalogue}
          loadAttachments={loadAttachments}
        />
      </Container>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Manmade
          riskFile={riskFile}
          cascades={cascades[riskFile.cr4de_riskfilesid]}
          mode={user && user.roles.analist ? "edit" : "view"}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
          attachments={attachments || []}
          hazardCatalogue={hazardCatalogue}
          loadAttachments={loadAttachments}
        />
      </Container>
    );

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Emerging
        riskFile={riskFile}
        cascades={cascades[riskFile.cr4de_riskfilesid]}
        mode={user && user.roles.analist ? "edit" : "view"}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
        attachments={attachments || []}
        hazardCatalogue={hazardCatalogue}
        loadAttachments={loadAttachments}
      />
    </Container>
  );
}
