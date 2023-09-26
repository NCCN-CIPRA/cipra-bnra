import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button } from "@mui/material";

export default function Introduction({}: {}) {
  return (
    <Box style={{ position: "relative" }}>
      <Box sx={{ mb: 2, ml: 1 }}>
        <Typography variant="h5">
          <Trans i18nKey="3.introduction.title">Introduction</Trans>
        </Typography>
      </Box>
      <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
        <Typography variant="body2">
          <Trans i18nKey="3.introduction.info.1">
            Welcome to the final step in the risk analysis process, <b>Risk File Consensus</b>!
          </Trans>
        </Typography>
      </Stack>
    </Box>
  );
}
