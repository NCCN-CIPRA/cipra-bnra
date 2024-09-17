import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "../../hooks/useAPI";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Box, CircularProgress, Fade } from "@mui/material";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../hooks/useRecords";
import Standard from "./Standard";
import ManMade from "./ManMade";
import { DVContact } from "../../types/dataverse/DVContact";
import Emerging from "./Emerging";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";

const transitionDelay = 500;

export default function RiskDataPage({}) {
  const {
    riskFile,
    causes,
    effects,
    catalyzingEffects,
    climateChange,
    cascades,
    directAnalyses,
    cascadeAnalyses,
    reloadRiskFile,
    loadDirectAnalyses,
    loadCascadeAnalyses,
  } = useOutletContext<RiskFilePageContext>();

  const [fade, setFade] = useState(true);

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
      <Box sx={{ mt: 6, mb: 16 }}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <Standard
            riskFile={riskFile}
            causes={causes}
            catalyzingEffects={catalyzingEffects}
            climateChange={climateChange}
            directAnalyses={directAnalyses}
            cascadeAnalyses={cascadeAnalyses}
            reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
            reloadCascades={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
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
            reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
            reloadCascades={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
          <Emerging
            riskFile={riskFile}
            effects={effects}
            reloadCascades={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
          />
        )}
      </Box>
    </Fade>
  );
}
