import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";

export default function SideDrawer({ open, width, onClose }: { open: boolean; width: number; onClose: () => void }) {
  const { t } = useTranslation();

  const { user } = useLoggedInUser();

  return (
    <Drawer
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: width,
          boxSizing: "border-box",
        },
      }}
      onClose={onClose}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {user && (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/hazards" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("riskFile.appName")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/validation" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("validation.appName")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/analysisA" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("analysis.A.appName")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/analysisA" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("analysis.B.appName")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/analysisA" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("consensus.appName")} />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/reporting" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("reporting.appName")} />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/analysis/averager" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("analysis.averager.appName")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/analysis/calculator" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("analysis.calculator.appName")} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
