import { Box, Stack, Typography } from "@mui/material";
import { unwrap } from "../../functions/historicalEvents";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { colors } from "../../functions/getCategoryColor";

export default function HistoricalEvents({ riskFile }: { riskFile: DVRiskFile }) {
  const events = unwrap(riskFile.cr4de_historical_events);

  const colorList = Object.values(colors);

  return (
    <Box sx={{ display: "flex", rowGap: 3, flexDirection: "column", mt: 2, ml: 0 }}>
      {events.map((e, i) => {
        return (
          <Box
            sx={{
              backgroundColor: "white",
              borderLeft: "8px solid " + colorList[i],
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Stack
              direction="column"
              sx={{
                padding: 2,
                justifyContent: "center",
                width: 120,
                flexShrink: 0,
                borderRadius: 2,
                rowGap: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{}}>
                {e.time}
              </Typography>
              <Typography variant="subtitle1" sx={{}}>
                {e.location}
              </Typography>
            </Stack>
            <Box sx={{ ml: 4, mr: 2, my: 1 }} dangerouslySetInnerHTML={{ __html: e.description || "" }} />
          </Box>
        );
      })}
    </Box>
  );
}
