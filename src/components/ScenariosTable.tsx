import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableHead, Skeleton } from "@mui/material";
import { Scenarios } from "../functions/scenarios";
import { Trans } from "react-i18next";

function ScenariosTable({ scenarios, editable = true }: { scenarios?: Scenarios; editable?: boolean }) {
  if (scenarios === undefined)
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
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            <Trans i18nKey="intensityParameters.name">Parameter Name</Trans>
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            <Trans i18nKey="scenarios.considerable">Considerable</Trans>
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            <Trans i18nKey="scenarios.major">Major</Trans>
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            <Trans i18nKey="scenarios.extreme">Extreme</Trans>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {scenarios.considerable ? (
          scenarios.considerable.map((p, i) => (
            <TableRow key={p.name}>
              <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
                <Typography variant="body1">{p.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" paragraph>
                  {scenarios.considerable && scenarios.considerable[i].value}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" paragraph>
                  {scenarios.major && scenarios.major[i].value}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" paragraph>
                  {scenarios.extreme && scenarios.extreme[i].value}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">
                <Trans i18nKey="scenarios.none">No intensity scenarios suggested...</Trans>
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default React.memo(ScenariosTable);
