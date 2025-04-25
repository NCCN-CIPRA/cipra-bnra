import Close from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  Typography,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Slide,
  Stack,
} from "@mui/material";
import { Trans } from "react-i18next";
import openInNewTab from "../../../functions/openInNewTab";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";

export default function EffectsSidebar({
  width,
  effects,
  open,
  setOpen,
}: {
  width: number;
  effects: DVRiskCascade<unknown, DVRiskFile>[] | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    // <Slide direction="left" in={open}>
    // </Slide>
    <Drawer
      open={open}
      variant="persistent"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" },
        zIndex: 1000,
      }}
      anchor="right"
    >
      <Toolbar />
      <IconButton onClick={() => setOpen(false)} sx={{ position: "fixed", right: 8, top: 72 }}>
        <Close />
      </IconButton>
      <Box sx={{ overflow: "auto", p: 4 }}>
        <Typography variant="h6">
          <Trans i18nKey="2A.sidebar.effects">Potential Consequences</Trans>
        </Typography>
        {!effects && (
          <Box sx={{ textAlign: "center", m: 6 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {effects && (
          <List>
            {effects.map((e) => (
              <ListItem key={e.cr4de_bnrariskcascadeid} disablePadding>
                <ListItemButton
                  onClick={() => openInNewTab(`/learning/risk/${e.cr4de_effect_hazard.cr4de_riskfilesid}`)}
                >
                  <ListItemText primary={e.cr4de_effect_hazard.cr4de_title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
