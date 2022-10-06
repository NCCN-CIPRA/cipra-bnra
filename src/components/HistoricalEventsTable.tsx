import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Skeleton,
  Fab,
  IconButton,
  TextField,
} from "@mui/material";
import { HistoricalEvent } from "../functions/historicalEvents";
import { Trans } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInputBox from "./TextInputBox";

function HistoricalEventsTable({
  historicalEvents,
  editable = true,
  onChange,
}: {
  historicalEvents?: HistoricalEvent[];
  editable?: boolean;
  onChange?: (update: HistoricalEvent[]) => Promise<void>;
}) {
  const [focusField, setFocusField] = useState<string | null>(null);
  const [updatedFieldValue, setUpdatedFieldValue] = useState<string | null>(null);

  if (historicalEvents === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  const handleAddRow = () => {
    if (!onChange) return;

    onChange([...historicalEvents, { time: "", location: "", description: "" }]);
  };

  const handleRemoveRow = (i: number) => {
    if (!onChange) return;

    if (window.confirm("Are you sure you wish to delete this event?")) {
      onChange([...historicalEvents.slice(0, i), ...historicalEvents.slice(i + 1, historicalEvents.length)]);
    }
  };

  const handleUpdate = (field: string, i: number, value: string) => {
    if (!onChange) return;

    onChange([
      ...historicalEvents.slice(0, i),
      {
        ...historicalEvents[i],
        [field]: value,
      },
      ...historicalEvents.slice(i + 1, historicalEvents.length),
    ]);
  };

  return (
    <>
      <Table>
        <TableBody>
          {historicalEvents ? (
            historicalEvents.map((e, i) => (
              <TableRow key={e.description}>
                <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                  {focusField === "location" ? (
                    <TextField
                      size="small"
                      defaultValue={e.location}
                      onChange={(e) => setUpdatedFieldValue(e.target.value)}
                      onBlur={() => {
                        if (updatedFieldValue) {
                          handleUpdate("location", i, updatedFieldValue);
                        }
                        setUpdatedFieldValue(null);
                        setFocusField(null);
                      }}
                    />
                  ) : (
                    <Typography
                      variant="subtitle1"
                      onClick={() => setFocusField("location")}
                      sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, transition: "0.3s", px: "5px" }}
                    >
                      {e.location}
                    </Typography>
                  )}
                  {focusField === "time" ? (
                    <TextField
                      defaultValue={e.time}
                      onChange={(e) => setUpdatedFieldValue(e.target.value)}
                      onBlur={() => {
                        if (updatedFieldValue) {
                          handleUpdate("time", i, updatedFieldValue);
                        }
                        setUpdatedFieldValue(null);
                        setFocusField(null);
                      }}
                      size="small"
                      inputProps={{ style: { fontSize: 12, fontWeight: "bold" } }}
                    />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      onClick={() => setFocusField("time")}
                      sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, transition: "0.3s", px: "5px" }}
                    >
                      {e.time}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {focusField === "description" ? (
                    <TextInputBox
                      initialValue={e.description}
                      setValue={setUpdatedFieldValue}
                      onBlur={() => {
                        if (updatedFieldValue) {
                          handleUpdate("description", i, updatedFieldValue);
                        }
                        setUpdatedFieldValue(null);
                        setFocusField(null);
                      }}
                    />
                  ) : (
                    <Box
                      onClick={() => setFocusField("description")}
                      sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, transition: "0.3s", px: "5px" }}
                      dangerouslySetInnerHTML={{
                        __html: e.description || "",
                      }}
                    />
                  )}
                </TableCell>
                {onChange && (
                  <TableCell>
                    <IconButton color="error" onClick={() => handleRemoveRow(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1">
                  <Trans i18nKey="historicalEvents.none">No historical events suggested...</Trans>
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {onChange && (
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Fab size="medium" color="primary" aria-label="add" onClick={handleAddRow}>
            <AddIcon />
          </Fab>
        </Box>
      )}
    </>
  );
}

export default React.memo(HistoricalEventsTable);
