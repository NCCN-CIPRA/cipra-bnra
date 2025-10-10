import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IconButton, Menu, MenuItem, Stack, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Trans, useTranslation } from "react-i18next";
import { LoggedInUser } from "../hooks/useLoggedInUser";
import { usePageTitleValue } from "../hooks/usePageTitle";
import { Environment, Indicators } from "../types/global";
import TranslateIcon from "@mui/icons-material/Translate";
import SettingsIcon from "@mui/icons-material/Settings";

export default function TitleBar({
  showUser = true,
  onDrawerToggle,
  user,
  environment,
  indicators,
  showDiff,
  setFakeRole,
  setEnvironment,
  setIndicators,
  setShowDiff,
  defaultTitle,
}: {
  showUser?: boolean;
  onDrawerToggle?: () => void;
  user: LoggedInUser | null | undefined;
  environment: Environment;
  indicators: Indicators;
  showDiff: boolean;
  setFakeRole: (role: string) => void;
  setEnvironment: (newEnv: Environment) => void;
  setIndicators: (newInd: Indicators) => void;
  setShowDiff: (newDiff: boolean) => void;
  defaultTitle?: string;
}) {
  const { i18n } = useTranslation();
  const [role, setRole] = useState(user?.realRoles?.admin ? "Beheerders" : "");
  const { pageTitle } = usePageTitleValue();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null
  );
  const [anchorElSettings, setAnchorElSettings] = useState<null | HTMLElement>(
    null
  );
  const [anchorElRole, setAnchorElRole] = useState<null | HTMLElement>(null);
  const [anchorElEnv, setAnchorElEnv] = useState<null | HTMLElement>(null);
  const [anchorElInd, setAnchorElInd] = useState<null | HTMLElement>(null);
  const [anchorElDiff, setAnchorElDiff] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLanguage(event.currentTarget);
  };
  const handleOpenSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSettings(event.currentTarget);
  };
  const handleOpenRoleMenu = (event: React.MouseEvent<HTMLElement>) => {
    handleCloseSubMenus();
    setAnchorElRole(event.currentTarget);
  };
  const handleOpenEnvMenu = (event: React.MouseEvent<HTMLElement>) => {
    handleCloseSubMenus();
    setAnchorElEnv(event.currentTarget);
  };
  const handleOpenIndMenu = (event: React.MouseEvent<HTMLElement>) => {
    handleCloseSubMenus();
    setAnchorElInd(event.currentTarget);
  };
  const handleOpenDiffMenu = (event: React.MouseEvent<HTMLElement>) => {
    handleCloseSubMenus();
    setAnchorElDiff(event.currentTarget);
  };
  const handleCloseMenus = () => {
    setAnchorElUser(null);
    setAnchorElLanguage(null);
    setAnchorElSettings(null);
    setAnchorElRole(null);
    setAnchorElEnv(null);
    setAnchorElInd(null);
    setAnchorElDiff(null);
  };

  const handleCloseSubMenus = () => {
    setAnchorElRole(null);
    setAnchorElEnv(null);
    setAnchorElInd(null);
  };

  const getRoleDisplay = () => {
    if (user?.roles.admin) return "Admin";
    if (user?.roles.analist) return "Analist";
    if (user?.roles.internal) return "Internal NCCN";
    if (user?.roles.expert) return "Expert";
    if (user?.roles.beReader) return "Rapport Lezer";
    return "Anoniem";
  };

  useEffect(() => {
    if (role === "") setRole(user?.realRoles?.admin ? "Beheerders" : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {onDrawerToggle && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {pageTitle || defaultTitle}
            </Typography>
            {user?.roles?.analist && (
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                {__APP_VERSION__}
              </Typography>
            )}
            {user?.realRoles?.analist && (
              <>
                <Box sx={{ flexGrow: 0, mr: 0 }}>
                  <Tooltip title="Settings">
                    <IconButton
                      color="inherit"
                      onClick={handleOpenSettingsMenu}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-settings"
                    anchorEl={anchorElSettings}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElSettings)}
                    onClose={handleCloseMenus}
                  >
                    <MenuItem onMouseEnter={handleOpenRoleMenu}>
                      <Typography sx={{ textAlign: "left", flex: 1 }}>
                        User Role:
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {getRoleDisplay()}
                      </Typography>
                      <Menu
                        id="menu-role"
                        sx={{ top: -8, left: -10 }}
                        anchorEl={anchorElRole}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElRole)}
                        onClose={handleCloseMenus}
                        slotProps={{
                          root: { sx: { pointerEvents: "none" } },
                          paper: { sx: { pointerEvents: "auto" } },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            setRole("Beheerders");
                            setFakeRole("Beheerders");
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Admin
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRole("Analisten");
                            setFakeRole("Analisten");
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Analist
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRole("Intern NCCN");
                            setFakeRole("Intern NCCN");
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Intern NCCN
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRole("Experten");
                            setFakeRole("Experten");
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Expert
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRole("Geverifieerde gebruikers");
                            setFakeRole("Geverifieerde gebruikers");
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Rapport Lezer
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRole("Anonymous");
                            setFakeRole("Anonymous");
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Anoniem
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </MenuItem>
                    <MenuItem onMouseEnter={handleOpenEnvMenu}>
                      <Typography sx={{ textAlign: "left", flex: 1 }}>
                        Environment:
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {environment}
                      </Typography>

                      <Menu
                        id="menu-env"
                        sx={{ top: -8, left: -10 }}
                        anchorEl={anchorElEnv}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElEnv)}
                        onClose={handleCloseMenus}
                        slotProps={{
                          root: { sx: { pointerEvents: "none" } },
                          paper: { sx: { pointerEvents: "auto" } },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            setEnvironment(Environment.PUBLIC);
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Public - Static data
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setEnvironment(Environment.DYNAMIC);
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            CIPRA Only - Dynamic data
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </MenuItem>
                    <MenuItem onMouseEnter={handleOpenIndMenu}>
                      <Typography sx={{ textAlign: "left", flex: 1 }}>
                        Indicators:
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {indicators}
                      </Typography>

                      <Menu
                        id="menu-ind"
                        sx={{ top: -8, left: -10 }}
                        anchorEl={anchorElInd}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElInd)}
                        onClose={handleCloseMenus}
                        slotProps={{
                          root: { sx: { pointerEvents: "none" } },
                          paper: { sx: { pointerEvents: "auto" } },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            setIndicators(Indicators.V1);
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            V1 - 5 point scales
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setIndicators(Indicators.V2);
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            V2 - 7 point scales
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </MenuItem>
                    <MenuItem onMouseEnter={handleOpenDiffMenu}>
                      <Typography sx={{ textAlign: "left", flex: 1 }}>
                        Data Diff:
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 2 }}>
                        {showDiff && environment !== Environment.PUBLIC
                          ? "Enabled"
                          : "Disabled"}
                      </Typography>

                      <Menu
                        id="menu-diff"
                        sx={{ top: -8, left: -10 }}
                        anchorEl={anchorElDiff}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        open={Boolean(anchorElDiff)}
                        onClose={handleCloseMenus}
                        slotProps={{
                          root: { sx: { pointerEvents: "none" } },
                          paper: { sx: { pointerEvents: "auto" } },
                        }}
                      >
                        <MenuItem
                          disabled={environment !== Environment.DYNAMIC}
                          onClick={() => {
                            setShowDiff(true);
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Enabled{" "}
                            {environment === Environment.PUBLIC
                              ? "(Only in dynamic environment)"
                              : ""}
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setShowDiff(false);
                            handleCloseMenus();
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Disabled
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </MenuItem>
                  </Menu>
                </Box>
                <Stack
                  direction="column"
                  sx={{
                    mr: 1,
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle2" fontSize={10}>
                    {environment === Environment.PUBLIC ? "P" : "D"}
                  </Typography>
                  <Typography variant="subtitle2" fontSize={10}>
                    {indicators === Indicators.V1 ? "1" : "2"}
                  </Typography>
                </Stack>
              </>
            )}
            <Box sx={{ flexGrow: 0, mr: 4 }}>
              <Tooltip title="Language">
                <IconButton color="inherit" onClick={handleOpenLanguageMenu}>
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-language"
                anchorEl={anchorElLanguage}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElLanguage)}
                onClose={handleCloseMenus}
              >
                <MenuItem
                  onClick={() => {
                    i18n.changeLanguage("de");
                    handleCloseMenus();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Deutsch</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    i18n.changeLanguage("en");
                    handleCloseMenus();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>English</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    i18n.changeLanguage("fr");
                    handleCloseMenus();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Français</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    i18n.changeLanguage("nl");
                    handleCloseMenus();
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Nederlands
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            {showUser && user == null && (
              <Button color="inherit" component={Link} to="/auth">
                <Trans i18nKey="button.login">Login</Trans>
              </Button>
            )}
            {showUser && user != null && (
              <>
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<AccountCircleIcon />}
                  onClick={handleOpenUserMenu}
                >
                  {user?.firstname} {user?.lastname}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseMenus}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseMenus();
                      window.location.href =
                        "https://bnra.powerappsportals.com/Account/Login/LogOff?returnUrl=/auth";
                    }}
                  >
                    <Trans i18nKey="button.logout">Log out</Trans>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
