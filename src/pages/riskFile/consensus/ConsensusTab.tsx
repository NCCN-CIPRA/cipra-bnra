import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import useRecord from "../../../hooks/useRecord";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { Box, Button, Paper, Fade, Container } from "@mui/material";
import { AuthPageContext } from "../../AuthPage";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../../hooks/useRecords";
import Standard from "./Standard";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";

const transitionDelay = 500;

export default function ConsensusTab({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const [fade, setFade] = useState(true);

  usePageTitle(t("step3.pageTitle", "BNRA 2023 - 2026 Risk File Consensus"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step3.breadcrumb", "Risk File Consensus"), url: "/overview" },
    { name: riskFile.cr4de_title, url: "" },
  ]);

  return (
    <>
      <Fade in={fade} timeout={transitionDelay}>
        <Box sx={{ mt: 6, mb: 16 }}>
          {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && <Standard riskFile={riskFile} cascades={cascades} />}
          {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && <Box />}
          {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && <Box />}
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
