import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Box, InputAdornment, Paper, styled, TextField } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  Toolbar,
} from "@mui/x-data-grid";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../types/dataverse/tables";
import useAPI from "../../hooks/useAPI";

import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { CategoryIcon } from "../../functions/getIcons";
import { BasePageContext } from "../BasePage";

const columns = (t: typeof i18next.t): GridColDef<DVRiskSummary>[] => [
  { field: "cr4de_hazard_id", headerName: "ID", width: 80 },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    editable: true,
    valueGetter: (_value, params) => t(`risk.${params.cr4de_hazard_id}.name`),
  },
  {
    field: "cr4de_category",
    headerName: "Category",
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

const StyledQuickFilter = styled(QuickFilter)({
  marginLeft: "auto",
  width: "100%",
});

function CustomToolbar() {
  return (
    <Toolbar>
      <StyledQuickFilter expanded>
        <QuickFilterControl
          render={({ ref, ...other }) => (
            <TextField
              {...other}
              fullWidth
              inputRef={ref}
              aria-label="Search Risk Catalogue"
              placeholder="Search Risk Catalogue"
              size="small"
              variant="standard"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mb: 0.5 }}>
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: other.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...other.slotProps?.input,
                },
                ...other.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

export default function RiskCataloguePage() {
  const { t } = useTranslation();
  const api = useAPI();
  const navigate = useNavigate();
  const { user } = useOutletContext<BasePageContext>();

  const { data: riskFiles, isLoading: isLoadingRiskFiles } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY],
    queryFn: () => api.getRiskSummaries(),
  });

  useQuery({
    queryKey: [DataTable.RISK_FILE],
    queryFn: () => api.getRiskFiles(),
    enabled: Boolean(user && user.roles.verified),
  });

  useQuery({
    queryKey: [DataTable.RISK_CASCADE],
    queryFn: () => api.getRiskCascades(),
    enabled: Boolean(user && user.roles.verified),
  });

  usePageTitle(t("sideDrawer.hazardCatalogue", "Hazard Catalogue"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"), url: "" },
  ]);

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
        }}
        // pageSizeOptions={[5]}
        // checkboxSelection
        // disableRowSelectionOnClick
        onRowClick={(p) => navigate(`${p.row._cr4de_risk_file_value}`)}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        loading={isLoadingRiskFiles}
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
