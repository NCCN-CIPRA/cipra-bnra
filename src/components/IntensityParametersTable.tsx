import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableHead, Skeleton } from "@mui/material";
import { IntensityParameter } from "../functions/intensityParameters";

function IntensityParameterTable({ parameters }: { parameters?: IntensityParameter[] }) {
  if (parameters === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ whiteSpace: "nowrap" }}>Parameter Name</TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>Parameter Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parameters ? (
          parameters.map((e) => (
            <TableRow key={e.name}>
              <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                <Typography variant="body1">{e.name}</Typography>
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
              <Typography variant="subtitle1">No intensity parameters suggested...</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default React.memo(IntensityParameterTable);
