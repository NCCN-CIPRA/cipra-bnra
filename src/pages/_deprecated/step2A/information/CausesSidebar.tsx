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
} from "@mui/material";
import { Trans } from "react-i18next";
import openInNewTab from "../../../functions/openInNewTab";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Close from "@mui/icons-material/Close";

export default function CausesSidebar({
  width,
  causes,
  open,
  setOpen,
}: {
  width: number;
  causes: DVRiskCascade<DVRiskFile>[] | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    // <Slide appear={open}>
    // </Slide>
    <Drawer
      open={open}
      variant="persistent"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width, boxSizing: "border-box" },
        zIndex: 1000,
        position: "absolute",
      }}
      anchor="right"
    >
      <Toolbar />
      <IconButton onClick={() => setOpen(false)} sx={{ position: "fixed", right: 8, top: 72 }}>
        <Close />
      </IconButton>
      <Box sx={{ overflow: "auto", p: 4 }}>
        <Typography variant="h6">
          <Trans i18nKey="2A.sidebar.causes">Potential Causes</Trans>
        </Typography>
        {!causes && (
          <Box sx={{ textAlign: "center", m: 6 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {causes && (
          <List>
            {causes.map((c) => (
              <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding>
                <ListItemButton
                  onClick={() => openInNewTab(`/learning/risk/${c.cr4de_cause_hazard.cr4de_riskfilesid}`)}
                >
                  <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
