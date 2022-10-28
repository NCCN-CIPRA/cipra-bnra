import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Skeleton,
  IconButton,
  TextField,
  Stack,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { HistoricalEvent, unwrap, wrap } from "../functions/historicalEvents";
import { Trans } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextInputBox from "./TextInputBox";
import useDebounce from "../hooks/useDebounce";
import { v4 as uuidv4 } from "uuid";

function HistoricalEventRow({
  event,
  onChange,
  onRemove,
}: {
  event: HistoricalEvent;
  onChange?: (update: HistoricalEvent) => void;
  onRemove?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [event, setIsLoading]);

  return (
    <TableRow>
      <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top", minWidth: 200 }}>
        {onChange ? (
          <Stack direction="column" spacing={2}>
            <TextField
              size="small"
              defaultValue={event.location}
              label="Location"
              onChange={(e) => onChange({ ...event, location: e.target.value })}
            />
            <TextField
              defaultValue={event.time}
              label="Time"
              onChange={(e) => onChange({ ...event, time: e.target.value })}
              size="small"
              inputProps={{ style: { fontSize: 12, fontWeight: "bold" } }}
            />
          </Stack>
        ) : (
          <Stack direction="column">
            <Typography
              variant="subtitle1"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, transition: "0.3s", px: "5px" }}
            >
              {event.location}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, transition: "0.3s", px: "5px" }}
            >
              {event.time}
            </Typography>
          </Stack>
        )}
      </TableCell>
      <TableCell>
        {onChange ? (
          <TextInputBox
            height="200px"
            initialValue={event.description}
            limitedOptions
            onSave={(v) => onChange({ ...event, description: v || "" })}
            setUpdatedValue={(v) => onChange({ ...event, description: v || "" })}
          />
        ) : (
          <Box
            dangerouslySetInnerHTML={{
              __html: event.description || "",
            }}
          />
        )}
      </TableCell>
      {onChange && (
        <TableCell>
          {isLoading ? (
            <CircularProgress size="small" />
          ) : (
            <IconButton
              color="error"
              onClick={async () => {
                if (!onRemove) return;

                setIsLoading(true);
                await onRemove();
                setIsLoading(false);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

function HistoricalEventsTable({
  initialHistoricalEvents,

  onSave,
  setUpdatedValue,
}: {
  initialHistoricalEvents: string | null;

  onSave?: (newValue: string | null) => void;
  setUpdatedValue?: (newValue: string | null | undefined) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [savedValue, setSavedValue] = useState(initialHistoricalEvents);
  const [innerValue, setInnerValue] = useState(initialHistoricalEvents);
  const [debouncedValue, setDebouncedValue] = useDebounce(innerValue, 2000);

  const historicalEvents = useMemo(() => unwrap(innerValue), [innerValue]);

  useEffect(() => {
    if (onSave && debouncedValue !== savedValue) {
      console.log("debounce", debouncedValue, savedValue);
      onSave(debouncedValue);
      setSavedValue(debouncedValue);
      setUpdatedValue && setUpdatedValue(undefined);
    }
  }, [debouncedValue, savedValue, onSave, setSavedValue, setUpdatedValue]);

  if (historicalEvents === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  const handleForceSave = async (update: HistoricalEvent[]) => {
    if (!onSave) return;
    setIsLoading(true);

    const wrapped = wrap(update);

    console.log("setall", wrapped);
    setInnerValue(wrapped);
    setSavedValue(wrapped);
    setDebouncedValue(wrapped);

    await onSave(wrapped);
    setUpdatedValue && setUpdatedValue(undefined);

    setIsLoading(false);
  };

  const handleAddRow = async () => {
    return handleForceSave([...historicalEvents, { id: uuidv4(), time: "", location: "", description: "" }]);
  };

  const handleRemoveRow = (i: number) => {
    return async () => {
      if (window.confirm("Are you sure you wish to delete this event?")) {
        return handleForceSave([
          ...historicalEvents.slice(0, i),
          ...historicalEvents.slice(i + 1, historicalEvents.length),
        ]);
      }
    };
  };

  const handleUpdate = (i: number) => {
    return (updatedEvent: HistoricalEvent) => {
      const newValue = wrap([
        ...historicalEvents.slice(0, i),
        updatedEvent,
        ...historicalEvents.slice(i + 1, historicalEvents.length),
      ]);
      setInnerValue(newValue);
      setUpdatedValue && setUpdatedValue(newValue);
    };
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Table>
          <TableBody>
            {historicalEvents ? (
              historicalEvents.map((e, i) => (
                <HistoricalEventRow key={e.id} event={e} onChange={handleUpdate(i)} onRemove={handleRemoveRow(i)} />
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
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255, 0.6)",
            }}
          />
        )}
      </Box>
      {onSave && (
        <Box sx={{ position: "relative" }}>
          <Tooltip title="Add new historical event">
            <IconButton onClick={handleAddRow} sx={{ position: "absolute", mt: 2, ml: 6 }}>
              {isLoading ? <CircularProgress /> : <AddIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
}

export default React.memo(HistoricalEventsTable);
