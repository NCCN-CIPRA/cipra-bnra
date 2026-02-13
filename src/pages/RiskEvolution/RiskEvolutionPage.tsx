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
import useAPI, { DataTable } from "../../hooks/useAPI";
import NCCNLoader from "../../components/NCCNLoader";
import RiskFileBibliography from "../../components/RiskFileBibliography";
import { BasePageContext } from "../BasePage";
import { useQuery } from "@tanstack/react-query";
import { Environment } from "../../types/global";
import { parseCascadeSnapshot } from "../../types/dataverse/DVRiskCascade";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";

export default function RiskEvolutionPage() {
  const { user, environment } = useOutletContext<BasePageContext>();
  const { t } = useTranslation();
  const api = useAPI();

  const { riskSummary, riskSnapshot: riskFile } =
    useOutletContext<RiskFilePageContext>();
  const { data: dynamicCauses } = useQuery({
    queryKey: [
      DataTable.RISK_CASCADE,
      "causes",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getRiskCascades(
        `$filter=_cr4de_effect_hazard_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_cause_hazard`,
      ),
    enabled: Boolean(
      user &&
        user.roles.analist &&
        environment === Environment.DYNAMIC &&
        riskFile,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(snapshotFromRiskCascade(riskFile!, d)),
        cr4de_cause_risk: parseRiskSnapshot(
          snapshotFromRiskfile(d.cr4de_cause_hazard as DVRiskFile),
        ),
      })),
  });

  const { data: publicCauses } = useQuery({
    queryKey: [
      DataTable.CASCADE_SNAPSHOT,
      "causes",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getCascadeSnapshots(
        `$filter=_cr4de_effect_risk_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_cause_risk`,
      ),
    enabled: Boolean(
      user &&
        user.roles.verified &&
        environment === Environment.PUBLIC &&
        riskFile,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(d),
        cr4de_cause_risk: parseRiskSnapshot(
          snapshotFromRiskfile(d.cr4de_cause_risk as DVRiskFile),
        ),
      })),
  });

  const causes = (
    environment === Environment.PUBLIC ? publicCauses : dynamicCauses
  )?.filter((c) => c.cr4de_cause_risk.cr4de_risk_type !== RISK_TYPE.EMERGING);
  const catalyzingEffects = (
    environment === Environment.PUBLIC ? publicCauses : dynamicCauses
  )?.filter(
    (c) =>
      c.cr4de_cause_risk.cr4de_risk_type === RISK_TYPE.EMERGING &&
      c.cr4de_cause_risk.cr4de_title.indexOf("Climate") < 0,
  );
  const climateChange = (
    environment === Environment.PUBLIC ? publicCauses : dynamicCauses
  )?.find((c) => c.cr4de_cause_risk.cr4de_title.indexOf("Climate") >= 0);

  if (!riskFile || causes === undefined || catalyzingEffects === undefined)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskSummary} />

        <DisclaimerSection riskFile={riskFile} />

        <Box className="climate-change" sx={{ mt: 2 }}>
          <Typography variant="h5">
            {t("Climate Change", "Climate Change")}
          </Typography>

          <CCSection
            cc={climateChange || null}
            riskFile={riskFile}
            causes={causes}
            scenario={riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE}
          />
        </Box>

        {catalyzingEffects.length > 0 && (
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
                {catalyzingEffects.map((c) => (
                  <ListItemButton
                    key={c._cr4de_risk_cascade_value}
                    component={Link}
                    to={`/risks/${c._cr4de_cause_risk_value}/analysis`}
                    target="_blank"
                  >
                    <Typography variant="subtitle2" sx={{ pl: 2 }}>
                      {c.cr4de_cause_risk.cr4de_title}
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <RiskFileBibliography risk={riskSummary} />

        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskSummary, api, environment)}
          HelpComponent={RiskEvolutionTutorial}
        />
      </Box>
    </Container>
  );
}
