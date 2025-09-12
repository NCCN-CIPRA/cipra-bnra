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
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useAPI from "../../hooks/useAPI";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

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
  const { t } = useTranslation();
  const api = useAPI();

  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();

  const handleChangeTab = async (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setResetPassword(false);
    setTab(newValue);
  };

  const handleLogin = async () => {
    setLoading(true);
    const result = await api.login(email, password, remember);

    if (!result.error) {
      const returnUrl = params.get("returnUrl");
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        window.location.href = "/";
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setPasswordResetSent(true);
    const result = await api.requestPasswordReset(email);

    if (!result.error) setResetPassword(false);

    setLoading(false);
  };

  return (
    <>
      <Container maxWidth="md" component={Paper} sx={{ mt: 20 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab
                label={t("auth.login.tabName1", "Log In (External Expert)")}
                {...a11yProps(0)}
              />
              <Tab
                label={t("auth.login.tabName2", "Log In (Internal NCCN)")}
                {...a11yProps(0)}
              />
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
                  <Typography variant="body2" paragraph>
                    <Trans i18nKey="auth.resetPassword">
                      Please enter the email you used to register on the
                      platform below. An email will be sent containing
                      instruction to reset your password.
                    </Trans>
                  </Typography>
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
                {passwordResetSent && (
                  <Alert severity="info" sx={{ mb: 4 }}>
                    <AlertTitle>
                      <Trans i18nKey="auth.resetPassword.sentTitle">
                        Password Reset Requested
                      </Trans>
                    </AlertTitle>
                    <Trans i18nKey="auth.resetPassword.sentContent">
                      Please check your email to reset your password.
                    </Trans>
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 4 }}>
                    <AlertTitle>
                      <Trans i18nKey="auth.login.errorTitle">Login Error</Trans>
                    </AlertTitle>

                    <Typography variant="caption">
                      <Trans i18nKey={error}>
                        Ongeldige Aanmeldpoging.{" "}
                        <a href="mailto:cipra.bnra@nccn.fgov.be">
                          cipra.bnra@nccn.fgov.be
                        </a>
                      </Trans>
                    </Typography>
                  </Alert>
                )}
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
                    autoComplete="email"
                    fullWidth
                    sx={{ my: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="password"
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
                    onChange={() => setRemember(!remember)}
                  />
                </Box>
                <Stack spacing={2} direction="row" mt={4}>
                  <Button
                    loading={loading}
                    variant="contained"
                    onClick={handleLogin}
                  >
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
          <TabPanel value={tab} index={1}>
            <Stack spacing={2} direction="row" mt={2}>
              <form
                action="/Account/Login/ExternalLogin?ReturnUrl=/"
                method="post"
              >
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
        </Box>
      </Container>
    </>
  );
}
