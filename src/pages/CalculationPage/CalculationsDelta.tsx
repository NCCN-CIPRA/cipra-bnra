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
import { SCENARIOS, getWorstCaseScenario } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";

const filteredAttributes = ["timestamp", "reliability"];

const columns: GridColDef[] = [
  {
    field: "code",
    headerName: "ID",
    minWidth: 50,
  },
  {
    field: "riskTitle",
    headerName: "Risk Title",
    minWidth: 150,
    flex: 1,
  },
  {
    field: "scenario",
    headerName: "Δ Scenario",
    minWidth: 200,
    //   renderCell: (params: GridRenderCellParams) => {
    //     return `${params.value[0].toUpperCase()}${params.value.slice(1)}`;
    //   },
  },
  {
    field: "tp",
    headerName: "Δ TP",
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => round(100 * params.value, 2) + "%",
    // renderCell: (params: GridRenderCellParams) => {
    //   return `${(100 * params.value).toLocaleString()} %`;
    // },
  },
  {
    field: "ti",
    headerName: "Δ TI",
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => round(100 * params.value, 2) + "%",
    // renderCell: (params: GridRenderCellParams) => getMoneyString(params.value),
  },
  // {
  //   field: "tr",
  //   headerName: "Δ TR",
  //   width: 150,
  //   valueFormatter: (params: GridValueFormatterParams) => round(params.value, 0),
  //   // renderCell: (params: GridRenderCellParams) => getMoneyString(params.value),
  // },
];

interface DiffRiskCalculation extends RiskCalculation {
  scenario: string | null;
}

export default function CalculationsDelta({
  calculations,
  previousCalculations,
  setSelectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  previousCalculations: RiskCalculation[] | null;
  setSelectedNodeId: (id: string) => void;
}) {
  const [sortedNew, setSortedNew] = useState<RiskCalculation[] | null>(null);
  const [sortedOld, setSortedOld] = useState<RiskCalculation[] | null>(null);
  const [expand, setExpand] = useState(false);

  const delta: DiffRiskCalculation[] = useMemo(() => {
    if (!calculations || !previousCalculations) return [];

    const SN = calculations.sort((a, b) => (a.riskId > b.riskId ? 1 : -1));
    const SO = previousCalculations.sort((a, b) => (a.riskId > b.riskId ? 1 : -1));

    return SN.map((n, i) => {
      const o = SO[i];

      const oldMRS = getWorstCaseScenario(o);
      const newMRS = getWorstCaseScenario(n);

      let diff: DiffRiskCalculation = {
        ...o,
        scenario: oldMRS === newMRS ? null : `${oldMRS} -> ${newMRS}`,
      };

      for (let attr of Object.keys(n).filter((a) => filteredAttributes.indexOf(a) < 0)) {
        if (typeof n[attr as keyof RiskCalculation] === "number") {
          // @ts-expect-error
          diff[attr as keyof RiskCalculation] =
            ((n[attr as keyof RiskCalculation] as number) - (o[attr as keyof RiskCalculation] as number)) /
            (o[attr as keyof RiskCalculation] as number);
        }
      }

      // if (diff.riskId === undefined) {
      //   console.log(diff);
      // } else {
      //   console.log(diff.riskId);
      // }

      return diff as DiffRiskCalculation;
    });
  }, [calculations, previousCalculations]);

  return (
    <Accordion expanded={expand} onChange={(e, ex) => setExpand(ex)} disabled={!calculations || !previousCalculations}>
      <AccordionSummary>
        <Typography variant="subtitle2">Difference with last calculations</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: 1000 }}>
        {expand && (
          <DataGrid
            rows={delta || []}
            columns={columns}
            getRowId={(d: RiskCalculation) => d.riskId}
            onRowClick={(params) => setSelectedNodeId(params.row.riskId)}
          />
        )}
      </AccordionDetails>
      <AccordionActions sx={{ mx: 2 }}></AccordionActions>
    </Accordion>
  );
}
