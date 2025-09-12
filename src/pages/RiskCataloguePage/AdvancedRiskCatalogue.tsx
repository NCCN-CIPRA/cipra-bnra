import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { CategoryIcon } from "../../functions/getIcons";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import { capFirst } from "../../functions/capFirst";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { renderProgress } from "./renderProgress";
import { getImpactScaleFloat } from "../../functions/Impact";

const columns = (t: typeof i18next.t): GridColDef<DVRiskSnapshot>[] => [
  { field: "cr4de_hazard_id", headerName: "ID", width: 80 },
  {
    field: "title",
    headerName: t("hazardCatalogue.tutorial.2.3", "Title"),
    flex: 1,
    editable: true,
    valueGetter: (_value, params) =>
      t(`risk.${params.cr4de_hazard_id}.name`, params.cr4de_title),
  },
  {
    field: "cr4de_category",
    headerName: capFirst(t("category")),
    width: 100,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            ml: 0.5,
          }}
        >
          <CategoryIcon category={params.value} />
        </Box>
      );
    },
  },
  {
    field: "cr4de_mrs",
    headerName: t("hazardCatalogue.mrs"),
    width: 150,
    editable: true,
    renderCell: (params: GridRenderCellParams<DVRiskSnapshot>) => {
      return params.value ? (
        <Button
          variant="outlined"
          sx={{
            color: SCENARIO_PARAMS[params.value as SCENARIOS].color,
            borderColor: SCENARIO_PARAMS[params.value as SCENARIOS].color,
            borderRadius: "50%",
            backgroundColor: `${
              SCENARIO_PARAMS[params.value as SCENARIOS].color
            }20`,
            width: 30,
            minWidth: 30,
            height: 30,
            pointerEvents: "none",
            ml: 7,
          }}
        >
          {params.value[0].toUpperCase()}
        </Button>
      ) : (
        <Typography
          sx={{
            borderRadius: "50%",
            width: 30,
            minWidth: 30,
            height: 30,
            pointerEvents: "none",
            ml: 8.5,
          }}
        >
          -
        </Typography>
      );
    },
  },
  {
    field: "tp",
    headerName: t("learning.probability.2.text.title"),
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].tp.yearly.scale,
    renderCell: renderProgress,
  },
  {
    field: "ti",
    headerName: "Impact",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.all.scaleTot,
    renderCell: renderProgress,
  },
  {
    field: "tr",
    headerName: "Total Risk",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        (100 *
          (row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].tp.yearly
            .scale *
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.all
              .scaleTot)) /
          5
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "ha",
    headerName: "Ha",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.ha.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "hb",
    headerName: "Hb",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.hb.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "hc",
    headerName: "Hc",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.hc.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "sa",
    headerName: "Sa",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sa.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "sb",
    headerName: "Sb",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sb.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "sc",
    headerName: "Sc",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sc.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "sd",
    headerName: "Sd",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sd.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "ea",
    headerName: "Ea",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.ea.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "fa",
    headerName: "Fa",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.fa.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "fb",
    headerName: "Fb",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      Math.round(
        100 *
          getImpactScaleFloat(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.fb.abs
          )
      ) / 100,
    renderCell: renderProgress,
  },
];

export default function AdvancedRiskCatalogue({
  riskFiles,
  isLoading,
}: {
  riskFiles: DVRiskSnapshot[] | undefined;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Paper sx={{ mb: 0, mx: 9, height: "calc(100vh - 170px)" }}>
      <DataGrid
        rows={riskFiles}
        columns={columns(t)}
        getRowId={(rf) => rf._cr4de_risk_file_value}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
          sorting: {
            sortModel: [
              {
                field: "cr4de_hazard_id",
                sort: "asc",
              },
            ],
          },
          columns: {
            columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
              tr: false,
              ha: false,
              hb: false,
              hc: false,
              sa: false,
              sb: false,
              sc: false,
              sd: false,
              ea: false,
              fa: false,
              fb: false,
            },
          },
        }}
        // pageSizeOptions={[5]}
        // checkboxSelection
        // disableRowSelectionOnClick
        onRowClick={(p) => navigate(`${p.row._cr4de_risk_file_value}`)}
        // slots={{ toolbar: CustomToolbar }}
        showToolbar
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "skeleton",
          },
        }}
        sx={{
          // disable cell selection style
          ".MuiDataGrid-cell:focus": {
            outline: "none",
          },
          // pointer cursor on ALL rows
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
        }}
      />
    </Paper>
  );
}
