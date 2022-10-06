import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableHead, Skeleton } from "@mui/material";
import { IntensityParameter } from "../functions/intensityParameters";
import { Trans } from "react-i18next";

function IntensityParameterTable({
  parameters,
  editable = true,
}: {
  parameters?: IntensityParameter[];
  editable?: boolean;
}) {
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
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            <Trans i18nKey="intensityParameters.name">Parameter Name</Trans>
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            <Trans i18nKey="intensityParameters.description">Parameter Description</Trans>
          </TableCell>
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
              <Typography variant="subtitle1">
                <Trans i18nKey="intensityParameters.none">No intensity parameters suggested...</Trans>
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default React.memo(IntensityParameterTable);
