import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import useRecord from "../../../hooks/useRecord";
import { DIRECT_ANALYSIS_EDITABLE_FIELDS, DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { Box, Button, Paper, Fade, Container } from "@mui/material";
import { AuthPageContext } from "../../AuthPage";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../../hooks/useRecords";
import Standard from "./Standard";
import ManMade from "./ManMade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import Emerging from "./Emerging";

const transitionDelay = 500;

export default function ConsensusTab({
  riskFile,
  cascades,
  participants,
  directAnalyses,
  cascadeAnalyses,
  reloadRiskFile,
  reloadCascades,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  participants: DVParticipation[];
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
  reloadRiskFile: () => Promise<unknown>;
  reloadCascades: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const [fade, setFade] = useState(true);

  usePageTitle(t("step3.pageTitle", "BNRA 2023 - 2026 Risk File Consensus"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Hazard Catalogue", url: "/hazards" },
    { name: riskFile.cr4de_title, url: "" },
  ]);

  return (
    <>
      <Fade in={fade} timeout={transitionDelay}>
        <Box sx={{ mt: 6, mb: 16 }}>
          {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && (
            <Standard
              riskFile={riskFile}
              cascades={cascades}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              reloadRiskFile={reloadRiskFile}
              reloadCascades={reloadCascades}
            />
          )}
          {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
            <ManMade
              riskFile={riskFile}
              cascades={cascades}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              reloadRiskFile={reloadRiskFile}
              reloadCascades={reloadCascades}
            />
          )}
          {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
            <Emerging
              riskFile={riskFile}
              cascades={cascades}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              reloadRiskFile={reloadRiskFile}
              reloadCascades={reloadCascades}
            />
          )}
        </Box>
      </Fade>

      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
        }}
        component={Paper}
        elevation={5}
      >
        <Box id="directAnalysis-next-buttons">
          <Button color="primary" sx={{ mr: 1 }} onClick={() => navigate("/overview")}>
            <Trans i18nKey="button.exit">Exit</Trans>
          </Button>
        </Box>
      </Box> */}
    </>
  );
}
