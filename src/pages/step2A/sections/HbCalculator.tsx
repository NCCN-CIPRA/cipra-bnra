import { Box, Paper } from "@mui/material";

export default function HbCalculator({}) {
  return (
    <Box component={Paper} sx={{ position: "fixed", bottom: 72, right: 16, p: 2, zIndex: 4000 }} elevation={5}>
      Test
    </Box>
  );
}
