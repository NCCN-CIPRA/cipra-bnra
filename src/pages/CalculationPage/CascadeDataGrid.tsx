import { useState, useMemo, useEffect } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
  GridCellCheckboxRenderer,
  GridEventListener,
  useGridApiRef,
} from "@mui/x-data-grid";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import {
  Box,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  FormGroup,
  Typography,
} from "@mui/material";
import useAPI from "../../hooks/useAPI";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Cascade Title",
    minWidth: 350,
    flex: 1,
  },
  {
    field: "cp",
    headerName: "AVG CP",
    width: 100,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return `${(100 * params.value).toLocaleString()} %`;
    },
  },
  {
    field: "ip",
    headerName: "AVG IP",
    width: 200,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      return `${(100 * params.value).toLocaleString()} %`;
    },
  },
  {
    field: "damp",
    headerName: "Damp",
    width: 200,
    type: "checkboxSelection",
    resizable: false,
    sortable: false,
    filterable: false,
    // @ts-expect-error it does
    aggregable: false,
    disableColumnMenu: true,
    disableReorder: true,
    disableExport: true,
    getApplyQuickFilterFn: undefined,
    renderCell: (params) => <GridCellCheckboxRenderer {...params} />,
  },
];

export default function CascadeDataGrid({
  data,
}: {
  data: RiskCalculation[] | null;
}) {
  const api = useAPI();
  const [rows, setRows] = useState<GridRowsProp | null>(null);
  // const [worstCase, setWorstCase] = useState(false);

  const apiRef = useGridApiRef();

  const handleRowCheck: GridEventListener<"rowSelectionCheckboxChange"> = (
    params // GridRowSelectionCheckboxParams
  ) => {
    if (!rows) return;

    setRows(
      rows.map((r) => {
        if (params.id !== r.id) return r;

        api.updateCascade(r.id, {
          cr4de_damp: !r.damp,
        });

        return {
          ...r,
          damp: !r.damp,
        };
      })
    );
  };

  useMemo(() => {
    if (!data) return;

    setRows(
      data.reduce((split, c) => {
        return [
          ...split,
          ...c.causes.map((cause) => ({
            id: cause.cascadeId,
            title: cause.cascadeTitle,
            cp:
              (cause.c2c +
                cause.m2c +
                cause.e2c +
                cause.c2m +
                cause.m2m +
                cause.e2m +
                cause.c2e +
                cause.m2e +
                cause.e2e) /
              9,
            ip: cause.ip,
            damp: cause.damp,
          })),
        ];
      }, [] as GridRowsProp)
    );
  }, [data]);

  useEffect(() => {
    if (!rows) return;

    return apiRef.current.subscribeEvent(
      "rowSelectionCheckboxChange",
      handleRowCheck
    );
  }, [rows]);

  return (
    <Accordion disabled={!data}>
      <AccordionSummary>
        <Typography variant="subtitle2">Cascade table</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ height: 1000 }}>
        <DataGrid apiRef={apiRef} rows={rows || []} columns={columns} />
      </AccordionDetails>
      <AccordionActions sx={{ mx: 2 }}>
        <Box>
          <Typography variant="subtitle2">filters:</Typography>
        </Box>
        <FormGroup sx={{}}>
          {/* <FormControlLabel
            control={<Checkbox checked={worstCase} onChange={(e) => setWorstCase(e.target.checked)} />}
            label="Show only worst case scenario"
          /> */}
        </FormGroup>
      </AccordionActions>
    </Accordion>
  );
}
