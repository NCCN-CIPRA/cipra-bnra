import { Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { M } from "./M2050.data";

export function MValueStack({ value }: { value: number }) {
  const { t } = useTranslation();

  if (!M.intervals[value]) return null;

  return (
    <Stack direction="column" spacing={1}>
      <Typography
        variant="subtitle2"
        sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}
      >
        {`${M.prefix}${value}`}
      </Typography>
      <Typography variant="body2">
        {t(M.intervals[value][0], M.intervals[value][1])}
      </Typography>
      <Typography variant="caption">{t(M.unit[0], M.unit[1])}</Typography>
      {M.alternatives && (
        <Stack direction="column" sx={{ pt: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              whiteSpace: "nowrap",
              mr: 1,
              fontWeight: "bold",
              fontSize: 12,
              pb: 1,
            }}
          >
            <Trans i18nKey={"learning.impact.alternatives"}>
              Alternative values:
            </Trans>
          </Typography>
          {M.alternatives.map((a) => (
            <Stack key={a.name[0]} direction="row" spacing={1}>
              <Typography variant="body2" sx={{ fontSize: 12 }}>
                {t(a.name[0], a.name[1])}:
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: 12, fontWeight: "bold" }}
              >
                {t(a.intervals[value][0], a.intervals[value][1])}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
