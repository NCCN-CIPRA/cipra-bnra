import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";

import { CategoryIcon } from "../../functions/getIcons";
import { capFirst } from "../../functions/capFirst";

const columns = (t: typeof i18next.t): GridColDef<DVRiskSummary>[] => [
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
];

export default function BasicRiskCatalogue({
  riskFiles,
  isLoading,
}: {
  riskFiles: DVRiskSummary[] | undefined;
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
        }}
        onRowClick={(p) => navigate(`${p.row._cr4de_risk_file_value}`)}
        // slots={{ toolbar: CustomToolbar }}
        showToolbar
        loading={isLoading}
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
          },
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
