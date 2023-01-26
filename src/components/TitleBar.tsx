import { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { Trans, useTranslation } from "react-i18next";

export default function TitleBar({
  title,
  showUser = true,
  onDrawerToggle,
}: {
  title: string;
  showUser?: boolean;
  onDrawerToggle?: () => void;
}) {
  const { i18n } = useTranslation();
  const { user } = useLoggedInUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
            </Stack>
            {showUser && user == null && (
              <Button color="inherit" component={Link} to="/auth">
                <Trans i18nKey="button.login">Login</Trans>
              </Button>
            )}
            {showUser && user != null && (
              <>
                <Button variant="text" color="inherit" startIcon={<AccountCircleIcon />} onClick={handleMenu}>
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
                      window.location.href = "https://bnra.powerappsportals.com/Account/Login/LogOff?returnUrl=/#/auth";
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
