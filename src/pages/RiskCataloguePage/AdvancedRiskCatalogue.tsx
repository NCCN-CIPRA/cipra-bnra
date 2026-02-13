import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { CategoryIcon } from "../../functions/getIcons";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import { capFirst } from "../../functions/capFirst";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";
import { renderProgress } from "./renderProgress";
import { getImpactScaleFloat } from "../../functions/Impact";
import { BasePageContext } from "../BasePage";
import { Indicators } from "../../types/global";
import {
  pDailyFromReturnPeriodMonths,
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
  tpScale5to7,
} from "../../functions/indicators/probability";
import {
  iScale7FromEuros,
  tiScale5to7,
} from "../../functions/indicators/impact";
import {
  parseRiskFileQuantiResults,
  RiskFileQuantiResults,
  SerializedRiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import { SerializedRiskQualis } from "../../types/dataverse/Riskfile";

const columns = (
  t: typeof i18next.t,
  maxScale: number = 5,
  rescaleTP: (n: number) => number = (n) => n,
  rescaleDI: (n: number) => number = (n) => n,
  rescaleTI: (n: number) => number = (n) => n,
): GridColDef<
  DVRiskSnapshot<
    unknown,
    RiskSnapshotResults,
    SerializedRiskQualis,
    RiskFileQuantiResults
  >
>[] => [
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
      row.cr4de_quanti_results
        ? pScale7FromReturnPeriodMonths(
            returnPeriodMonthsFromYearlyEventRate(
              row.cr4de_quanti_results[row.cr4de_mrs || SCENARIOS.CONSIDERABLE]
                ?.probabilityStatistics?.sampleMean || 0,
            ),
          )
        : rescaleTP(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].tp.yearly
              .scale,
          ),
    renderCell: renderProgress,
  },
  {
    field: "ti",
    headerName: "Impact",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? iScale7FromEuros(
            row.cr4de_quanti_results[row.cr4de_mrs || SCENARIOS.CONSIDERABLE]
              ?.impactStatistics?.sampleMedian.all || 0,
          )
        : rescaleTI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.all
              .scaleTot,
          ),
    renderCell: renderProgress,
  },
  {
    field: "tr",
    headerName: "Total Risk",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? pScale7FromReturnPeriodMonths(
            returnPeriodMonthsFromYearlyEventRate(
              row.cr4de_quanti_results[row.cr4de_mrs || SCENARIOS.CONSIDERABLE]
                ?.probabilityStatistics?.sampleMean || 0,
            ),
          ) *
          iScale7FromEuros(
            row.cr4de_quanti_results[row.cr4de_mrs || SCENARIOS.CONSIDERABLE]
              ?.impactStatistics?.sampleMedian.all || 0,
          )
        : Math.round(
            (100 *
              (rescaleTP(
                row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].tp
                  .yearly.scale,
              ) *
                rescaleTI(
                  row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti
                    .all.scaleTot,
                ))) /
              maxScale,
          ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "ha",
    headerName: "Ha",
    width: 200,
    editable: true,
    valueGetter: (_, row) => {
      return (
        Math.round(
          100 *
            rescaleDI(
              row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.ha
                .abs,
            ),
        ) / 100
      );
    },
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.hb.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.hc.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sa.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sb.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sc.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.sd.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.ea.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.fa.abs,
          ),
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
          rescaleDI(
            row.cr4de_quanti[row.cr4de_mrs || SCENARIOS.CONSIDERABLE].ti.fb.abs,
          ),
      ) / 100,
    renderCell: renderProgress,
  },
  {
    field: "tp_c",
    headerName: "Total Probability (considerable)",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? pScale7FromReturnPeriodMonths(
            returnPeriodMonthsFromYearlyEventRate(
              row.cr4de_quanti_results[SCENARIOS.CONSIDERABLE]
                ?.probabilityStatistics?.sampleMean || 0,
            ),
          )
        : rescaleTP(row.cr4de_quanti[SCENARIOS.CONSIDERABLE].tp.yearly.scale),
    renderCell: renderProgress,
  },
  {
    field: "ti_c",
    headerName: "Total Impact (considerable)",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? iScale7FromEuros(
            row.cr4de_quanti_results[SCENARIOS.CONSIDERABLE]?.impactStatistics
              ?.sampleMedian.all || 0,
          )
        : rescaleTI(row.cr4de_quanti[SCENARIOS.CONSIDERABLE].ti.all.scaleTot),
    renderCell: renderProgress,
  },
  {
    field: "tp_m",
    headerName: "Total Probability (major)",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? pScale7FromReturnPeriodMonths(
            returnPeriodMonthsFromYearlyEventRate(
              row.cr4de_quanti_results[SCENARIOS.MAJOR]?.probabilityStatistics
                ?.sampleMean || 0,
            ),
          )
        : rescaleTP(row.cr4de_quanti[SCENARIOS.MAJOR].tp.yearly.scale),
    renderCell: renderProgress,
  },
  {
    field: "ti_m",
    headerName: "Total Impact (major)",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? iScale7FromEuros(
            row.cr4de_quanti_results[SCENARIOS.MAJOR]?.impactStatistics
              ?.sampleMedian.all || 0,
          )
        : rescaleTI(row.cr4de_quanti[SCENARIOS.MAJOR].ti.all.scaleTot),
    renderCell: renderProgress,
  },
  {
    field: "tp_e",
    headerName: "Total Probability (extreme)",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? pScale7FromReturnPeriodMonths(
            returnPeriodMonthsFromYearlyEventRate(
              row.cr4de_quanti_results[SCENARIOS.EXTREME]?.probabilityStatistics
                ?.sampleMean || 0,
            ),
          )
        : rescaleTP(row.cr4de_quanti[SCENARIOS.EXTREME].tp.yearly.scale),
    renderCell: renderProgress,
  },
  {
    field: "ti_e",
    headerName: "Total Impact (extreme)",
    width: 200,
    editable: true,
    valueGetter: (_, row) =>
      row.cr4de_quanti_results
        ? iScale7FromEuros(
            row.cr4de_quanti_results[SCENARIOS.EXTREME]?.impactStatistics
              ?.sampleMedian.all || 0,
          )
        : rescaleTI(row.cr4de_quanti[SCENARIOS.EXTREME].ti.all.scaleTot),
    renderCell: renderProgress,
  },
  {
    field: "mrs_new",
    headerName: "New Most Relevant Scenario",
    width: 200,
    editable: true,
    valueGetter: (_, row) => {
      if (!row.cr4de_quanti_results) return null;

      const c = iScale7FromEuros(
        pDailyFromReturnPeriodMonths(
          returnPeriodMonthsFromYearlyEventRate(
            row.cr4de_quanti_results[SCENARIOS.CONSIDERABLE]
              ?.probabilityStatistics?.sampleMean || 0,
          ),
        ) *
          (row.cr4de_quanti_results[SCENARIOS.CONSIDERABLE]?.impactStatistics
            ?.sampleMedian.all || 0),
        undefined,
        100,
      );
      const m = iScale7FromEuros(
        pDailyFromReturnPeriodMonths(
          returnPeriodMonthsFromYearlyEventRate(
            row.cr4de_quanti_results[SCENARIOS.MAJOR]?.probabilityStatistics
              ?.sampleMean || 0,
          ),
        ) *
          (row.cr4de_quanti_results[SCENARIOS.MAJOR]?.impactStatistics
            ?.sampleMedian.all || 0),
        undefined,
        100,
      );
      const e = iScale7FromEuros(
        pDailyFromReturnPeriodMonths(
          returnPeriodMonthsFromYearlyEventRate(
            row.cr4de_quanti_results[SCENARIOS.EXTREME]?.probabilityStatistics
              ?.sampleMean || 0,
          ),
        ) *
          (row.cr4de_quanti_results[SCENARIOS.EXTREME]?.impactStatistics
            ?.sampleMedian.all || 0),
        undefined,
        100,
      );

      if (e > c && e > m) return SCENARIOS.EXTREME;
      if (m > c) return SCENARIOS.MAJOR;
      return SCENARIOS.CONSIDERABLE;
    },
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
    field: "tr_max",
    headerName: "Total Risk (max)",
    width: 200,
    editable: true,
    valueGetter: (_, row) => {
      if (!row.cr4de_quanti_results) return null;

      const c = iScale7FromEuros(
        pDailyFromReturnPeriodMonths(
          returnPeriodMonthsFromYearlyEventRate(
            row.cr4de_quanti_results[SCENARIOS.CONSIDERABLE]
              ?.probabilityStatistics?.sampleMean || 0,
          ),
        ) *
          (row.cr4de_quanti_results[SCENARIOS.CONSIDERABLE]?.impactStatistics
            ?.sampleMedian.all || 0),
        undefined,
        100,
      );
      const m = iScale7FromEuros(
        pDailyFromReturnPeriodMonths(
          returnPeriodMonthsFromYearlyEventRate(
            row.cr4de_quanti_results[SCENARIOS.MAJOR]?.probabilityStatistics
              ?.sampleMean || 0,
          ),
        ) *
          (row.cr4de_quanti_results[SCENARIOS.MAJOR]?.impactStatistics
            ?.sampleMedian.all || 0),
        undefined,
        100,
      );
      const e = iScale7FromEuros(
        pDailyFromReturnPeriodMonths(
          returnPeriodMonthsFromYearlyEventRate(
            row.cr4de_quanti_results[SCENARIOS.EXTREME]?.probabilityStatistics
              ?.sampleMean || 0,
          ),
        ) *
          (row.cr4de_quanti_results[SCENARIOS.EXTREME]?.impactStatistics
            ?.sampleMedian.all || 0),
        undefined,
        100,
      );

      return Math.round(10 * Math.max(c, m, e)) / 10;
    },
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
  const { indicators } = useOutletContext<BasePageContext>();

  const parsedRiskFiles:
    | DVRiskSnapshot<
        unknown,
        RiskSnapshotResults,
        SerializedRiskQualis,
        RiskFileQuantiResults
      >[]
    | undefined = riskFiles?.map((rf) => ({
    ...rf,
    cr4de_quanti_results:
      rf.cr4de_quanti_results && typeof rf.cr4de_quanti_results === "string"
        ? parseRiskFileQuantiResults(
            rf.cr4de_quanti_results as SerializedRiskFileQuantiResults,
          )
        : null,
  }));

  return (
    <Paper sx={{ mb: 0, mx: 9, height: "calc(100vh - 170px)" }}>
      <DataGrid
        rows={parsedRiskFiles}
        columns={
          indicators === Indicators.V1
            ? columns(t, 5, (n) => n, getImpactScaleFloat)
            : columns(t, 7, tpScale5to7, iScale7FromEuros, tiScale5to7)
        }
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
              tp_c: false,
              ti_c: false,
              tp_m: false,
              ti_m: false,
              tp_e: false,
              ti_e: false,
              mrs_new: false,
              tr_max: false,
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
