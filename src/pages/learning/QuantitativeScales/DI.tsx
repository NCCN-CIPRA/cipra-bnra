import { Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

export type DirectImpactField = {
  prefix: string;
  title: string[];
  intervals: string[][];
  unit: string[];
  alternatives?: {
    intervals: string[][];
    name: string[];
  }[];
};

export function DIValueStack({ field, value }: { field: DirectImpactField; value: number }) {
  const { t } = useTranslation();

  if (!field.intervals[value]) return null;

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}>
        {`${field.prefix}${value}`}
      </Typography>
      <Typography variant="body2">{t(field.intervals[value][0], field.intervals[value][1])}</Typography>
      <Typography variant="caption">{t(field.unit[0], field.unit[1])}</Typography>
      {field.alternatives && (
        <Stack direction="column" sx={{ pt: 2 }}>
          <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold", fontSize: 12, pb: 1 }}>
            <Trans i18nKey={"learning.impact.alternatives"}>Alternative values:</Trans>
          </Typography>
          {field.alternatives.map((a) => (
            <Stack direction="row" spacing={1}>
              <Typography variant="body2" sx={{ fontSize: 12 }}>
                {t(a.name[0], a.name[1])}:
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: "bold" }}>
                {t(a.intervals[value][0], a.intervals[value][1])}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
