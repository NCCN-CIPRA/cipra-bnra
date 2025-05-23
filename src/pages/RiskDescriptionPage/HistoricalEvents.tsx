import { Box, Stack, Typography } from "@mui/material";
import { colors } from "../../functions/getCategoryColor";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";

export default function HistoricalEvents({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const colorList = Object.values(colors);

  if (!riskSummary.cr4de_historical_events) return null;

  return (
    <Box
      sx={{ display: "flex", rowGap: 3, flexDirection: "column", mt: 2, ml: 0 }}
      className="historical"
    >
      {riskSummary.cr4de_historical_events.map((e, i) => {
        return (
          <Box
            key={e.id}
            className="historical-event-wrapper"
            sx={{
              backgroundColor: "white",
              borderLeft: "8px solid " + colorList[i],
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack direction="row">
              <Stack
                direction="column"
                sx={{
                  padding: 2,
                  justifyContent: "center",
                  width: 200,
                  flexShrink: 0,
                  borderRadius: 2,
                  rowGap: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{}}>
                  {e.time}
                </Typography>
                <Typography variant="subtitle2">{e.location}</Typography>
              </Stack>
              <Box
                className="htmleditor"
                sx={{ ml: 4, mr: 2, my: 1 }}
                dangerouslySetInnerHTML={{ __html: e.description || "" }}
              />
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}
