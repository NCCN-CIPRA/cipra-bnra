import { useState } from "react";
import {
  Tabs,
  Container,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Button,
  CssBaseline,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AuthenticationPage() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [resetPassword, setResetPassword] = useState(false);

  const handleChangeTab = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    console.log(document.cookie);
    if (newValue === 1) {
      fetch("https://bnra.powerappsportals.com/Account/Login/ExternalLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          __RequestVerificationToken:
            localStorage.getItem("antiforgerytoken") || "",
          provider:
            "https://login.windows.net/de192ca2-f778-4bb0-b5f1-5cce5803789a/",
        }),
      });
    } else {
      setResetPassword(false);
      setTab(newValue);
    }
  };

  const handleLogin = async () => {
    fetch("https://bnra.powerappsportals.com/SignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        __RequestVerificationToken:
          localStorage.getItem("antiforgerytoken") || "",
        Username: email,
        PasswordValue: password,
        RememberMe: String(remember),
      }),
    });
  };

  const handleForgotPassword = async () => {
    fetch("https://bnra.powerappsportals.com/ForgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        __RequestVerificationToken:
          localStorage.getItem("antiforgerytoken") || "",
        Email: email,
      }),
    });
  };

  const handleRegister = async () => {
    fetch("https://bnra.powerappsportals.com/SignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        __RequestVerificationToken:
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("__RequestVerificationToken="))
            ?.split("=")[1] || "",
        Username: email,
        PasswordValue: password,
        RememberMe: String(remember),
      }),
    });
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" component={Paper} sx={{ mt: 8 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Log In (External Expert)" {...a11yProps(0)} />
              <Tab label="Log In (Internal NCCN)" {...a11yProps(0)} />
              <Tab label="Register" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            {resetPassword ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    autoComplete="current-email"
                    fullWidth
                    sx={{ my: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Stack spacing={2} direction="row" mt={4}>
                  <Button variant="contained" onClick={handleRegister}>
                    Request Password Reset
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setResetPassword(false)}
                  >
                    Log In
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    autoComplete="current-email"
                    fullWidth
                    sx={{ my: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    fullWidth
                    sx={{ my: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={<Checkbox name="remember" />}
                    label="Remember me"
                    sx={{ ml: 0 }}
                    checked={remember}
                    onChange={(e) => setRemember(!remember)}
                  />
                </Box>
                <Stack spacing={2} direction="row" mt={4}>
                  <Button variant="contained" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setResetPassword(true)}
                  >
                    Forgot Password
                  </Button>
                </Stack>
              </>
            )}
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TextField
                id="outlined-email-input"
                label="Invitation Code"
                type="invitationCode"
                fullWidth
                sx={{ my: 2 }}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </Box>
            <Stack spacing={2} direction="row" mt={4}>
              <Button variant="contained" onClick={handleRegister}>
                Register
              </Button>
            </Stack>
          </TabPanel>
        </Box>
      </Container>
    </>
  );
}
