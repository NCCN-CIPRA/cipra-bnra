import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableRow, TableHead, Skeleton } from "@mui/material";
import { Scenarios } from "../functions/scenarios";
import { IntensityParameter } from "../functions/intensityParameters";
import { Trans } from "react-i18next";

function ScenariosTable({
  parameters,
  initialScenarios,
  onChange,
}: {
  parameters: IntensityParameter[];
  initialScenarios?: Scenarios;
  onChange?: (update: Scenarios) => void;
}) {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (scenarios === undefined || update) {
      setScenarios(initialScenarios);
      setUpdate(false);
    }
  }, [scenarios, setScenarios, update, initialScenarios]);

  if (scenarios === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  const handleChange = (scenario: keyof Scenarios, parameter: number, newValue: string) => {
    if (!onChange) return;
    console.log(scenarios, scenario);
    const update = {
      ...scenarios,
      [scenario]: [
        ...scenarios[scenario].slice(0, parameter),
        {
          ...parameters[parameter],
          value: newValue,
        },
        ...scenarios[scenario].slice(parameter + 1, scenarios[scenario].length),
      ],
    };

    setScenarios(update);

    return onChange(update);
  };

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
        {parameters ? (
          parameters.map((p, i) => (
            <TableRow key={p.name}>
              <TableCell sx={{ verticalAlign: "top" }}>
                <Typography variant="body1">{p.name || "???"}</Typography>
              </TableCell>
              <TableCell>
                {onChange ? (
                  <TextField
                    size="small"
                    defaultValue={scenarios.considerable[i]?.value || ""}
                    multiline
                    inputProps={{ style: { width: "250px", height: "134px" } }}
                    onChange={(e) => handleChange("considerable", i, e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" paragraph>
                    {scenarios.considerable[i]?.value}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {onChange ? (
                  <TextField
                    size="small"
                    defaultValue={scenarios.major[i]?.value || ""}
                    multiline
                    inputProps={{ style: { width: "250px", height: "134px" } }}
                    onChange={(e) => handleChange("major", i, e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" paragraph>
                    {scenarios.major[i]?.value || ""}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {onChange ? (
                  <TextField
                    size="small"
                    defaultValue={scenarios.extreme[i]?.value || ""}
                    multiline
                    inputProps={{ style: { width: "250px", height: "134px" } }}
                    onChange={(e) => handleChange("extreme", i, e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" paragraph>
                    {scenarios.extreme[i]?.value || ""}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1">
                <Trans i18nKey="scenarios.none">No intensity parameters defined...</Trans>
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default React.memo(ScenariosTable);
