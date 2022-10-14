import React, { useState, useEffect } from "react";
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
import { HistoricalEvent } from "../functions/historicalEvents";
import { Trans } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextInputBox, { TextInputBoxGetter } from "./TextInputBox";
import LoadingButton from "@mui/lab/LoadingButton";

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
              onChange={(e) => onChange({ ...event, location: e.target.value })}
            />
            <TextField
              defaultValue={event.time}
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
            setValue={(v) => onChange({ ...event, description: v })}
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
  onChange,
}: {
  initialHistoricalEvents?: HistoricalEvent[];
  onChange?: (update: HistoricalEvent[], instant?: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [historicalEvents, setHistoricalEvents] = useState(initialHistoricalEvents);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    if (historicalEvents === undefined || update) {
      setHistoricalEvents(initialHistoricalEvents);
      setUpdate(false);
    }
  }, [historicalEvents, setIsLoading, setHistoricalEvents, update, initialHistoricalEvents]);

  if (historicalEvents === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  const handleAddRow = async () => {
    if (!onChange) return;
    setIsLoading(true);

    const update = [...historicalEvents, { time: "", location: "", description: "" }];
    setHistoricalEvents(update);

    await onChange(update, true);

    setUpdate(true);
    setIsLoading(false);
  };

  const handleRemoveRow = (i: number) => {
    if (!onChange) return;

    return async () => {
      if (window.confirm("Are you sure you wish to delete this event?")) {
        const update = [...historicalEvents.slice(0, i), ...historicalEvents.slice(i + 1, historicalEvents.length)];

        setHistoricalEvents(update);
        return onChange(update, true);
      }
    };
  };

  const handleUpdate = (i: number) => {
    if (!onChange) return;

    return async (updatedEvent: HistoricalEvent) => {
      const update = [
        ...historicalEvents.slice(0, i),
        updatedEvent,
        ...historicalEvents.slice(i + 1, historicalEvents.length),
      ];

      setHistoricalEvents(update);

      return onChange(update);
    };
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Table>
          <TableBody>
            {historicalEvents ? (
              historicalEvents.map((e, i) => (
                <HistoricalEventRow key={i} event={e} onChange={handleUpdate(i)} onRemove={handleRemoveRow(i)} />
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
      {onChange && (
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
