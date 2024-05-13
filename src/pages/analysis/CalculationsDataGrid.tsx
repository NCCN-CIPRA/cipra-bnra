import { useState, useMemo } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
  GridToolbar,
  gridFilteredSortedRowIdsSelector,
  GridRenderCellParams,
  gridDataRowIdsSelector,
  useGridApiContext,
  GridCsvGetRowsToExportParams,
  GridRowId,
} from "@mui/x-data-grid";
import { Quality, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getMoneyString } from "../../functions/Impact";
import {
  Box,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { SCENARIOS } from "../../functions/scenarios";

const columns: GridColDef[] = [
  {
    field: "code",
    headerName: "ID",
    minWidth: 50,
  },
  {
    field: "scenario",
    headerName: "Scenario",
    minWidth: 120,
    renderCell: (params: GridRenderCellParams) => {
      return `${params.value[0].toUpperCase()}${params.value.slice(1)}`;
    },
  },
  {
    field: "title",
    headerName: "Risk Title",
    minWidth: 350,
    flex: 1,
  },
  {
    field: "tp",
    headerName: "TP",
    width: 100,
    valueFormatter: (params: GridValueFormatterParams) => params.value,
    renderCell: (params: GridRenderCellParams) => {
      return `${(100 * params.value).toLocaleString()} %`;
    },
  },
  {
    field: "ti",
    headerName: "TI",
    width: 100,
    valueFormatter: (params: GridValueFormatterParams) => params.value,
    renderCell: (params: GridRenderCellParams) => getMoneyString(params.value),
  },
  {
    field: "tr",
    headerName: "TR",
    width: 100,
    valueFormatter: (params: GridValueFormatterParams) => params.value,
    renderCell: (params: GridRenderCellParams) => getMoneyString(params.value),
  },
  {
    field: "tr50",
    headerName: "TR 2050",
    width: 100,
    valueFormatter: (params: GridValueFormatterParams) => params.value,
    renderCell: (params: GridRenderCellParams) => getMoneyString(params.value),
  },
  {
    field: "dtr50",
    headerName: "ΔTR 2050",
    width: 100,
    valueFormatter: (params: GridValueFormatterParams) => params.value,
    renderCell: (params: GridRenderCellParams) => "X " + Math.round(100 * params.value) / 100,
  },
  {
    field: "consensus",
    headerName: "Consensus",
    width: 100,
    type: "boolean",
  },
  {
    field: "keyRisk",
    headerName: "Key Risk",
    width: 100,
    type: "boolean",
  },
];

const getRowsToExport = ({ apiRef }: GridCsvGetRowsToExportParams): GridRowId[] => {
  return gridFilteredSortedRowIdsSelector(apiRef);
};

export default function CalculationsDataGrid({
  data,
  setSelectedRiskId,
}: {
  data: RiskCalculation[] | null;
  setSelectedRiskId: (id: string) => void;
}) {
  const [rows, setRows] = useState<GridRowsProp | null>(null);
  const [worstCase, setWorstCase] = useState(false);
  const [worstCase2050, setWorstCase2050] = useState(false);

  useMemo(() => {
    if (!data) return;

    setRows(
      data.reduce((split, c) => {
        const rs = [c.tp_c * c.ti_c, c.tp_m * c.ti_m, c.tp_e * c.ti_e];
        const rs2050 = [c.tp50_c * c.ti_c, c.tp50_m * c.ti_m, c.tp50_e * c.ti_e];

        if (worstCase) {
          return [
            ...split,
            [
              {
                id: `${c.riskId}_c`,
                riskId: c.riskId,
                scenario: SCENARIOS.CONSIDERABLE,
                title: c.riskTitle,
                tp: c.tp_c,
                ti: c.ti_c,
                tr: c.tp_c * c.ti_c,
                tp50: c.tp50_c,
                tr50: c.tp50_c * c.ti_c,
                dtr50: (c.tp50_c * c.ti_c) / (c.tp_c * c.ti_c),
                consensus: c.quality === Quality.CONSENSUS,
                keyRisk: c.keyRisk,
                code: c.code,
              },
              {
                id: `${c.riskId}_m`,
                riskId: c.riskId,
                scenario: SCENARIOS.MAJOR,
                title: c.riskTitle,
                tp: c.tp_m,
                ti: c.ti_m,
                tr: c.tp_m * c.ti_m,
                tp50: c.tp50_m,
                tr50: c.tp50_m * c.ti_m,
                dtr50: (c.tp50_m * c.ti_m) / (c.tp_m * c.ti_m),
                consensus: c.quality === Quality.CONSENSUS,
                keyRisk: c.keyRisk,
                code: c.code,
              },
              {
                id: `${c.riskId}_e`,
                riskId: c.riskId,
                scenario: SCENARIOS.EXTREME,
                title: c.riskTitle,
                tp: c.tp_e,
                ti: c.ti_e,
                tr: c.tp_e * c.ti_e,
                tp50: c.tp50_e,
                tr50: c.tp50_e * c.ti_e,
                dtr50: (c.tp50_e * c.ti_e) / (c.tp_e * c.ti_e),
                consensus: c.quality === Quality.CONSENSUS,
                keyRisk: c.keyRisk,
                code: c.code,
              },
            ][rs.indexOf(Math.max(...rs))],
          ];
        } else if (worstCase2050) {
          return [
            ...split,
            [
              {
                id: `${c.riskId}_c`,
                riskId: c.riskId,
                scenario: SCENARIOS.CONSIDERABLE,
                title: c.riskTitle,
                tp: c.tp_c,
                ti: c.ti_c,
                tr: c.tp_c * c.ti_c,
                tp50: c.tp50_c,
                tr50: c.tp50_c * c.ti_c,
                dtr50: (c.tp50_c * c.ti_c) / (c.tp_c * c.ti_c),
                consensus: c.quality === Quality.CONSENSUS,
                keyRisk: c.keyRisk,
                code: c.code,
              },
              {
                id: `${c.riskId}_m`,
                riskId: c.riskId,
                scenario: SCENARIOS.MAJOR,
                title: c.riskTitle,
                tp: c.tp_m,
                ti: c.ti_m,
                tr: c.tp_m * c.ti_m,
                tp50: c.tp50_m,
                tr50: c.tp50_m * c.ti_m,
                dtr50: (c.tp50_m * c.ti_m) / (c.tp_m * c.ti_m),
                consensus: c.quality === Quality.CONSENSUS,
                keyRisk: c.keyRisk,
                code: c.code,
              },
              {
                id: `${c.riskId}_e`,
                riskId: c.riskId,
                scenario: SCENARIOS.EXTREME,
                title: c.riskTitle,
                tp: c.tp_e,
                ti: c.ti_e,
                tr: c.tp_e * c.ti_e,
                tp50: c.tp50_e,
                tr50: c.tp50_e * c.ti_e,
                dtr50: (c.tp50_e * c.ti_e) / (c.tp_e * c.ti_e),
                consensus: c.quality === Quality.CONSENSUS,
                keyRisk: c.keyRisk,
                code: c.code,
              },
            ][rs.indexOf(Math.max(...rs2050))],
          ];
        } else {
          return [
            ...split,
            {
              id: `${c.riskId}_c`,
              riskId: c.riskId,
              scenario: SCENARIOS.CONSIDERABLE,
              title: c.riskTitle,
              tp: c.tp_c,
              ti: c.ti_c,
              tr: c.tp_c * c.ti_c,
              tp50: c.tp50_c,
              tr50: c.tp50_c * c.ti_c,
              dtr50: (c.tp50_c * c.ti_c) / (c.tp_c * c.ti_c),
              consensus: c.quality === Quality.CONSENSUS,
              keyRisk: c.keyRisk,
              code: c.code,
            },
            {
              id: `${c.riskId}_m`,
              riskId: c.riskId,
              scenario: SCENARIOS.MAJOR,
              title: c.riskTitle,
              tp: c.tp_m,
              ti: c.ti_m,
              tr: c.tp_m * c.ti_m,
              tp50: c.tp50_m,
              tr50: c.tp50_m * c.ti_m,
              dtr50: (c.tp50_m * c.ti_m) / (c.tp_m * c.ti_m),
              consensus: c.quality === Quality.CONSENSUS,
              keyRisk: c.keyRisk,
              code: c.code,
            },
            {
              id: `${c.riskId}_e`,
              riskId: c.riskId,
              title: c.riskTitle,
              scenario: SCENARIOS.EXTREME,
              tp: c.tp_e,
              ti: c.ti_e,
              tr: c.tp_e * c.ti_e,
              tp50: c.tp50_e,
              tr50: c.tp50_e * c.ti_e,
              dtr50: (c.tp50_e * c.ti_e) / (c.tp_e * c.ti_e),
              consensus: c.quality === Quality.CONSENSUS,
              keyRisk: c.keyRisk,
              code: c.code,
            },
          ];
        }
      }, [] as GridRowsProp)
    );
  }, [data, worstCase]);

  return (
    <Accordion disabled={!data}>
      <AccordionSummary>
        <Typography variant="subtitle2">Risk table</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: 1000 }}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              csvOptions: {
                delimiter: ";",
                getRowsToExport,
              },
            },
          }}
          onRowClick={(params) => setSelectedRiskId(params.row.riskId)}
        />
      </AccordionDetails>
      <AccordionActions sx={{ mx: 2 }}>
        <Box>
          <Typography variant="subtitle2">filters:</Typography>
        </Box>
        <FormGroup sx={{}}>
          <FormControlLabel
            control={<Checkbox checked={worstCase} onChange={(e) => setWorstCase(e.target.checked)} />}
            label="Show only worst case scenario"
          />
        </FormGroup>
        <FormGroup sx={{}}>
          <FormControlLabel
            control={<Checkbox checked={worstCase2050} onChange={(e) => setWorstCase2050(e.target.checked)} />}
            label="Show only worst case scenario in 2050"
          />
        </FormGroup>
      </AccordionActions>
    </Accordion>
  );
}
