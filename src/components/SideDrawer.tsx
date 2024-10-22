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
import { Link, useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../pages/AuthPage";
import { LoggedInUser } from "../hooks/useLoggedInUser";

export default function SideDrawer({
  user,
  open,
  width,
  onClose,
}: {
  user: LoggedInUser | null | undefined;
  open: boolean;
  width: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();

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
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary={t("sideDrawer.introduction", "Introduction")} />
            </ListItemButton>
          </ListItem>
          {user?.roles.beReader && (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/risks" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("sideDrawer.hazardCatalogue", "Hazard Catalogue")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/risks/matrix" onClick={onClose}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={t("sideDrawer.riskMatrix", "Risk Matrix")} />
                </ListItemButton>
              </ListItem>
              {/* {user.roles.expert && (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/overview" onClick={onClose}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={t("sideDrawer.riskAnalysis", "Risk Analysis")} />
                  </ListItemButton>
                </ListItem>
              )} */}

              {user.roles.admin && (
                <>
                  <Divider />
                  {/* <ListItem disablePadding>
                    <ListItemButton component={Link} to="/reporting" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={t("sideDrawer.reporting", "Reporting")} />
                    </ListItemButton>
                  </ListItem> */}
                  {/* <Divider /> */}
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
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/admin/corrections" onClick={onClose}>
                      <ListItemIcon></ListItemIcon>
                      <ListItemText primary={"Report Corrections"} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </>
              )}
              {user.roles.verified && (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/learning" onClick={onClose}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={t("sideDrawer.informationPortal", "Information Portal")} />
                  </ListItemButton>
                </ListItem>
              )}
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
