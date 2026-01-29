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
import { LoggedInUser } from "../hooks/useLoggedInUser";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SummarizeIcon from "@mui/icons-material/Summarize";
import GroupIcon from "@mui/icons-material/Group";
import TranslateIcon from "@mui/icons-material/Translate";
import InfoIcon from "@mui/icons-material/Info";
import CalculateIcon from "@mui/icons-material/Calculate";

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
              <ListItemIcon sx={{ pl: "7px" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={t("sideDrawer.introduction", "Introduction")}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/risks" onClick={onClose}>
              <ListItemIcon sx={{ pl: "7px" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText
                primary={t("sideDrawer.hazardCatalogue", "Hazard Catalogue")}
              />
            </ListItemButton>
          </ListItem>

          {user?.roles.beReader && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/risks/matrix"
                  onClick={onClose}
                >
                  <ListItemIcon sx={{ pl: "7px" }}>
                    <ScatterPlotIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("sideDrawer.riskMatrix", "Risk Matrix")}
                  />
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
                    <ListItemButton
                      component={Link}
                      to="/admin/functions"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <AdminPanelSettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t(
                          "sideDrawer.administration",
                          "Administration",
                        )}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/admin/simulation"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <CalculateIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t("sideDrawer.simulation", "Simulation")}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/export"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t("sideDrawer.reporting", "Reporting")}
                      />
                    </ListItemButton>
                  </ListItem>
                  {/* <Divider /> */}
                  {/* <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/admin/process"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t("sideDrawer.experts", "Expert Management")}
                      />
                    </ListItemButton>
                  </ListItem> */}
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/admin/users"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t("sideDrawer.users", "User Management")}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/admin/translations"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <TranslateIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={t(
                          "sideDrawer.translations",
                          "App Translation",
                        )}
                      />
                    </ListItemButton>
                  </ListItem>
                  {/* <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/admin/corrections"
                      onClick={onClose}
                    >
                      <ListItemIcon sx={{ pl: "7px" }}>
                        <SummarizeIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Report Corrections"} />
                    </ListItemButton>
                  </ListItem> */}
                  <Divider />
                </>
              )}
              {user.roles.verified && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/learning"
                    onClick={onClose}
                  >
                    <ListItemIcon sx={{ pl: "7px" }}>
                      <InfoIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "sideDrawer.informationPortal",
                        "Information Portal",
                      )}
                    />
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
