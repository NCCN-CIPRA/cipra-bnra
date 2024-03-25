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
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import usePageTitle from "../../../hooks/usePageTitle";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useMemo, useState } from "react";
import { DVAnalysisRun, RiskAnalysisResults, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import ExportRiskFiles from "../../reporting/ExportRiskFiles";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

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
  riskFiles,
  cascades,
}: {
  riskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[] | null;
  cascades: DVRiskCascade<SmallRisk>[] | null;
}) {
  const params = useParams() as RouteParams;

  if (!riskFiles || !cascades) return null;

  return <ExportRiskFiles riskFiles={riskFiles} cascades={cascades} />;
  // return (
  //   <Container sx={{ mt: 4, pb: 8 }}>
  //     <Stack direction="row" sx={{ mb: 8 }}>
  //       <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
  //         <ProbabilitySankey riskFile={riskFile} calculation={calculations[0].cr4de_results} />
  //       </Box>
  //       <Stack direction="column" justifyContent="center" sx={{ width: 300, p: "50px" }}>
  //         {/* <Box
  //           sx={{
  //             width: 200,
  //             height: 200,
  //           }}
  //         >
  //           <ProbabilityOriginPieChart riskFile={riskFile} />
  //         </Box>
  //         <Box
  //           sx={{
  //             width: 200,
  //             height: 200,
  //           }}
  //         >
  //           <ImpactOriginPieChart riskFile={riskFile} />
  //         </Box> */}
  //         <Box sx={{ width: "100%", textAlign: "center", mb: 6 }}>
  //           <Typography variant="h6">{riskFile?.cr4de_title}</Typography>
  //         </Box>
  //         <Box
  //           sx={{
  //             width: 200,
  //             height: 200,
  //           }}
  //         >
  //           <ImpactDistributionPieChart riskFile={riskFile} calculation={calculations[0].cr4de_results} />
  //           <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
  //             <Typography variant="subtitle2">Damage Indicators</Typography>
  //           </Box>
  //         </Box>
  //       </Stack>
  //       <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
  //         <ImpactSankey riskFile={riskFile} calculation={calculations[0].cr4de_results} />
  //       </Box>
  //     </Stack>
  //     <Box>
  //       {riskFile ? (
  //         <Box
  //           mt={3}
  //           dangerouslySetInnerHTML={{
  //             __html: riskFile.cr4de_dp_quali || "",
  //           }}
  //         />
  //       ) : (
  //         <Box mt={3}>
  //           <Skeleton variant="text" />
  //           <Skeleton variant="text" />
  //           <Skeleton variant="text" />
  //         </Box>
  //       )}
  //     </Box>
  //     <TableContainer component={Paper}>
  //       <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell sx={{ textAlign: "left", whiteSpace: "nowrap" }}></TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap" }}>Considerable</TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap" }}>Major</TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap" }}>Extreme</TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap", textAlign: "right" }}>Total</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {riskFile ? (
  //             <>
  //               <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
  //                 <TableCell
  //                   component="th"
  //                   scope="row"
  //                   sx={{
  //                     whiteSpace: "nowrap",
  //                   }}
  //                 >
  //                   <Typography variant="body1">Direct P</Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.dp_c,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.dp_c * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.dp_m,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.dp_m * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.dp_e,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.dp_e * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row" sx={{ textAlign: "right" }}>
  //                   {Math.round(calculations[0].cr4de_results.dp * 10000) / 100}%
  //                 </TableCell>
  //               </TableRow>
  //               <TableRow key={riskFile.cr4de_title} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
  //                 <TableCell
  //                   component="th"
  //                   scope="row"
  //                   sx={{
  //                     whiteSpace: "nowrap",
  //                   }}
  //                 >
  //                   <Typography variant="body1">Indirect P</Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.ip_c,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.ip_c * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.ip_m,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.ip_m * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.ip_e,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.ip_e * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row" sx={{ textAlign: "right" }}>
  //                   {Math.round(calculations[0].cr4de_results.ip * 10000) / 100}%
  //                 </TableCell>
  //               </TableRow>
  //               <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
  //                 <TableCell
  //                   component="th"
  //                   scope="row"
  //                   sx={{
  //                     whiteSpace: "nowrap",
  //                   }}
  //                 >
  //                   <Typography variant="body1">Total P</Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.tp_c,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.tp_c * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.tp_m,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.tp_m * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row">
  //                   <Typography variant="body1">
  //                     {getProbabilityScale(
  //                       calculations[0].cr4de_results.tp_e,
  //                       riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
  //                     )}
  //                   </Typography>
  //                   <Typography variant="caption">
  //                     {Math.round(calculations[0].cr4de_results.tp_e * 10000) / 100}%
  //                   </Typography>
  //                 </TableCell>
  //                 <TableCell component="th" scope="row" sx={{ textAlign: "right" }}>
  //                   {Math.round(calculations[0].cr4de_results.tp * 10000) / 100}%
  //                 </TableCell>
  //               </TableRow>
  //             </>
  //           ) : (
  //             [1, 2, 3].map((i) => (
  //               <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //               </TableRow>
  //             ))
  //           )}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //     <Box>
  //       {/* {riskFile ? (
  //         <Box
  //           mt={3}
  //           dangerouslySetInnerHTML={{
  //             __html: riskFile.cr4de_di_quali_h_e || "",
  //           }}
  //         />
  //       ) : (
  //         <Box mt={3}>
  //           <Skeleton variant="text" />
  //           <Skeleton variant="text" />
  //           <Skeleton variant="text" />
  //         </Box>
  //       )} */}
  //     </Box>
  //     <TableContainer component={Paper}>
  //       <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell sx={{ textAlign: "left", whiteSpace: "nowrap" }}></TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap" }}>Considerable</TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap" }}>Major</TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap" }}>Extreme</TableCell>
  //             <TableCell sx={{ whiteSpace: "nowrap", textAlign: "right" }}>Total</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {riskFile ? (
  //             <>
  //               {impactFields.map((f, i) =>
  //                 f === null ? (
  //                   <TableRow key={i} sx={{ backgroundColor: "#eee" }}>
  //                     <TableCell colSpan={100}> </TableCell>
  //                   </TableRow>
  //                 ) : (
  //                   <TableRow
  //                     key={f.fieldName}
  //                     sx={{
  //                       "&:last-child td, &:last-child th": { border: 0 },
  //                     }}
  //                   >
  //                     <TableCell
  //                       component="th"
  //                       scope="row"
  //                       sx={{
  //                         whiteSpace: "nowrap",
  //                       }}
  //                     >
  //                       <Typography variant="body1">{f.name}</Typography>
  //                     </TableCell>
  //                     <TableCell component="th" scope="row">
  //                       <Typography variant="body1">
  //                         {getImpactScale(
  //                           calculations[0].cr4de_results[
  //                             `${f.fieldName}_c` as keyof RiskCalculation
  //                           ] as number as number,
  //                           f.fieldName.split("_")[1] || ""
  //                         )}
  //                       </Typography>
  //                       <Typography variant="caption">
  //                         {curFormat.format(
  //                           calculations[0].cr4de_results[`${f.fieldName}_c` as keyof RiskCalculation] as number
  //                         )}
  //                       </Typography>
  //                     </TableCell>
  //                     <TableCell component="th" scope="row">
  //                       <Typography variant="body1">
  //                         {getImpactScale(
  //                           calculations[0].cr4de_results[`${f.fieldName}_m` as keyof RiskCalculation] as number,
  //                           f.fieldName?.split("_")[1] || ""
  //                         )}
  //                       </Typography>
  //                       <Typography variant="caption">
  //                         {curFormat.format(
  //                           calculations[0].cr4de_results[`${f.fieldName}_m` as keyof RiskCalculation] as number
  //                         )}
  //                       </Typography>
  //                     </TableCell>
  //                     <TableCell component="th" scope="row">
  //                       <Typography variant="body1">
  //                         {getImpactScale(
  //                           calculations[0].cr4de_results[`${f.fieldName}_e` as keyof RiskCalculation] as number,
  //                           f.fieldName?.split("_")[1] || ""
  //                         )}
  //                       </Typography>
  //                       <Typography variant="caption">
  //                         {curFormat.format(
  //                           calculations[0].cr4de_results[`${f.fieldName}_e` as keyof RiskCalculation] as number
  //                         )}
  //                       </Typography>
  //                     </TableCell>
  //                     <TableCell align="right">
  //                       <Typography variant="body2">
  //                         {curFormat.format(
  //                           calculations[0].cr4de_results[f.fieldName as keyof RiskCalculation] as number
  //                         )}
  //                       </Typography>
  //                     </TableCell>
  //                   </TableRow>
  //                 )
  //               )}
  //             </>
  //           ) : (
  //             [1, 2, 3].map((i) => (
  //               <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //                 <TableCell>
  //                   <Skeleton variant="rectangular" />
  //                 </TableCell>
  //               </TableRow>
  //             ))
  //           )}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </Container>
  // );
}
