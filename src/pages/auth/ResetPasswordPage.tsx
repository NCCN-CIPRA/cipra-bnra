import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, Container, Paper, TextField, Stack, CssBaseline, Alert, AlertTitle } from "@mui/material";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useAPI from "../../hooks/useAPI";
import TitleBar from "../../components/TitleBar";
import { Trans, useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type RouteParams = {
  user_id: string;
  code: string;
};

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

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  let [searchParams] = useSearchParams();
  const api = useAPI();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<boolean | string>(false);
  const [loading, setLoading] = useState(false);

  const goodPW = (pw: string) => {
    if (pw.length < 8) return false;

    let score = 0;

    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(pw)) score++;

    if (score < 3) return false;

    return true;
  };

  const handleResetPassword = async () => {
    setLoading(true);

    if (!goodPW(password)) {
      setError("password");
      setLoading(false);
    } else if (password !== password2) {
      setError("passwordMatch");
      setLoading(false);
    } else {
      const result = await api.resetPassword(
        searchParams.get("user_id") || "",
        searchParams.get("code") || "",
        password
      );

      if (!result.error) {
        setError(false);
        window.location.href = "/";
      } else {
        setError(true);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <TitleBar title={t("auth.resetPassword.title", "BNRA 2023 - 2026 Password Reset")} />
      <Container maxWidth="md" component={Paper} sx={{ mt: 20 }}>
        <Box sx={{ width: "100%", mb: 12 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={0} aria-label="basic tabs example">
              <Tab label={t("auth.resetPassword.tabName", "Reset Password")} {...a11yProps(0)} />
            </Tabs>
          </Box>
          <TabPanel value={0} index={0}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                  <AlertTitle>
                    <Trans i18nKey="auth.resetPassword.error2.title">Password Error</Trans>
                  </AlertTitle>
                  {error === "password" && (
                    <Trans i18nKey="auth.registration.error2.password">
                      Your password is not complex enough. Please consult the password requirements below.
                    </Trans>
                  )}
                  {error === "passwordMatch" && (
                    <Trans i18nKey="auth.registration.error2.passwordMatch">Your passwords did not match.</Trans>
                  )}
                </Alert>
              )}
              <Typography variant="body2" paragraph>
                <Trans i18nKey="auth.registration.introduction2">
                  Please choose a password below. You will need these credentials to log in to the BNRA Risk Analysis
                  Platform.
                </Trans>
              </Typography>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="auth.registration.introduction3">
                  Wachtwoorden moet ten minste 8 tekens bevatten. Wachtwoorden moeten tekens bevatten van ten minste
                  drie van de volgende vier klassen: hoofdletters, kleine letters, cijfers en niet-alfanumeriek
                  (speciaal).
                </Trans>
              </Typography>
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                fullWidth
                sx={{ mt: 4 }}
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
              <LoadingButton variant="contained" sx={{ mr: 1 }} loading={loading} onClick={handleResetPassword}>
                Reset Password
              </LoadingButton>
            </Stack>
          </TabPanel>
        </Box>
      </Container>
    </>
  );
}
