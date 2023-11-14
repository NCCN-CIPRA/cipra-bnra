import { useState, useMemo } from "react";
import { DataGrid, GridRowsProp, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getMoneyString } from "../../functions/Impact";
import { Box, Card, CardActions, CardContent, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

const columns: GridColDef[] = [
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
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return `${(100 * params.value).toLocaleString()} %`;
    },
  },
  {
    field: "ti",
    headerName: "TI",
    width: 200,
    valueFormatter: (params: GridValueFormatterParams<number>) => getMoneyString(params.value),
  },
  {
    field: "tr",
    headerName: "TR",
    width: 200,
    valueFormatter: (params: GridValueFormatterParams<number>) => getMoneyString(params.value),
  },
];

export default function CalculationsDataGrid({ data }: { data: RiskCalculation[] }) {
  const [rows, setRows] = useState<GridRowsProp | null>(null);
  const [worstCase, setWorstCase] = useState(false);

  useMemo(() => {
    setRows(
      data.reduce((split, c) => {
        const rs = [c.tp_c * c.ti_c, c.tp_m * c.ti_m, c.tp_e * c.ti_e];

        if (worstCase) {
          return [
            ...split,
            [
              {
                id: `${c.riskId}_c`,
                title: `Considerable ${c.riskTitle}`,
                tp: c.tp_c,
                ti: c.ti_c,
                tr: c.tp_c * c.ti_c,
              },
              {
                id: `${c.riskId}_m`,
                title: `Major ${c.riskTitle}`,
                tp: c.tp_m,
                ti: c.ti_m,
                tr: c.tp_m * c.ti_m,
              },
              {
                id: `${c.riskId}_e`,
                title: `Extreme ${c.riskTitle}`,
                tp: c.tp_e,
                ti: c.ti_e,
                tr: c.tp_e * c.ti_e,
              },
            ][rs.indexOf(Math.max(...rs))],
          ];
        } else {
          return [
            ...split,
            {
              id: `${c.riskId}_c`,
              title: `Considerable ${c.riskTitle}`,
              tp: c.tp_c,
              ti: c.ti_c,
              tr: c.tp_c * c.ti_c,
            },
            {
              id: `${c.riskId}_m`,
              title: `Major ${c.riskTitle}`,
              tp: c.tp_m,
              ti: c.ti_m,
              tr: c.tp_m * c.ti_m,
            },
            {
              id: `${c.riskId}_e`,
              title: `Extreme ${c.riskTitle}`,
              tp: c.tp_e,
              ti: c.ti_e,
              tr: c.tp_e * c.ti_e,
            },
          ];
        }
      }, [] as GridRowsProp)
    );
  }, [data, worstCase]);

  return (
    <Card>
      <CardContent sx={{ height: 1000 }}>
        <DataGrid rows={rows || []} columns={columns} />
      </CardContent>
      <CardActions sx={{ mx: 2 }}>
        <Box>
          <Typography variant="subtitle2">Risk table parameters:</Typography>
        </Box>
        <FormGroup sx={{}}>
          <FormControlLabel
            control={<Checkbox checked={worstCase} onChange={(e) => setWorstCase(e.target.checked)} />}
            label="Show only worst case scenario"
          />
        </FormGroup>
      </CardActions>
    </Card>
  );
}
