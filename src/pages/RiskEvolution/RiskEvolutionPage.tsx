import { Box, Container, List, ListItemButton, Typography } from "@mui/material";
import CCSection from "./CCSection";
import { Link, useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { SCENARIOS } from "../../functions/scenarios";
import Bibliography from "../RiskAnalysisPage/Bibliography";
import { useTranslation } from "react-i18next";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import RiskFileTitle from "../../components/RiskFileTitle";
import DisclaimerSection from "../RiskAnalysisPage/DisclaimerSection";
import { useEffect } from "react";
import BNRASpeedDial from "../../components/BNRASpeedDial";
import RiskEvolutionTutorial from "./RiskEvolutionTutorial";

export default function RiskEvolutionPage({}) {
  const { t } = useTranslation();
  const {
    user,
    hazardCatalogue,
    riskFile,
    cascades,
    causes,
    catalyzingEffects,
    climateChange,
    reloadRiskFile,
    isEditing,
    setIsEditing,
    attachments,
    loadAttachments,
  } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <DisclaimerSection
          riskFile={riskFile}
          mode={user && user.roles.analist ? "edit" : "view"}
          attachments={attachments}
          updateAttachments={loadAttachments}
          isEditingOther={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
          allRisks={hazardCatalogue}
        />

        <Box className="climate-change" sx={{ mt: 2 }}>
          <Typography variant="h5">Climate Change</Typography>

          <CCSection
            cc={climateChange}
            mode={user && user.roles.analist ? "edit" : "view"}
            riskFile={riskFile}
            causes={causes}
            scenario={riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE}
            attachments={attachments}
            updateAttachments={loadAttachments}
            isEditingOther={isEditing}
            setIsEditing={setIsEditing}
            reloadRiskFile={() => reloadRiskFile({ id: riskFile.cr4de_riskfilesid })}
            allRisks={hazardCatalogue}
          />
        </Box>

        {catalyzingEffects.length > 0 && (
          <Box className="catalyzing-effects" sx={{ mt: 8 }}>
            <Typography variant="h5">Other Catalysing Effects</Typography>

            <Box sx={{ borderLeft: "solid 8px #eee", mt: 2, backgroundColor: "white" }}>
              <Box sx={{ px: 2, pt: 2 }}>
                <Typography variant="body2" paragraph>
                  The following emerging risks were identified as having a potential catalysing effect on the
                  probability and/or impact of this risk. Please refer to the corresponding risk files for the
                  qualitative assessment of this effect:
                </Typography>
              </Box>
              <List>
                {catalyzingEffects.map((c) => (
                  <ListItemButton
                    key={c.cr4de_bnrariskcascadeid}
                    LinkComponent={Link}
                    href={`/risks/${c.cr4de_cause_hazard.cr4de_riskfilesid}?tab=analysis`}
                    target="_blank"
                  >
                    <Typography variant="subtitle2" sx={{ pl: 2 }}>
                      {c.cr4de_cause_hazard.cr4de_title}{" "}
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <Bibliography
          riskFile={riskFile}
          cascades={cascades[riskFile.cr4de_riskfilesid].all}
          attachments={attachments}
          reloadAttachments={loadAttachments}
        />

        <BNRASpeedDial offset={{ x: 0, y: 56 }} HelpComponent={RiskEvolutionTutorial} />
      </Box>
    </Container>
  );
}
