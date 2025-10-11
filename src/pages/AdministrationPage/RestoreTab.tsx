import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import useAPI from "../../hooks/useAPI";

type CSVRow = Record<string, string>;
type CSVData = CSVRow[];

type updates = "updateCascadeSnapshot";

export default function RestoreTab() {
  const api = useAPI();
  const [csvData, setCsvData] = useState<CSVData>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [idColumn, setIdColumn] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterExpression, setFilterExpression] = useState<string>("");
  const [filterError, setFilterError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<CSVData>();
  const [updateFn, setUpdateFn] = useState<updates>();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const parsedData = results.data;
        const allHeaders = results.meta.fields || [];

        setHeaders(allHeaders);
        setCsvData(parsedData);
        setIdColumn("");
        setSelectedFields([]);
        setFilterExpression("");
        setFilterError(null);
      },
      error: (error) => {
        setFilterError("Error parsing CSV: " + error.message);
      },
    });
  };

  const handleFieldSelectionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedFields(value);
  };

  useEffect(() => {
    if (!filterExpression.trim()) setFilteredData(csvData);

    try {
      const filterFn = new Function("row", `return ${filterExpression}`);
      const filtered = csvData.filter((row) => {
        try {
          return filterFn(row);
        } catch {
          return false;
        }
      });
      setFilterError(null);
      setFilteredData(filtered);
    } catch {
      setFilterError("Invalid filter expression");
      setFilteredData(csvData);
    }
  }, [csvData, filterExpression]);

  const handleRestoreFields = async () => {
    if (!filteredData) return;

    for (const row of filteredData) {
      if (updateFn === "updateCascadeSnapshot") {
        await api.updateCascadeSnapshot(
          row[idColumn],
          selectedFields.reduce((u, f) => ({ ...u, [f]: row[f] }), {})
        );
        // console.log(
        //   "Updating",
        //   row[idColumn],
        //   selectedFields.reduce((u, f) => ({ ...u, [f]: row[f] }), {})
        // );
      }
    }
  };

  console.log(filteredData);

  return (
    <Container sx={{ mb: 18 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Restore from backup
          </Typography>

          {headers.length > 0 && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="id-column-label">Select ID Column</InputLabel>
                <Select
                  labelId="id-column-label"
                  value={idColumn}
                  label="Select ID Column"
                  onChange={(e) => setIdColumn(e.target.value)}
                >
                  {headers.map((header) => (
                    <MenuItem key={header} value={header}>
                      {header}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="id-update-fn">Select Data Type</InputLabel>
                <Select<updates>
                  labelId="id-update-fn"
                  value={updateFn}
                  label="Select Data Type"
                  onChange={(e) => setUpdateFn(e.target.value)}
                >
                  <MenuItem value="updateCascadeSnapshot">
                    Cascade Snapshots
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="fields-label">Fields to Restore</InputLabel>
                <Select<string[]>
                  labelId="fields-label"
                  multiple
                  value={selectedFields}
                  onChange={handleFieldSelectionChange}
                  input={<OutlinedInput label="Fields to Restore" />}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {headers.map((header) => (
                    <MenuItem key={header} value={header}>
                      <Checkbox checked={selectedFields.indexOf(header) > -1} />
                      <ListItemText primary={header} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Filter Expression"
                fullWidth
                placeholder='e.g. row.Age > 30 || row.Name === "Alice"'
                value={filterExpression}
                onChange={(e) => setFilterExpression(e.target.value)}
                sx={{ mb: 2 }}
              />

              {filterError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {filterError}
                </Alert>
              )}
            </>
          )}

          <Box sx={{ mb: 2 }}>
            <label htmlFor="csv-upload">
              <Input
                id="csv-upload"
                type="file"
                inputProps={{ accept: ".csv" }}
                onChange={handleFileUpload}
                sx={{ display: "none" }}
              />
              <Button variant="contained" component="span">
                Upload backup csv
              </Button>
            </label>
            <label htmlFor="restore-fields">
              <Button
                variant="contained"
                component="span"
                onClick={handleRestoreFields}
              >
                Restore Fields
              </Button>
            </label>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
