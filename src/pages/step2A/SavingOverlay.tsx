import { Box, CircularProgress } from "@mui/material";

export default function SavingOverlay({ visible, drawerWidth }: { visible: boolean; drawerWidth: number }) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1100,
        textAlign: "center",
        pt: 8,
        mt: 8,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
