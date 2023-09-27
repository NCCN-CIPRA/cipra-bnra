import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";

import { useNavigate } from "react-router-dom";
import { Container, Box, Paper, LinearProgressProps, Typography, LinearProgress } from "@mui/material";
import RiskFileList from "../../components/RiskFileList";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  DataGrid,
  GridCheckIcon,
  GridCloseIcon,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { RiskAnalysisResults } from "../../types/dataverse/DVAnalysisRun";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";

const roundPerc = (val: number) => Math.round(val * 10000) / 100.0;

function LinearProgressWithLabel(props: LinearProgressProps & { cur: number; max: number }) {
  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: 2,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          width: `${Math.round((100.0 * props.cur) / props.max)}%`,
          backgroundColor: "rgba(0, 164, 154, 0.4)",
          left: 0,
        }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: "1px" }}>
        {props.cur}/{props.max}
      </Typography>
    </Box>
  );
}

const dataColumns: GridColDef[] = [
  { field: "cr4de_hazard_id", headerName: "ID", width: 60 },
  {
    field: "cr4de_title",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "analist",
    headerName: "Analist",
    width: 150,
    valueGetter: (params: GridValueGetterParams<RiskFileParticipation>) => {
      console.log(params.row.participations);
      return params.row.participations.find((p) => p.cr4de_role === "analist")?.cr4de_contact.firstname;
    },
    renderCell: (params: GridRenderCellParams<RiskFileParticipation>) => {
      return params.row.participations.find((p) => p.cr4de_role === "analist")?.cr4de_contact.firstname;
    },
  },
  {
    field: "cr4de_risk_category",
    headerName: "Category",
    width: 150,
  },
  {
    field: "step2A",
    headerName: "Step 2A",
    type: "number",
    width: 100,
    headerAlign: "center",
    valueGetter: (params: GridValueGetterParams<RiskFileParticipation>) => {
      if (params.row.cr4de_risk_type === RISK_TYPE.EMERGING) return 100;

      return (
        (100.0 *
          params.row.participations.filter((p) => p.cr4de_direct_analysis_finished && p.cr4de_role === "expert")
            .length) /
        params.row.participations.filter((p) => p.cr4de_role === "expert").length
      );
    },
    renderCell: (params: GridRenderCellParams<RiskFileParticipation>) => {
      return (
        <>
          <LinearProgressWithLabel
            cur={
              params.row.participations.filter((p) => p.cr4de_direct_analysis_finished && p.cr4de_role === "expert")
                .length
            }
            max={params.row.participations.filter((p) => p.cr4de_role === "expert").length}
          />
        </>
      );
    },
  },
  {
    field: "step2B",
    headerName: "Step 2B",
    type: "number",
    width: 100,
    headerAlign: "center",
    valueGetter: (params: GridValueGetterParams<RiskFileParticipation>) => {
      return (
        (100.0 *
          params.row.participations.filter((p) => p.cr4de_cascade_analysis_finished && p.cr4de_role === "expert")
            .length) /
        params.row.participations.filter((p) => p.cr4de_role === "expert").length
      );
    },
    renderCell: (params: GridRenderCellParams<RiskFileParticipation>) => {
      return (
        <>
          <LinearProgressWithLabel
            cur={
              params.row.participations.filter((p) => p.cr4de_cascade_analysis_finished && p.cr4de_role === "expert")
                .length
            }
            max={params.row.participations.filter((p) => p.cr4de_role === "expert").length}
          />
        </>
      );
    },
  },
  {
    field: "finishable",
    headerName: "Finishable",
    type: "boolean",
    width: 100,
    headerAlign: "center",
    valueGetter: (params: GridValueGetterParams<RiskFileParticipation>) => {
      return (
        (params.row.participations.filter((p) => p.cr4de_direct_analysis_finished && p.cr4de_role === "expert")
          .length >= 2 &&
          params.row.participations.filter((p) => p.cr4de_cascade_analysis_finished && p.cr4de_role === "expert")
            .length >= 2) ||
        (params.row.participations.filter((p) => p.cr4de_direct_analysis_finished && p.cr4de_role === "expert").length /
          params.row.participations.filter((p) => p.cr4de_role === "expert").length >=
          1 &&
          params.row.participations.filter((p) => p.cr4de_cascade_analysis_finished && p.cr4de_role === "expert")
            .length /
            params.row.participations.filter((p) => p.cr4de_role === "expert").length >=
            1)
      );
    },
  },
  {
    field: "importance",
    headerName: "Importance",
    width: 150,
    align: "right",
    headerAlign: "right",
    type: "number",
    valueGetter: (params: GridValueGetterParams<DVRiskFile<RiskAnalysisResults>>) => {
      return params.row.cr4de_subjective_importance / 3;
      // if (params.row.cr4de_latest_calculation && params.row.cr4de_latest_calculation.cr4de_risk_file_metrics) {
      //   return roundPerc(params.row.cr4de_latest_calculation.cr4de_risk_file_metrics.importance.total);
      // }

      // return 0;
    },
    // valueFormatter: (params: GridValueFormatterParams<DVRiskFile<RiskAnalysisResults>>) => {
    //   return `${params.value}%`;
    // },
  },
  {
    field: "reliability",
    headerName: "Reliability",
    width: 150,
    align: "right",
    headerAlign: "right",
    type: "number",
    valueGetter: (params: GridValueGetterParams<DVRiskFile<RiskAnalysisResults>>) => {
      if (params.row.cr4de_latest_calculation && params.row.cr4de_latest_calculation.cr4de_risk_file_metrics)
        return roundPerc(params.row.cr4de_latest_calculation.cr4de_risk_file_metrics.reliability.total);

      return 0;
    },
    valueFormatter: (params: GridValueFormatterParams<DVRiskFile<RiskAnalysisResults>>) => {
      return `${params.value}%`;
    },
  },
  {
    field: "divergence",
    headerName: "Divergence",
    width: 150,
    align: "right",
    headerAlign: "right",
    type: "number",
    valueGetter: (params: GridValueGetterParams<DVRiskFile<RiskAnalysisResults>>) => {
      if (params.row.cr4de_latest_calculation && params.row.cr4de_latest_calculation.cr4de_risk_file_metrics)
        return params.row.cr4de_latest_calculation.cr4de_risk_file_metrics.divergence.total;

      return 0;
    },
    valueFormatter: (params: GridValueFormatterParams<DVRiskFile<RiskAnalysisResults>>) => {
      return `${params.value}%`;
    },
  },
];

interface RiskFileParticipation extends DVRiskFile<RiskAnalysisResults> {
  participations: DVParticipation<DVContact>[];
}

export default function EditorIntroPage() {
  const navigate = useNavigate();

  const [riskFiles, setRiskFiles] = useState<RiskFileParticipation[]>([]);

  // Get all risk file records from O365 dataverse
  const { data: riskFilesRaw } = useRecords<DVRiskFile<RiskAnalysisResults>>({
    table: DataTable.RISK_FILE,
    query: "$orderby=cr4de_hazard_id&$expand=cr4de_latest_calculation",
    transformResult: (riskFiles: DVRiskFile<RiskAnalysisResults>[]): DVRiskFile<RiskAnalysisResults>[] => {
      return riskFiles.map((rf) => ({
        ...rf,
        cr4de_latest_calculation:
          rf.cr4de_latest_calculation !== null
            ? {
                ...rf.cr4de_latest_calculation,
                cr4de_results: JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as unknown as string),
                cr4de_risk_file_metrics: JSON.parse(
                  rf.cr4de_latest_calculation?.cr4de_risk_file_metrics as unknown as string
                ),
                cr4de_metrics: null,
              }
            : null,
      }));
    },
  });
  const { data: participations } = useRecords<DVParticipation<DVContact>>({
    table: DataTable.PARTICIPATION,
    query:
      "$select=cr4de_contact,_cr4de_risk_file_value,cr4de_role,cr4de_direct_analysis_finished,cr4de_cascade_analysis_finished&$expand=cr4de_contact($select=emailaddress1,firstname)",
  });

  useEffect(() => {
    if (!riskFilesRaw || !participations) return;

    setRiskFiles(
      riskFilesRaw.map((r) => ({
        ...r,
        participations: participations.filter((p) => p._cr4de_risk_file_value === r.cr4de_riskfilesid),
      }))
    );
  }, [riskFilesRaw, participations]);

  usePageTitle("BNRA 2023 - 2026 Hazard Catalogue");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Hazard Catalogue", url: "/hazards" },
  ]);

  return (
    <>
      {riskFiles && (
        <Box sx={{ mb: 8, mx: 8 }}>
          <Paper sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
            <DataGrid
              columns={dataColumns}
              rows={riskFiles}
              getRowId={(r: DVRiskFile) => r.cr4de_riskfilesid}
              loading={riskFiles.length <= 0}
              onRowClick={(params: GridRowParams<RiskFileParticipation>) => {
                if (!riskFiles) return;

                navigate(`/risks/${params.row.cr4de_riskfilesid}`);
              }}
            />
          </Paper>
        </Box>
      )}
      <Container>
        <RiskFileList
          riskFiles={riskFiles}
          onClick={async (riskFile) => {
            if (!riskFiles) return;

            navigate(`/risks/${riskFile.cr4de_riskfilesid}`);
          }}
        />
      </Container>
    </>
  );
}
