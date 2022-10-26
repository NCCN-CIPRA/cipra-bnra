import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { IntensityParameter, unwrap, wrap } from "../functions/intensityParameters";
import { Trans } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import TextInputBox from "./TextInputBox";
import useDebounce from "../hooks/useDebounce";

function ParameterRow({
  parameter,
  onChange,
  onRemove,
}: {
  parameter: IntensityParameter;
  onChange?: (update: IntensityParameter) => void;
  onRemove?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [parameter, setIsLoading]);

  return (
    <TableRow>
      <TableCell sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}>
        {onChange ? (
          <TextField
            size="small"
            defaultValue={parameter.name}
            multiline
            inputProps={{ style: { width: "250px", height: "184px" } }}
            onChange={(e) => onChange({ ...parameter, name: e.target.value })}
          />
        ) : (
          <Typography variant="body1">{parameter.name}</Typography>
        )}
      </TableCell>
      <TableCell>
        {onChange ? (
          <TextInputBox
            height="200px"
            initialValue={parameter.description}
            limitedOptions
            onSave={(v) => onChange({ ...parameter, description: v || "" })}
          />
        ) : (
          <Typography variant="body1" paragraph>
            {parameter.description}
          </Typography>
        )}
      </TableCell>
      {onChange && (
        <TableCell>
          {isLoading ? (
            <CircularProgress size="small" />
          ) : (
            <IconButton
              color="error"
              onClick={() => {
                if (!onRemove) return;

                setIsLoading(true);
                onRemove();
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

function IntensityParameterTable({
  initialParameters,

  onSave,
  setUpdatedValue,
}: {
  initialParameters: string | null;

  onSave?: (newValue: string | null) => void;
  setUpdatedValue?: (newValue: string | null | undefined) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [savedValue, setSavedValue] = useState(initialParameters);
  const [innerValue, setInnerValue] = useState(initialParameters);
  const [debouncedValue, setDebouncedValue] = useDebounce(innerValue, 2000);

  const parameters = useMemo(() => unwrap(innerValue), [innerValue]);

  useEffect(() => {
    if (onSave && debouncedValue !== savedValue) {
      onSave(debouncedValue);
      setSavedValue(debouncedValue);
      setUpdatedValue && setUpdatedValue(undefined);
    }
  }, [debouncedValue, savedValue, onSave, setSavedValue, setUpdatedValue]);

  if (parameters === undefined)
    return (
      <Box mt={3}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );

  const handleForceSave = async (update: IntensityParameter[]) => {
    if (!onSave) return;
    setIsLoading(true);

    const wrapped = wrap(update);

    setInnerValue(wrapped);
    setSavedValue(wrapped);
    setDebouncedValue(wrapped);

    await onSave(wrapped);
    setUpdatedValue && setUpdatedValue(undefined);

    setIsLoading(false);
  };

  const handleAddRow = async () => {
    return handleForceSave([...parameters, { name: "", description: "", value: undefined }]);
  };

  const handleRemoveRow = (i: number) => {
    return async () => {
      if (window.confirm("Are you sure you wish to delete this parameter?")) {
        return handleForceSave([...parameters.slice(0, i), ...parameters.slice(i + 1, parameters.length)]);
      }
    };
  };

  const handleUpdate = (i: number) => {
    return (updatedEvent: IntensityParameter) => {
      const newValue = wrap([...parameters.slice(0, i), updatedEvent, ...parameters.slice(i + 1, parameters.length)]);

      setInnerValue(newValue);
      setUpdatedValue && setUpdatedValue(newValue);
    };
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
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
              parameters.map((e, i) => (
                <ParameterRow key={i} parameter={e} onChange={handleUpdate(i)} onRemove={handleRemoveRow(i)} />
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
          <Tooltip title="Add new intensity parameter">
            <IconButton onClick={handleAddRow} sx={{ position: "absolute", mt: 2, ml: 6 }}>
              {isLoading ? <CircularProgress /> : <AddIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
}

export default React.memo(IntensityParameterTable);
