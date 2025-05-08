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
import CheckIcon from "@mui/icons-material/Check";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import { DataTable } from "../../hooks/useAPI";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import {
  DVRiskCascade,
  getCascadeResultSnapshot,
} from "../../types/dataverse/DVRiskCascade";
import {
  getResultSnapshot,
  SmallRisk,
} from "../../types/dataverse/DVSmallRisk";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { saveAs } from "file-saver";
import { proxy } from "comlink";
import { wrap } from "vite-plugin-comlink/symbol";

enum EXPORT_TYPE {
  ALL = "ALL",
  SINGLE = "SINGLE",
  DATA = "DATA",
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
  const logLines = useRef<string[]>(["Loading data..."]);
  const [, setUpdateLog] = useState(Date.now());
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [type, setType] = useState(EXPORT_TYPE.ALL);
  const [selectedRiskFiles, setSelectedRiskFiles] = useState<DVRiskFile[]>([]);

  const handleChangeType = (event: SelectChangeEvent) => {
    setType(event.target.value as EXPORT_TYPE);
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
                (r) => typeof r !== "string" && r.cr4de_riskfilesid === rf
              )
            )
              return undefined;
            return riskFiles?.find((r) => r.cr4de_riskfilesid === rf);
          } else if (
            value.find(
              (r) => typeof r === "string" && r === rf.cr4de_riskfilesid
            )
          ) {
            return undefined;
          }
          return rf;
        })
        .filter((rf) => rf !== undefined) as DVRiskFile[]
    );
  };

  const logger = (line: string, slice: number = 0) => {
    logLines.current = [...logLines.current.slice(slice), line];
    setUpdateLog(Date.now());
  };

  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    query: `$orderby=cr4de_hazard_id&$filter=cr4de_risk_category ne 'test'`,
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} risk files`),
    transformResult: (rfs) =>
      rfs.map((rf: DVRiskFile) => ({
        ...rf,
        results: getResultSnapshot(rf),
      })),
  });
  const {
    data: cascades,
    isFetching: loadingCascades,
    reloadData: reloadCascades,
  } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} cascades`),
    transformResult: (results: DVRiskCascade[]) =>
      results.map((r) => {
        return {
          ...r,
          results: getCascadeResultSnapshot(r),
        } as DVRiskCascade<SmallRisk, SmallRisk>;
      }),
  });

  const {
    data: attachments,
    isFetching: loadingAttachments,
    reloadData: reloadAttachments,
  } = useRecords<DVAttachment>({
    table: DataTable.ATTACHMENT,
    query: `$orderby=cr4de_reference&$filter=cr4de_reference ne null&$expand=cr4de_referencedSource`,
    transformResult: (results: DVAttachment<unknown, DVAttachment>[]) =>
      results.map((a) =>
        a.cr4de_referencedSource
          ? {
              ...a.cr4de_referencedSource,
              cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
              cr4de_field: a.cr4de_field,
              cr4de_referencedSource: a.cr4de_referencedSource,
            }
          : a
      ),
    // .reduce((acc, att) => {
    //   if (!acc.find((a) => a.cr4de_reference === att.cr4de_reference))
    //     return [...acc, att];
    //   return acc;
    // }, [] as DVAttachment[]),
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} attachments`),
  });

  usePageTitle("BNRA 2023 - 2026 Export to PDF");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Export", url: "/export" },
  ]);

  const isLoading = loadingRiskFiles || loadingCascades;

  const exporter = useMemo(() => {
    if (window.location.href.indexOf("localhost") >= 0) {
      return new ComlinkWorker<
        typeof import("../../functions/export/export.worker")
      >(new URL("../../functions/export/export.worker", import.meta.url), {
        type: "module",
      });
    }

    return wrap(
      new Worker(new URL("https://bnra.powerappsportals.com/export.worker.js"))
    ) as unknown as typeof import("../../functions/export/export.worker");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFiles]);

  const reloadData = () => {
    logger("Loading data...");
    reloadCascades();
    reloadRiskFiles();
    reloadAttachments();
  };

  const handleExport = async () => {
    if (!riskFiles || !cascades || !attachments) return;

    if (type !== EXPORT_TYPE.ALL && selectedRiskFiles.length <= 0) {
      logger("Please select at least 1 risk file");

      return;
    }

    const callback = (message: string) => {
      return logger(message);
    };

    const blob = await exporter.exportBNRA(
      {
        exportType: type,
        exportedRiskFiles: selectedRiskFiles,
        riskFiles,
        allCascades: cascades,
        allAttachments: attachments,
      },
      proxy(callback)
    );

    if (blob) {
      if (type === EXPORT_TYPE.ALL) {
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
              <Stack direction="row">
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {riskFiles && !loadingRiskFiles && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Files
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {cascades && !loadingCascades && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Cascades
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {attachments && !loadingAttachments && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Attachments
                      </Typography>
                    </Box>
                  </Stack>
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
                    </Select>
                  </FormControl>
                  {type !== EXPORT_TYPE.ALL && (
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
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((rf) => (
                              <Chip
                                key={rf.cr4de_riskfilesid}
                                label={rf.cr4de_title}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {riskFiles &&
                          riskFiles.map((rf) => (
                            <MenuItem
                              key={rf.cr4de_riskfilesid}
                              value={rf.cr4de_riskfilesid}
                              style={{
                                fontWeight: selectedRiskFiles.includes(rf)
                                  ? 600
                                  : 400,
                              }}
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
            <Button disabled={isLoading} onClick={reloadData}>
              Reload data
            </Button>
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
