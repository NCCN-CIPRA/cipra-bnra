import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import {
  Box,
  Button,
  InputAdornment,
  LinearProgress,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
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
import { LoggedInUser } from "../../hooks/useLoggedInUser";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import { capFirst } from "../../functions/capFirst";

const columns = (
  user: LoggedInUser | null | undefined,
  t: typeof i18next.t
): GridColDef<DVRiskSummary>[] => [
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
  ...(user
    ? [
        {
          field: "cr4de_mrs",
          headerName: t("hazardCatalogue.mrs"),
          width: 150,
          editable: true,
          renderCell: (params: GridRenderCellParams<DVRiskSummary>) => {
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
          field: "cr4de_mrs_p",
          headerName: t("learning.probability.2.text.title"),
          width: 200,
          editable: true,
          renderCell: (params: GridRenderCellParams<DVRiskSummary>) => {
            return (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={params.value * 20}
                  sx={{ width: "100%", height: 8 }}
                />
              </Box>
            );
          },
        },
        {
          field: "cr4de_mrs_i",
          headerName: "Impact",
          width: 200,
          editable: true,
          renderCell: (params: GridRenderCellParams<DVRiskSummary>) => {
            console.log(params);
            return (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={params.value * 20}
                  sx={{ width: "100%", height: 8 }}
                />
              </Box>
            );
          },
        },
      ]
    : []),
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
        columns={columns(user, t)}
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
