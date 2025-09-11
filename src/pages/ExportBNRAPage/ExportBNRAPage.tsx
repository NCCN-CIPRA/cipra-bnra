import { useState, useRef, useMemo } from "react";
import {
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  Box,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  OutlinedInput,
  Chip,
} from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAPI, { DataTable } from "../../hooks/useAPI";
import {
  linkCascadeSnapshot,
  parseCascadeSnapshot,
} from "../../types/dataverse/DVRiskCascade";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { saveAs } from "file-saver";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { proxy } from "comlink";
import { getExporter } from "../../functions/export/exportBNRA";
import { Environment } from "../../types/global";
import {
  DVRiskSnapshot,
  parseRiskSnapshot,
} from "../../types/dataverse/DVRiskSnapshot";
import {
  CauseSnapshotResults,
  DVCascadeSnapshot,
  EffectSnapshotResults,
} from "../../types/dataverse/DVCascadeSnapshot";
import { getRiskCatalogueFromSnapshots } from "../../functions/riskfiles";
import { useQuery } from "@tanstack/react-query";

enum EXPORT_TYPE {
  ALL = "ALL",
  SINGLE = "SINGLE",
  DATA = "DATA",
  FRONTPAGE = "FRONT_PAGE",
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ExportBNRAPage() {
  const api = useAPI();
  const logLines = useRef<string[]>(["Loading data..."]);
  const [, setUpdateLog] = useState(Date.now());
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [type, setType] = useState(EXPORT_TYPE.ALL);
  const [exportEnv, setExportEnv] = useState(Environment.PUBLIC);
  const [selectedRiskFiles, setSelectedRiskFiles] = useState<DVRiskSummary[]>(
    []
  );

  const { data: allSummaries, isLoading: loadingSummaries } = useQuery({
    queryKey: [DataTable.RISK_SUMMARY],
    queryFn: () =>
      api.getRiskSummaries(
        `$orderby=cr4de_hazard_id&$filter=cr4de_category ne 'test'`
      ),
  });

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as EXPORT_TYPE);
  };

  const handleChangeExportEnv = (event: SelectChangeEvent) => {
    setExportEnv(event.target.value as Environment);
  };

  const handleChangeRFs = (
    event: SelectChangeEvent<typeof selectedRiskFiles>
  ) => {
    const {
      target: { value },
    } = event;
    if (typeof value === "string") return;

    setSelectedRiskFiles(
      value
        .map((rf) => {
          if (typeof rf === "string") {
            if (
              value.find(
                (r) => typeof r !== "string" && r._cr4de_risk_file_value === rf
              )
            )
              return undefined;
            return allSummaries?.find((r) => r._cr4de_risk_file_value === rf);
          } else if (
            value.find(
              (r) => typeof r === "string" && r === rf._cr4de_risk_file_value
            )
          ) {
            return undefined;
          }
          return rf;
        })
        .filter((rf) => rf !== undefined) as DVRiskSummary[]
    );
  };

  const logger = (line: string, slice: number = 0) => {
    logLines.current = [...logLines.current.slice(slice), line];
    setUpdateLog(Date.now());
  };

  usePageTitle("BNRA 2023 - 2026 Export to PDF");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Export", url: "/export" },
  ]);

  const isLoading = loadingSummaries;

  const exporter = useMemo(getExporter, []);

  const handleExport = async () => {
    if (
      type !== EXPORT_TYPE.ALL &&
      type !== EXPORT_TYPE.FRONTPAGE &&
      selectedRiskFiles.length <= 0
    ) {
      logger("Please select at least 1 risk file");

      return;
    }

    if (!allSummaries) return;

    let riskSnapshots: DVRiskSnapshot[],
      cascades: DVCascadeSnapshot<
        unknown,
        DVRiskSnapshot,
        DVRiskSnapshot,
        CauseSnapshotResults,
        EffectSnapshotResults
      >[];

    if (exportEnv === Environment.PUBLIC) {
      logger("Loading risk snapshots");
      riskSnapshots = await api
        .getRiskSnapshots()
        .then((d) => d.map((rf) => parseRiskSnapshot(rf)));
      const rc = getRiskCatalogueFromSnapshots(riskSnapshots);

      logger("Loading cascade snapshots");
      cascades = await api
        .getCascadeSnapshots()
        .then((d) =>
          d.map((c) => parseCascadeSnapshot(linkCascadeSnapshot(c, rc)))
        );
    } else {
      logger("Loading risk files");
      const riskFiles = await api.getRiskFiles();
      riskSnapshots = riskFiles.map((rf) =>
        parseRiskSnapshot(snapshotFromRiskfile(rf))
      );
      const rc = getRiskCatalogueFromSnapshots(riskSnapshots);

      logger("Loading risk cascades");
      cascades = await api
        .getRiskCascades()
        .then((d) =>
          d.map((c) =>
            parseCascadeSnapshot(
              linkCascadeSnapshot(snapshotFromRiskCascade(c), rc)
            )
          )
        );
    }

    logger("Loading attachments");
    const attachments = await api
      .getAttachments(
        `$orderby=cr4de_reference&$filter=cr4de_reference ne null&$expand=cr4de_referencedSource`
      )
      .then((d) =>
        d.map(
          (a) =>
            (a.cr4de_referencedSource
              ? {
                  ...a.cr4de_referencedSource,
                  cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                  cr4de_field: a.cr4de_field,
                  cr4de_referencedSource: a.cr4de_referencedSource,
                }
              : a) as DVAttachment<unknown, DVAttachment>
        )
      );

    const callback = (message: string) => {
      return logger(message);
    };
    const blob = await exporter.exportBNRA(
      {
        exportType: type,
        exportedRiskFiles: selectedRiskFiles,
        riskSnapshots,
        riskFiles: allSummaries,
        allCascades: cascades,
        allAttachments: attachments,
      },
      proxy(callback)
    );

    if (blob) {
      if (type === EXPORT_TYPE.ALL || type == EXPORT_TYPE.FRONTPAGE) {
        saveAs(blob, "BNRA_export.pdf");
      } else if (type === EXPORT_TYPE.SINGLE) {
        saveAs(blob, "BNRA_export.pdf");
      } else {
        saveAs(blob, "BNRA_export.xlsx");
      }
    }
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{}}>
            <Typography variant="subtitle2">Export log:</Typography>
            <Box
              sx={{
                mt: 1,
              }}
            >
              <Stack direction="row" columnGap={4} sx={{ mx: 1 }}>
                <Stack direction="column" sx={{ flex: 1 }}>
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <InputLabel id="export-type-label">
                      Export Environment
                    </InputLabel>
                    <Select
                      labelId="export-env-label"
                      id="export-env"
                      value={exportEnv}
                      label="Export Environment"
                      onChange={handleChangeExportEnv}
                    >
                      <MenuItem value={Environment.PUBLIC}>
                        Public (static) environment
                      </MenuItem>
                      <MenuItem value={Environment.DYNAMIC}>
                        Dynamic (CIPRA only) environment
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction="column" sx={{ flex: 1 }}>
                  <FormControl fullWidth sx={{ my: 1 }}>
                    <InputLabel id="export-type-label">Export Type</InputLabel>
                    <Select
                      labelId="export-type-label"
                      id="export-type"
                      value={type}
                      label="Export Type"
                      onChange={handleChangeType}
                    >
                      <MenuItem value={EXPORT_TYPE.ALL}>
                        BNRA Full Report
                      </MenuItem>
                      <MenuItem value={EXPORT_TYPE.SINGLE}>Risk File</MenuItem>
                      <MenuItem value={EXPORT_TYPE.DATA}>Raw Data</MenuItem>
                      <MenuItem value={EXPORT_TYPE.FRONTPAGE}>
                        Frontpages
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {type !== EXPORT_TYPE.ALL &&
                    type !== EXPORT_TYPE.FRONTPAGE && (
                      <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel id="rf-label">Risk Files</InputLabel>
                        <Select
                          labelId="rf-label"
                          id="rf-chip"
                          multiple
                          value={selectedRiskFiles}
                          onChange={handleChangeRFs}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Risk Files"
                            />
                          }
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((rf) => (
                                <Chip
                                  key={rf._cr4de_risk_file_value}
                                  label={rf.cr4de_title}
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                        >
                          {allSummaries &&
                            allSummaries.map((rf) => (
                              <MenuItem
                                key={rf._cr4de_risk_file_value}
                                value={rf._cr4de_risk_file_value}
                                style={
                                  {
                                    // fontWeight: selectedRiskFiles.includes(rf)
                                    //   ? 600
                                    //   : 400,
                                  }
                                }
                              >
                                {rf.cr4de_title}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                </Stack>
              </Stack>
              <Box
                sx={{
                  mt: 2,
                  mx: 1,
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #ddd",
                  padding: 1,
                  height: 200,
                  overflowY: "auto",
                }}
              >
                {logLines.current.reverse().map((l, i) => (
                  <Typography key={i} variant="caption">
                    {l}
                  </Typography>
                ))}
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading} onClick={handleExport}>
              Export
            </Button>
            {/* <Box sx={{ flex: 1 }} />
            <Button
              color="warning"
              disabled={calculations === null || isCalculating}
              onClick={saveResults}
            >
              Save results
            </Button> */}
            {/* <Button
              color="warning"
              disabled={
                calculations === null || isCalculating || !latestAnalysisId
              }
              onClick={saveSnapshot}
            >
              Save snapshot
            </Button> */}
          </CardActions>
        </Card>
        {/* pdfUrl && (
          <iframe title="export" width="100%" height={500} src={pdfUrl} />
        )*/}
      </Container>
    </>
  );
}
