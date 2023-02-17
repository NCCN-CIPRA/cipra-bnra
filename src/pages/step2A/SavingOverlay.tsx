import { Box, Button, Paper, Fade, Container, Typography, Drawer, CircularProgress } from "@mui/material";

export default function SavingOverlay({ visible, drawerWidth }: { visible: boolean; drawerWidth: number }) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        textAlign: "center",
        pt: 8,
        mt: 16,
      }}
      style={{ marginRight: drawerWidth }}
    >
      <CircularProgress />
    </Box>
  );
}
