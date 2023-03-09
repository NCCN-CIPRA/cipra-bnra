import { Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";

export const DPRows = [
  "learning.probability.returnPeriod",
  "learning.probability.3yearLikelihood",
  "learning.probability.10yearLikelihood",
  "learning.probability.qualitative",
];

export const DP1 = [
  "learning.probability.rp.1",
  "learning.probability.3yl.1",
  "learning.probability.10yl.1",
  "learning.probability.q.1",
];
export const DP2 = [
  "learning.probability.rp.2",
  "learning.probability.3yl.2",
  "learning.probability.10yl.2",
  "learning.probability.q.2",
];
export const DP3 = [
  "learning.probability.rp.3",
  "learning.probability.3yl.3",
  "learning.probability.10yl.3",
  "learning.probability.q.3",
];
export const DP4 = [
  "learning.probability.rp.4",
  "learning.probability.3yl.4",
  "learning.probability.10yl.4",
  "learning.probability.q.4",
];
export const DP5 = [
  "learning.probability.rp.5",
  "learning.probability.3yl.5",
  "learning.probability.10yl.5",
  "learning.probability.q.5",
];

export const DPs = [DP1, DP2, DP3, DP4, DP5];

export const DPValueStack = ({ value }: { value: number }) => {
  if (value < 0) return null;

  return (
    <Stack sx={{ width: 500 }} spacing={1}>
      <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap", mr: 1, pb: 1, fontWeight: "bold" }}>
        {`DP${value + 1}`}
      </Typography>
      {DPRows.map((r, ri) => (
        <Stack key={r} direction="row">
          <Typography variant="body2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}>
            <Trans i18nKey={r} />:{" "}
          </Typography>
          <Typography variant="caption">
            <Trans i18nKey={DPs[value][ri]} />
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
