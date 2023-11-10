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
              {user.admin && (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/hazards" onClick={onClose}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={t("sideDrawer.hazardCatalogue", "Hazard Catalogue")} />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/overview" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("sideDrawer.riskAnalysis", "Risk Analysis")} />
                </ListItemButton>
              </ListItem>

              {user.admin && (
                <>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/reporting" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={t("sideDrawer.reporting", "Reporting")} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  {/* <ListItem disablePadding>
                    <ListItemButton component={Link} to="/analysis/averager" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={t("sideDrawer.averager", "Response Averager")} />
                    </ListItemButton>
                  </ListItem> */}
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/analysis/calculator" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={t("sideDrawer.calculator", "Risk Calculator")} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/process" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={t("sideDrawer.experts", "Expert Management")} />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/translations" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={t("sideDrawer.translations", "App Translation")} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              )}
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/learning" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("sideDrawer.informationPortal", "Information Portal")} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
