import React, { useEffect, useState } from "react";
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
import { IntensityParameter } from "../functions/intensityParameters";
import { Trans } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import TextInputBox from "./TextInputBox";

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
            setValue={(v) => onChange({ ...parameter, description: v })}
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
  onChange,
}: {
  initialParameters?: IntensityParameter[];
  onChange?: (update: IntensityParameter[], instant?: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [parameters, setParameters] = useState(initialParameters);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    if (parameters === undefined || update) {
      setParameters(initialParameters);
      setUpdate(false);
    }
  }, [parameters, setIsLoading, setParameters, update, initialParameters]);

  if (parameters === undefined)
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

    const update = [...parameters, { name: "", description: "", value: undefined }];
    setParameters(update);

    await onChange(update, true);

    setUpdate(true);
  };

  const handleRemoveRow = (i: number) => {
    if (!onChange) return;

    return async () => {
      if (window.confirm("Are you sure you wish to delete this parameter?")) {
        const update = [...parameters.slice(0, i), ...parameters.slice(i + 1, parameters.length)];

        setParameters(update);
        return onChange(update);
      }
    };
  };

  const handleUpdate = (i: number) => {
    if (!onChange) return;

    return async (updated: IntensityParameter) => {
      const update = [...parameters.slice(0, i), updated, ...parameters.slice(i + 1, parameters.length)];

      setParameters(update);
      return onChange(update);
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
      {onChange && (
        <Box sx={{ position: "relative" }}>
          <Tooltip title="Add new intensity parameter">
            <IconButton onClick={handleAddRow} sx={{ position: "absolute", mt: 2, ml: 6 }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
}

export default React.memo(IntensityParameterTable);
