import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Skeleton,
} from "@mui/material";
import { Scenarios, unwrap, wrap } from "../functions/scenarios";
import { IntensityParameter } from "../functions/intensityParameters";
import { Trans } from "react-i18next";
import useDebounce from "../hooks/useDebounce";
import { RiskFileEditableFields } from "../types/dataverse/DVRiskFile";

interface RawScenarios {
  considerable: string | null;
  major: string | null;
  extreme: string | null;
}

const getChangedScenarios = (old: RawScenarios, new_: RawScenarios) => {
  const update: Partial<RawScenarios> = {};

  if (old.considerable !== new_.considerable)
    update.considerable = new_.considerable;
  if (old.major !== new_.major) update.major = new_.major;
  if (old.extreme !== new_.extreme) update.extreme = new_.extreme;

  return update;
};

function ScenariosTable({
  parameters,
  initialScenarios,

  onSave,
  setUpdatedValue,
}: {
  parameters: IntensityParameter[];
  initialScenarios: RawScenarios;

  onSave?: (updatedFields: Partial<RiskFileEditableFields>) => void;
  setUpdatedValue?: (updatedFields: Partial<RiskFileEditableFields>) => void;
}) {
  const [savedValue, setSavedValue] = useState(initialScenarios);
  const [innerValue, setInnerValue] = useState(initialScenarios);
  const [debouncedValue] = useDebounce(innerValue, 2000);

  // const scenarios = useMemo(
  //   () => unwrap(parameters, innerValue.considerable, innerValue.major, innerValue.extreme),
  //   [parameters, innerValue]
  // );

  const scenarios = unwrap(
    parameters,
    innerValue.considerable,
    innerValue.major,
    innerValue.extreme
  );

  useEffect(() => {
    if (onSave) {
      const update = getChangedScenarios(savedValue, debouncedValue);

      if (Object.keys(update).length > 0) {
        const fieldsToUpdate: Partial<RiskFileEditableFields> = {};

        if (update.considerable !== undefined)
          fieldsToUpdate.cr4de_scenario_considerable = update.considerable;
        if (update.major !== undefined)
          fieldsToUpdate.cr4de_scenario_major = update.major;
        if (update.extreme !== undefined)
          fieldsToUpdate.cr4de_scenario_extreme = update.extreme;

        onSave(fieldsToUpdate);
        setSavedValue(debouncedValue);
        if (setUpdatedValue) setUpdatedValue({});
      }
    }
  }, [debouncedValue, savedValue, onSave, setSavedValue, setUpdatedValue]);

  if (scenarios === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  const handleUpdate = (
    scenario: keyof Scenarios,
    parameter: number,
    newValue: string
  ) => {
    const updated = {
      ...innerValue,
      [scenario]: wrap([
        ...scenarios[scenario].slice(0, parameter),
        {
          ...parameters[parameter],
          value: newValue,
        },
        ...scenarios[scenario].slice(parameter + 1, scenarios[scenario].length),
      ]),
    };
    setInnerValue(updated);
    if (setUpdatedValue)
      setUpdatedValue({
        [`cr4de_scenario_${scenario}`]: updated[scenario],
      });
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
                {onSave ? (
                  <TextField
                    size="small"
                    defaultValue={scenarios.considerable[i]?.value || ""}
                    multiline
                    inputProps={{ style: { width: "250px", height: "134px" } }}
                    onChange={(e) =>
                      handleUpdate("considerable", i, e.target.value)
                    }
                  />
                ) : (
                  <Typography variant="body1" paragraph>
                    {scenarios.considerable[i]?.value}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {onSave ? (
                  <TextField
                    size="small"
                    defaultValue={scenarios.major[i]?.value || ""}
                    multiline
                    inputProps={{ style: { width: "250px", height: "134px" } }}
                    onChange={(e) => handleUpdate("major", i, e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" paragraph>
                    {scenarios.major[i]?.value || ""}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {onSave ? (
                  <TextField
                    size="small"
                    defaultValue={scenarios.extreme[i]?.value || ""}
                    multiline
                    inputProps={{ style: { width: "250px", height: "134px" } }}
                    onChange={(e) => handleUpdate("extreme", i, e.target.value)}
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
                <Trans i18nKey="scenarios.none">
                  No intensity parameters defined...
                </Trans>
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default React.memo(ScenariosTable);
