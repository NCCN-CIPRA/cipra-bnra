import { Link as RouterLink, useParams } from "react-router-dom";
import { Container, Typography, Paper, Skeleton, Stack, Box, Breadcrumbs, Link } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getImpactScale } from "../../../functions/Impact";
import { getProbabilityScale } from "../../../functions/Probability";
import ImpactDistributionPieChart from "../../../components/charts/ImpactDistributionPieChart";
import ImpactOriginPieChart from "../../../components/charts/ImpactOriginPieChart";
import ProbabilityOriginPieChart from "../../../components/charts/ProbabilityOriginPieChart";
import ImpactSankey from "../../../components/charts/ImpactSankey";
import ProbabilitySankey from "../../../components/charts/ProbabilitySankey";
import useRecord from "../../../hooks/useRecord";
import { DataTable } from "../../../hooks/useAPI";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import usePageTitle from "../../../hooks/usePageTitle";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useMemo, useState } from "react";
import { DVAnalysisRun, RiskAnalysisResults, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import ExportRiskFiles from "../../reporting/Standard";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import Standard from "../../reporting/Standard";
import Emerging from "../../reporting/Emerging";
import ManMade from "../../reporting/ManMade";

const impactFields = [
  { name: "Direct Ha", fieldName: "di_Ha" },
  { name: "Indirect Ha", fieldName: "ii_Ha" },
  { name: "Total Ha", fieldName: "ti_Ha" },
  null,
  { name: "Direct Hb", fieldName: "di_Hb" },
  { name: "Indirect Hb", fieldName: "ii_Hb" },
  { name: "Total Hb", fieldName: "ti_Hb" },
  null,
  { name: "Direct Hc", fieldName: "di_Hc" },
  { name: "Indirect Hc", fieldName: "ii_Hc" },
  { name: "Total Hc", fieldName: "ti_Hc" },
  null,
  { name: "Direct Sa", fieldName: "di_Sa" },
  { name: "Indirect Sa", fieldName: "ii_Sa" },
  { name: "Total Sa", fieldName: "ti_Sa" },
  null,
  { name: "Direct Sb", fieldName: "di_Sb" },
  { name: "Indirect Sb", fieldName: "ii_Sb" },
  { name: "Total Sb", fieldName: "ti_Sb" },
  null,
  { name: "Direct Sc", fieldName: "di_Sc" },
  { name: "Indirect Sc", fieldName: "ii_Sc" },
  { name: "Total Sc", fieldName: "ti_Sc" },
  null,
  { name: "Direct Sd", fieldName: "di_Sd" },
  { name: "Indirect Sd", fieldName: "ii_Sd" },
  { name: "Total Sd", fieldName: "ti_Sd" },
  null,
  { name: "Direct Ea", fieldName: "di_Ea" },
  { name: "Indirect Ea", fieldName: "ii_Ea" },
  { name: "Total Ea", fieldName: "ti_Ea" },
  null,
  { name: "Direct Fa", fieldName: "di_Fa" },
  { name: "Indirect Fa", fieldName: "ii_Fa" },
  { name: "Total Fa", fieldName: "ti_Fa" },
  null,
  { name: "Direct Fb", fieldName: "di_Fb" },
  { name: "Indirect Fb", fieldName: "ii_Fb" },
  { name: "Total Fb", fieldName: "ti_Fb" },
  null,
  { name: "Direct Impact", fieldName: "di" },
  { name: "Indirect Impact", fieldName: "ii" },
  { name: "Total Impact", fieldName: "ti" },
];
const curFormat = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

type RouteParams = {
  risk_id: string;
};

export default function AnalysisTab({
  riskFile,
  riskFiles,
  cascades,
}: {
  riskFile: DVRiskFile<DVAnalysisRun<unknown, string>>;
  riskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[];
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
}) {
  const params = useParams() as RouteParams;

  if (!riskFiles || !cascades) return null;

  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD)
    return (
      <Container sx={{ mt: 4, pb: 8 }}>
        <Standard riskFile={riskFile} otherRiskFiles={riskFiles} cascades={cascades} mode="edit" />
      </Container>
    );

  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE)
    return (
      <Container sx={{ mt: 4, pb: 8 }}>
        <ManMade riskFile={riskFile} otherRiskFiles={riskFiles} cascades={cascades} mode="edit" />
      </Container>
    );

  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <Emerging riskFile={riskFile} otherRiskFiles={riskFiles} cascades={cascades} mode="edit" />
    </Container>
  );
}
