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
} from "@mui/material";
import { Trans } from "react-i18next";
import openInNewTab from "../../functions/openInNewTab";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

export default function CausesSidebar({
  width,
  loading,
  causes,
}: {
  width: number;
  loading: boolean;
  causes: DVRiskCascade<DVRiskFile>[] | null;
}) {
  return (
    <Drawer
      variant="permanent"
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
      <Box sx={{ overflow: "auto", p: 4 }}>
        <Typography variant="h6">
          <Trans i18nKey="2A.sidebar.causes">Potential Causes</Trans>
        </Typography>
        {(loading || !causes) && (
          <Box sx={{ textAlign: "center", m: 6 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {!loading && causes && (
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
