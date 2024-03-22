import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableRow, TableHead, Skeleton } from "@mui/material";
import { unwrapScenario } from "../../functions/scenarios";
import { IntensityParameter } from "../../functions/intensityParameters";

export default function ScenarioTable({
  parameters,
  scenario,
}: {
  parameters: IntensityParameter[];
  scenario: string;
}) {
  const scenarios = unwrapScenario(scenario, parameters);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ whiteSpace: "nowrap" }}>Parameter Name</TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>Severity Range</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {parameters ? (
          parameters.map((p, i) => (
            <TableRow key={p.name}>
              <TableCell sx={{ verticalAlign: "top" }}>
                <Typography variant="body1">{p.name || "???"}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" paragraph>
                  {scenarios[i]?.value}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">No intensity parameters defined...</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
