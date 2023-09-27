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
import { PDFViewer, pdf } from "@react-pdf/renderer";
import * as FileSaver from "file-saver";
import ConsensusPDF from "../pdf/ConsensusPDF";

type RouteParams = {
  riskFile_id: string;
};

const transitionDelay = 500;

export default function PDFConsensusExpertPage({}: {}) {
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

  if (!directAnalysis || !directAnalysis[0] || !cascadeAnalyses) return null;

  return (
    <PDFViewer>
      <ConsensusPDF directAnalysis={directAnalysis[0]} cascadeAnalyses={cascadeAnalyses} />
    </PDFViewer>
  );
}
