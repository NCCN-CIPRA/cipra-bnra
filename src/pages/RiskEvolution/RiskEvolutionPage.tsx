import {
  Box,
  Container,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import CCSection from "./CCSection";
import { Link, useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { SCENARIOS } from "../../functions/scenarios";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../components/RiskFileTitle";
import DisclaimerSection from "../RiskAnalysisPage/DisclaimerSection";
import BNRASpeedDial from "../../components/BNRASpeedDial";
import RiskEvolutionTutorial from "./RiskEvolutionTutorial";
import handleExportRiskfile from "../../functions/export/exportBNRA";
import useAPI from "../../hooks/useAPI";
import NCCNLoader from "../../components/NCCNLoader";
import RiskFileBibliography from "../../components/RiskFileBibliography";

export default function RiskEvolutionPage() {
  const { t } = useTranslation();
  const api = useAPI();

  const { riskFile, cascades } = useOutletContext<RiskFilePageContext>();

  if (!riskFile || !cascades)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <DisclaimerSection riskFile={riskFile} />

        <Box className="climate-change" sx={{ mt: 2 }}>
          <Typography variant="h5">
            {t("Climate Change", "Climate Change")}
          </Typography>

          <CCSection
            cc={cascades.climateChange}
            riskFile={riskFile}
            causes={cascades.causes}
            scenario={riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE}
          />
        </Box>

        {cascades.catalyzingEffects.length > 0 && (
          <Box className="catalyzing-effects" sx={{ mt: 8 }}>
            <Typography variant="h5">
              {t("Other Catalysing Effects", "Other Catalysing Effects")}
            </Typography>

            <Box
              sx={{
                borderLeft: "solid 8px #eee",
                mt: 2,
                backgroundColor: "white",
              }}
            >
              <Box sx={{ px: 2, pt: 2 }}>
                <Typography variant="body2" paragraph>
                  The following emerging risks were identified as having a
                  potential catalysing effect on the probability and/or impact
                  of this risk. Please refer to the corresponding risk files for
                  the qualitative assessment of this effect:
                </Typography>
              </Box>
              <List>
                {cascades.catalyzingEffects.map((c) => (
                  <ListItemButton
                    key={c.cr4de_bnrariskcascadeid}
                    component={Link}
                    to={`/risks/${c.cr4de_cause_hazard.cr4de_riskfilesid}/analysis`}
                    target="_blank"
                  >
                    <Typography variant="subtitle2" sx={{ pl: 2 }}>
                      {c.cr4de_cause_hazard.cr4de_title}
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <RiskFileBibliography risk={riskFile} />

        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskFile, api)}
          HelpComponent={RiskEvolutionTutorial}
        />
      </Box>
    </Container>
  );
}
