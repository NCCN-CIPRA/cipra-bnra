import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow, Skeleton } from "@mui/material";
import { HistoricalEvent } from "../functions/historicalEvents";

function HistoricalEventsTable({
  historicalEvents,
  editable = true,
}: {
  historicalEvents?: HistoricalEvent[];
  editable?: boolean;
}) {
  if (historicalEvents === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  return (
    <Table>
      <TableBody>
        {historicalEvents ? (
          historicalEvents.map((e) => (
            <TableRow key={e.description}>
              <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                <Typography variant="subtitle1">{e.location}</Typography>
                <Typography variant="subtitle2">{e.time}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" paragraph>
                  {e.description}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">No historical events suggested...</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default React.memo(HistoricalEventsTable);
