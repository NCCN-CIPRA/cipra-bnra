import { useOutletContext } from "react-router-dom";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Box, Container, Stack } from "@mui/material";
import Standard from "./Standard";
import ManMade from "./ManMade";
import Emerging from "./Emerging";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";
import RiskFileTitle from "../../components/RiskFileTitle";

export default function RiskDataPage() {
  const { riskFile, cascades } = useOutletContext<RiskFilePageContext>();

  // useEffect(() => {
  //   if (!directAnalyses) loadDirectAnalyses();
  //   if (!cascadeAnalyses) loadCascadeAnalyses();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (!riskFile || !cascades)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Stack direction="column" sx={{ width: "100%" }}>
      <Container sx={{ mt: 2 }}>
        <RiskFileTitle riskFile={riskFile} />
      </Container>
      <Box sx={{ mt: 6, mb: 16 }}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
          <Standard
            riskFile={riskFile}
            causes={cascades.causes}
            catalyzingEffects={cascades.catalyzingEffects}
            climateChange={cascades.climateChange}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={() =>
            //   reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
            // }
            // reloadCascades={() =>
            //   reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
            // }
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <ManMade
            riskFile={riskFile}
            effects={cascades.effects}
            catalyzingEffects={cascades.catalyzingEffects}
            climateChange={cascades.climateChange}
            // directAnalyses={directAnalyses}
            // cascadeAnalyses={cascadeAnalyses}
            // reloadRiskFile={() =>
            //   reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
            // }
            // reloadCascades={() =>
            //   reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
            // }
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
          <Emerging
            riskFile={riskFile}
            effects={cascades.effects}
            // reloadCascades={() =>
            //   reloadRiskFile({ id: riskFile.cr4de_riskfilesid })
            // }
          />
        )}
      </Box>
    </Stack>
  );
}
