import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Trans, useTranslation } from "react-i18next";
import { LoggedInUser } from "../hooks/useLoggedInUser";

export default function TitleBar({
  title,
  showUser = true,
  onDrawerToggle,
  user,
  setFakeRole,
}: {
  title: string;
  showUser?: boolean;
  onDrawerToggle?: () => void;
  user: LoggedInUser | null | undefined;
  setFakeRole: (role: string) => void;
}) {
  const { i18n } = useTranslation();
  const [role, setRole] = useState(user?.realRoles?.admin ? "Beheerders" : "");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
              {title}
            </Typography>
            {user?.realRoles?.admin && (
              <FormControl
                variant="filled"
                sx={{ width: 200, mr: 4 }}
                size="small"
              >
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  label="Role"
                  onChange={(e) => {
                    setRole(e.target.value);
                    setFakeRole(e.target.value);
                  }}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value={"Beheerders"}>Admin</MenuItem>
                  <MenuItem value={"Analisten"}>Analist</MenuItem>
                  <MenuItem value={"Intern NCCN"}>Intern NCCN</MenuItem>
                  <MenuItem value={"Experten"}>Expert</MenuItem>
                  <MenuItem value={"Geverifieerde gebruikers"}>
                    Rapport Lezer
                  </MenuItem>
                  <MenuItem value={"Anonymous"}>Anoniem</MenuItem>
                </Select>
              </FormControl>
            )}
            <Stack direction="row" sx={{ mr: 4 }}>
              <Button
                variant={i18n.languages[0] === "en" ? "outlined" : "text"}
                color="inherit"
                size="small"
                sx={{ minWidth: 35 }}
                onClick={() => i18n.changeLanguage("en")}
              >
                en
              </Button>
              <Button
                variant={i18n.languages[0] === "fr" ? "outlined" : "text"}
                color="inherit"
                size="small"
                sx={{ minWidth: 35 }}
                onClick={() => i18n.changeLanguage("fr")}
              >
                fr
              </Button>
              <Button
                variant={i18n.languages[0] === "nl" ? "outlined" : "text"}
                color="inherit"
                size="small"
                sx={{ minWidth: 35 }}
                onClick={() => i18n.changeLanguage("nl")}
              >
                nl
              </Button>
              <Button
                variant={i18n.languages[0] === "de" ? "outlined" : "text"}
                color="inherit"
                size="small"
                sx={{ minWidth: 35 }}
                onClick={() => i18n.changeLanguage("de")}
              >
                de
              </Button>
            </Stack>
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
                  onClick={handleMenu}
                >
                  {user?.firstname} {user?.lastname}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
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
