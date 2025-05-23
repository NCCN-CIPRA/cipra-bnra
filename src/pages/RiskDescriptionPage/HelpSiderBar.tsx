import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";

export enum Section {
  PROB_BREAKDOWN,
  IMPACT_BREAKDOWN,
}

const fadeOpacity = 0.1;

export default function HelpSideBar({
  focused,
}: {
  focused?: Section | undefined;
}) {
  const theme = useTheme();

  return (
    <Stack direction="column" sx={{ padding: theme.spacing(2, 2) }}>
      <Box
        id={`section-${Section.PROB_BREAKDOWN}`}
        sx={{
          opacity: focused === Section.PROB_BREAKDOWN ? 1 : fadeOpacity,
          transition: "opacity .3s ease",
        }}
      >
        <Typography variant="subtitle2">Probability Breakdown</Typography>
        <Typography variant="body2">
          This is an explanation of the probability breakdown, including the
          causes and percentages.
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        id={`section-${Section.IMPACT_BREAKDOWN}`}
        sx={{
          opacity: focused === Section.IMPACT_BREAKDOWN ? 1 : fadeOpacity,
          transition: "opacity .3s ease",
        }}
      >
        <Typography variant="subtitle2">Impact Breakdown</Typography>
        <Typography variant="body2">
          This is an explanation of the impact breakdown, including the
          consequences and percentages.
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Stack>
  );
}
