import { useOutletContext } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Standard from "./Standard/Standard";
import Emerging from "./Emerging/Emerging";
import ManMade from "./ManMade/ManMade";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import "./RiskAnalysisPage.css";
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import NCCNLoader from "../../components/NCCNLoader";
import { getRiskCascades } from "../../functions/cascades";
import { useMemo } from "react";
import { getRiskCatalogue } from "../../functions/riskfiles";

export default function RiskAnalysisPage() {
  const api = useAPI();
  const { riskSummary, riskFile, cascades } =
    useOutletContext<RiskFilePageContext>();

  if (!riskFile || !cascades)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <Standard riskFile={riskFile} cascades={cascades} />
      </Container>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 2, pb: 8 }}>
        <ManMade
          riskFile={riskFile}
          cascades={cascades}
          mode={user && user.roles.analist ? "edit" : "view"}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={() =>
            reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
          }
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
        cascades={cascades[riskFile.cr4de_riskfilesid].all}
        mode={user && user.roles.analist ? "edit" : "view"}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        reloadRiskFile={() =>
          reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
        }
        attachments={attachments || []}
        hazardCatalogue={hazardCatalogue}
        loadAttachments={loadAttachments}
        reloadCascades={reloadCascades}
      />
    </Container>
  );
}
