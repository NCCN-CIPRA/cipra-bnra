import { Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { DPRows, DPs } from "./P2050.data";

export const DPValueStack = ({ value }: { value: number }) => {
  if (value < 0) return null;

  return (
    <Stack sx={{ width: 500 }} spacing={1}>
      <Typography
        variant="subtitle2"
        sx={{ whiteSpace: "nowrap", mr: 1, pb: 1, fontWeight: "bold" }}
      >
        {`DP2050-${value}`}
      </Typography>
      {DPRows.map((r, ri) => (
        <Stack key={r} direction="row">
          <Typography
            variant="body2"
            sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}
          >
            <Trans i18nKey={r} />:{" "}
          </Typography>
          <Typography variant="caption" sx={{ whiteSpace: "normal" }}>
            <Trans i18nKey={DPs[value][ri]} />
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
