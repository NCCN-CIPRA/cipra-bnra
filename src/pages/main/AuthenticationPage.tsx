import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Alert,
  AlertTitle,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useAPI from "../../hooks/useAPI";

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
  const navigate = useNavigate();
  const api = useAPI();

  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [remember, setRemember] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [registrationForm, setRegistrationForm] = useState("");

  const handleChangeTab = async (event: React.SyntheticEvent, newValue: number) => {
    setResetPassword(false);
    setRegistering(false);
    setTab(newValue);
  };

  const handleLogin = async () => {
    const result = await api.login(email, password, remember);

    if (!result.error) navigate("/");
  };

  const handleForgotPassword = async () => {
    const result = await api.requestPasswordReset(email);

    if (!result.error) setResetPassword(false);
  };

  const handleRegisterStart = async () => {
    const result = await api.requestRegistrationLink(inviteCode);

    if (!result.error && result.data) {
      setRegistrationForm(result.data.formHtml);

      setRegistering(true);
    }
  };

  const handleRegister = async () => {
    document.getElementById("EmailTextBox")!.setAttribute("value", email);
    document.getElementById("UserNameTextBox")!.setAttribute("value", email);
    document.getElementById("PasswordTextBox")!.setAttribute("value", password);
    document.getElementById("ConfirmPasswordTextBox")!.setAttribute("value", password2);

    document.getElementById("SubmitButton")!.click();
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" component={Paper} sx={{ mt: 8 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
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
                  <Button variant="contained" onClick={handleForgotPassword}>
                    Request Password Reset
                  </Button>
                  <Button variant="outlined" onClick={() => setResetPassword(false)}>
                    Log In
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Alert severity="info">
                  <AlertTitle>Password Reset Requested</AlertTitle>
                  Please check your email to reset your password.
                </Alert>
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
                  <Button variant="outlined" onClick={() => setResetPassword(true)}>
                    Forgot Password
                  </Button>
                </Stack>
              </>
            )}
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Stack spacing={2} direction="row" mt={2}>
              <form action="/Account/Login/ExternalLogin?ReturnUrl=/#/auth/ad" method="post">
                <input
                  name="__RequestVerificationToken"
                  type="hidden"
                  value={localStorage.getItem("antiforgerytoken") || ""}
                />

                <Button
                  value="https://login.windows.net/de192ca2-f778-4bb0-b5f1-5cce5803789a/"
                  name="provider"
                  type="submit"
                  variant="contained"
                >
                  Login with Office 365
                </Button>
              </form>
            </Stack>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            {registering ? (
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
                  <TextField
                    id="outlined-password-input"
                    label="Repeat Password"
                    type="password"
                    fullWidth
                    sx={{ my: 2 }}
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </Box>
                <Stack spacing={2} direction="row" mt={4}>
                  <Button variant="contained" onClick={handleRegister}>
                    Register
                  </Button>
                </Stack>
                <div
                  id="registration-form"
                  style={{ display: "none" }}
                  dangerouslySetInnerHTML={{ __html: registrationForm }}
                />
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
                    label="Invitation Code"
                    type="invitationCode"
                    fullWidth
                    sx={{ my: 2 }}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </Box>
                <Stack spacing={2} direction="row" mt={4}>
                  <Button variant="contained" onClick={handleRegisterStart}>
                    Register
                  </Button>
                </Stack>
              </>
            )}
          </TabPanel>
        </Box>
      </Container>
    </>
  );
}
