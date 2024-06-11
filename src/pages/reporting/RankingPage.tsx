import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Skeleton, Select, MenuItem, FormControl, Divider, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RiskMatrix from "./RiskMatrix";
import { DataTable } from "../../hooks/useAPI";
import { CONSENSUS_TYPE, DVRiskFile } from "../../types/dataverse/DVRiskFile";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { DVAnalysisRun, RiskAnalysisResults, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import ExportRiskFiles from "./Standard";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";

const dataColumns: GridColDef[] = [
  { field: "cr4de_hazard_id", headerName: "ID", width: 60 },
  {
    field: "cr4de_title",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "cr4de_risk_category",
    headerName: "Category",
    width: 150,
  },
  {
    field: "cr4de_consensus_type",
    headerName: "Consensus",
    width: 200,
    headerAlign: "left",
    valueGetter: (params: GridValueGetterParams) => {
      if (params.row.cr4de_consensus_date && new Date(params.row.cr4de_consensus_date) < new Date()) return "Finished";
      if (params.row.cr4de_consensus_type === null) return "Not Planned";
      if (params.row.cr4de_consensus_date && params.row.cr4de_consensus_type === CONSENSUS_TYPE.MEETING)
        return `Consensus meeting on (${format(new Date(params.row.cr4de_consensus_date), "dd-MM-yy")})`;
      if (params.row.cr4de_consensus_date && params.row.cr4de_consensus_type === CONSENSUS_TYPE.SILENCE)
        return `Silence procedure until (${format(new Date(params.row.cr4de_consensus_date), "dd-MM-yy")})`;
    },
  },
  {
    field: "cr4de_key_risk",
    headerName: "Key Risk",
    type: "boolean",
    width: 100,
    headerAlign: "center",
  },
];

const fieldColumns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 60 },
  { field: "type", headerName: "Type", width: 60 },
  { field: "description", headerName: "Description", width: 60 },
];

type ExportParams = {
  riskFiles: DVRiskFile[];
};

export default function RankingPage() {
  const navigate = useNavigate();

  const [exportParams, setExportParams] = useState<ExportParams | null>(null);
  const [sortedRisks, setSortedRisks] = useState<RiskAnalysisResults<DVRiskFile>[] | null>(null);

  const { data: riskFiles, isFetching: loading } = useRecords<DVRiskFile<DVAnalysisRun<unknown, string>>>({
    table: DataTable.RISK_FILE,
    query: "$orderby=cr4de_hazard_id&$expand=cr4de_latest_calculation",
    transformResult: (data) => data.filter((r: DVRiskFile) => !r.cr4de_hazard_id.startsWith("X")),
  });
  const { data: cascades, isFetching: loadingCascades } = useRecords<DVRiskCascade<SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: "$expand=cr4de_cause_hazard($select=cr4de_title)",
  });

  usePageTitle("BNRA 2023 - 2026 Reporting");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Reporting", url: "" },
  ]);

  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <>
        {(!riskFiles || !cascades) && (
          <>
            <Box sx={{ mb: 8, mx: 8 }}>
              <Paper sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
                <DataGrid
                  columns={dataColumns}
                  rows={riskFiles || []}
                  getRowId={(r: DVRiskFile) => r.cr4de_riskfilesid}
                  loading={loading}
                  checkboxSelection
                  disableRowSelectionOnClick
                  // onRowClick={(params: GridRowParams<RiskFileParticipation>) => {
                  //   if (!riskFiles) return;

                  //   navigate(`/risks/${params.row.cr4de_riskfilesid}`);
                  // }}
                />
              </Paper>
            </Box>
            <Box sx={{ mb: 8, mx: 8 }}>
              <Paper sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
                <DataGrid
                  columns={fieldColumns}
                  rows={[
                    {
                      id: "dp-quali",
                      name: "Direct Probability - Quali",
                      type: "text",
                      description: "Consolidated qualitative input for direct probability",
                    },
                    {
                      id: "dp",
                      name: "Direct Probability - Quanti",
                      type: "number",
                      description: "Average estimation or consensus value for direct probability",
                    },
                    {
                      id: "h",
                      name: "Human Impact - Quali",
                      type: "text",
                      description: "Consolidated qualitative input for human impact",
                    },
                    {
                      id: "ha",
                      name: "Ha",
                      type: "number",
                      description: "Consolidated qualitative input for human impact",
                    },
                  ]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  // onRowClick={(params: GridRowParams<RiskFileParticipation>) => {
                  //   if (!riskFiles) return;

                  //   navigate(`/risks/${params.row.cr4de_riskfilesid}`);
                  // }}
                />
              </Paper>
            </Box>
          </>
        )}
        {riskFiles && cascades && (
          <ExportRiskFiles
            riskFile={
              riskFiles.find((r) => r.cr4de_title.indexOf("electricity") > 0) as DVRiskFile<
                DVAnalysisRun<unknown, string>
              >
            }
            otherRiskFiles={riskFiles}
            cascades={cascades}
          />
        )}
      </>
    </Container>
  );
}
