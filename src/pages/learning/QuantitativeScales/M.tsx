import { Trans, useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";

export const M = {
  prefix: "M",
  title: ["learning.motivation.title", "M - Motivation"],
  intervals: [
    ["learning.motivation.rp.1", "< 1%"],
    ["learning.motivation.rp.2", "1% – 50%"],
    ["learning.motivation.rp.3", "50% – 90%"],
    ["learning.motivation.rp.4", "90% – 100%"],
  ],
  unit: ["learning.motivation.footer", "Unit: Probability of an attempted malicious action in the next 3 years"],
  alternatives: [
    {
      intervals: [
        ["learning.motivation.q.1", "No indicators of motivation or action attempts"],
        ["learning.motivation.q.2", "Few indicators of motivation or action attempts"],
        ["learning.motivation.q.3", "Many indicators of motivation or action attempts"],
        ["learning.motivation.q.4", "Proven motivation, attempted action is imminent"],
      ],
      name: ["learning.motivation.alt.title", "Qualitative description"],
    },
  ],
};

export function MValueStack({ value }: { value: number }) {
  const { t } = useTranslation();

  if (!M.intervals[value]) return null;

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}>
        {`${M.prefix}${value}`}
      </Typography>
      <Typography variant="body2">{t(M.intervals[value][0], M.intervals[value][1])}</Typography>
      <Typography variant="caption">{t(M.unit[0], M.unit[1])}</Typography>
      {M.alternatives && (
        <Stack direction="column" sx={{ pt: 2 }}>
          <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold", fontSize: 12, pb: 1 }}>
            <Trans i18nKey={"learning.impact.alternatives"}>Alternative values:</Trans>
          </Typography>
          {M.alternatives.map((a) => (
            <Stack key={a.name[0]} direction="row" spacing={1}>
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
