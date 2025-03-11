import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Box, Container, Fade } from "@mui/material";
import Standard from "./Standard";
import ManMade from "./ManMade";
import Emerging from "./Emerging";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";
import RiskFileTitle from "../../components/RiskFileTitle";

const transitionDelay = 500;

export default function RiskDataPage() {
  const {
    riskFile,
    causes,
    effects,
    catalyzingEffects,
    climateChange,
    directAnalyses,
    cascadeAnalyses,
    reloadRiskFile,
    loadDirectAnalyses,
    loadCascadeAnalyses,
  } = useOutletContext<RiskFilePageContext>();

  const [fade] = useState(true);

  useEffect(() => {
    if (!directAnalyses) loadDirectAnalyses();
    if (!cascadeAnalyses) loadCascadeAnalyses();
  }, []);

  if (!directAnalyses || !cascadeAnalyses)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Fade in={fade} timeout={transitionDelay}>
      <Box>
        <Container sx={{ mt: 2 }}>
          <RiskFileTitle riskFile={riskFile} />
        </Container>
        <Box sx={{ mt: 6, mb: 16 }}>
          {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
            <Standard
              riskFile={riskFile}
              causes={causes}
              catalyzingEffects={catalyzingEffects}
              climateChange={climateChange}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              reloadRiskFile={() =>
                reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
              }
              reloadCascades={() =>
                reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
              }
            />
          )}
          {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
            <ManMade
              riskFile={riskFile}
              effects={effects}
              catalyzingEffects={catalyzingEffects}
              climateChange={climateChange}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              reloadRiskFile={() =>
                reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
              }
              reloadCascades={() =>
                reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
              }
            />
          )}
          {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
            <Emerging
              riskFile={riskFile}
              effects={effects}
              reloadCascades={() =>
                reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
              }
            />
          )}
        </Box>
      </Box>
    </Fade>
  );
}
