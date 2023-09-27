import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import useRecord from "../../hooks/useRecord";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Box, Button, Paper, Fade, Container } from "@mui/material";
import { AuthPageContext } from "../AuthPage";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../hooks/useRecords";
import Standard from "./Standard";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";

type RouteParams = {
  riskFile_id: string;
};

const transitionDelay = 500;

export default function ConsensusExpertPage() {
  const { t } = useTranslation();
  const routeParams = useParams() as RouteParams;
  const navigate = useNavigate();
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const [fade, setFade] = useState(true);

  /**
   * Retrieve the direct analysis record from the database that is defined in the page url when the page loads
   */
  const { data: directAnalysis, isFetching: isFetchingDirectAnalysis } = useRecords<DVDirectAnalysis<DVRiskFile>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${routeParams.riskFile_id} and _cr4de_expert_value eq ${user.contactid}&$expand=cr4de_risk_file`,
  });

  const { data: cascadeAnalyses, isFetching: isFetchingCascadeAnalyses } = useRecords<
    DVCascadeAnalysis<DVRiskCascade<SmallRisk, SmallRisk>>
  >({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${routeParams.riskFile_id} and _cr4de_expert_value eq ${user.contactid}&$expand=cr4de_cascade($expand=cr4de_cause_hazard($select=cr4de_title,cr4de_risk_type),cr4de_effect_hazard($select=cr4de_title,cr4de_risk_type))`,
  });

  usePageTitle(t("step3.pageTitle", "BNRA 2023 - 2026 Risk File Consensus"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step3.breadcrumb", "Risk File Consensus"), url: "/overview" },
    directAnalysis ? { name: directAnalysis[0].cr4de_risk_file.cr4de_title, url: "" } : null,
  ]);

  return (
    <>
      <Fade in={fade} timeout={transitionDelay}>
        <Box sx={{ mt: 6, mb: 16 }}>
          {directAnalysis &&
            directAnalysis[0].cr4de_risk_file.cr4de_risk_type === RISK_TYPE.STANDARD &&
            cascadeAnalyses && <Standard directAnalysis={directAnalysis[0]} cascadeAnalyses={cascadeAnalyses} />}
          {directAnalysis && directAnalysis[0].cr4de_risk_file.cr4de_risk_type === RISK_TYPE.MANMADE && <Box />}
          {directAnalysis && directAnalysis[0].cr4de_risk_file.cr4de_risk_type === RISK_TYPE.EMERGING && <Box />}
        </Box>
      </Fade>

      <Box
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
        className="consensus-bottom-nav"
      >
        <Box id="directAnalysis-next-buttons">
          {directAnalysis && directAnalysis[0] && cascadeAnalyses && (
            <Button color="primary" sx={{ mr: 1 }} onClick={() => window.print()}>
              <Trans i18nKey="button.printOverview">Print Overview</Trans>
            </Button>
          )}
          <Button color="primary" sx={{ mr: 1 }} onClick={() => navigate("/overview")}>
            <Trans i18nKey="button.exit">Exit</Trans>
          </Button>
        </Box>
      </Box>
    </>
  );
}
