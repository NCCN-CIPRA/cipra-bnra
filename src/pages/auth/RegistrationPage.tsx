import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Tabs,
  Container,
  Button,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useAPI from "../../hooks/useAPI";
import { Trans, useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type RouteParams = {
  registration_code: string;
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

export default function RegistrationPage() {
  const { t } = useTranslation();
  const params = useParams() as RouteParams;
  const api = useAPI();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [inviteCode, setInviteCode] = useState(params.registration_code);
  const [accept, setAccept] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<boolean | string>(false);
  const [loading, setLoading] = useState(false);

  const [registrationForm, setRegistrationForm] = useState("");

  const handleRegisterStart = async () => {
    setLoading(true);

    const result = await api.requestRegistrationLink(inviteCode);

    setLoading(false);
    if (!result.error && result.data) {
      setRegistrationForm(result.data.formHtml);
      setEmail(result.data.email);

      setRegistering(true);
      setError(false);
    } else {
      setError(true);
    }
  };

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

  const handleRegister = async () => {
    setLoading(true);

    if (email.length < 1 || email.indexOf("@") < 0) {
      setError("email");
      setLoading(false);
    } else if (!goodPW(password)) {
      setError("password");
      setLoading(false);
    } else if (password !== password2) {
      setError("passwordMatch");
      setLoading(false);
    } else if (!accept) {
      setError("accept");
      setLoading(false);
    } else {
      setError(false);
      document.getElementById("EmailTextBox")!.setAttribute("value", email);
      document.getElementById("UserNameTextBox")!.setAttribute("value", email);
      document
        .getElementById("PasswordTextBox")!
        .setAttribute("value", password);
      document
        .getElementById("ConfirmPasswordTextBox")!
        .setAttribute("value", password2);

      document.getElementById("SubmitButton")!.click();
    }
  };

  return (
    <>
      <Container maxWidth="md" component={Paper} sx={{ mt: 20 }}>
        <Box sx={{ width: "100%", mb: 12 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={0} aria-label="basic tabs example">
              <Tab
                label={t("auth.registration.tabName", "Register")}
                {...a11yProps(0)}
              />
            </Tabs>
          </Box>
          <TabPanel value={0} index={0}>
            {registering ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                      <AlertTitle>
                        <Trans i18nKey="auth.registration.error2.title">
                          Registration Error
                        </Trans>
                      </AlertTitle>
                      {error === "email" && (
                        <Trans i18nKey="auth.registration.error2.email">
                          Please enter a valid email
                        </Trans>
                      )}
                      {error === "password" && (
                        <Trans i18nKey="auth.registration.error2.password">
                          Your password is not complex enough. Please consult
                          the password requirements below.
                        </Trans>
                      )}
                      {error === "passwordMatch" && (
                        <Trans i18nKey="auth.registration.error2.passwordMatch">
                          Your passwords did not match.
                        </Trans>
                      )}
                      {error === "accept" && (
                        <Trans i18nKey="auth.registration.error2.accept">
                          Please accept the privacy policy.
                        </Trans>
                      )}
                    </Alert>
                  )}
                  <Typography variant="body2" paragraph>
                    <Trans i18nKey="auth.registration.introduction2">
                      Please choose a password below. You will need these
                      credentials to log in to the BNRA Risk Analysis Platform.
                    </Trans>
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <Trans i18nKey="auth.registration.introduction3">
                      Wachtwoorden moet ten minste 8 tekens bevatten.
                      Wachtwoorden moeten tekens bevatten van ten minste drie
                      van de volgende vier klassen: hoofdletters, kleine
                      letters, cijfers en niet-alfanumeriek (speciaal).
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

                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" paragraph sx={{ mt: 4 }}>
                      <Trans i18nKey="auth.registration.disclaimer1">
                        Deze website gebruikt cookies van Microsoft om de
                        functionaliteit te verbeteren. Deze gegevens worden door
                        Microsoft opgeslagen. Meer informatie over cookies vindt
                        u in ons{" "}
                        <a
                          target="_blank"
                          href="https://crisiscentrum.be/nl/bnra/cookiebeleid"
                          rel="noreferrer"
                        >
                          cookiebeleid
                        </a>
                        .
                      </Trans>
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <Trans i18nKey="auth.registration.disclaimer2">
                        Bovendien worden de persoonlijke gegevens die u
                        vrijwillig verstrekt in het formulier niet opgeslagen
                        voor commerciële doeleinden of doorgegeven aan derden. U
                        geeft uitsluitend toestemming om deze gegevens te
                        verwerken voor het geven van deskundig advies in het
                        kader van de BNRA.
                      </Trans>
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <Trans i18nKey="auth.registration.disclaimer3">
                        Uw gegevens worden bewaard tot het einde van de studie
                        en nog een jaar langer om de studie voor de volgende
                        periode te starten, dus maximaal 5 jaar. Voor meer
                        informatie: lees de{" "}
                        <a
                          target="_blank"
                          href="https://crisiscentrum.be/nl/bnra/privacyverklaring-bnra"
                          rel="noreferrer"
                        >
                          privacyverklaring
                        </a>
                        .
                      </Trans>
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <Trans i18nKey="auth.registration.disclaimer4">
                        U kunt uw recht van toegang, rechtzetting, verwijdering,
                        beperking of verzet tegen de verwerking van uw gegevens
                        uitoefenen door te mailen naar{" "}
                        <a href="mailto:cipra.bnra@nccn.fgov.be">
                          cipra.bnra@nccn.fgov.be
                        </a>
                        .
                      </Trans>
                    </Typography>

                    <FormGroup sx={{ mt: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={accept}
                            onChange={(e) => setAccept(e.target.checked)}
                          />
                        }
                        label={t("auth.registration.agree", "Ik ga akkoord")}
                      />
                    </FormGroup>
                  </Box>
                </Box>
                <Stack spacing={2} direction="row" mt={4}>
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    loading={loading}
                    onClick={handleRegister}
                  >
                    <Trans i18nKey="auth.button.registration">Register</Trans>
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
                  {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                      <AlertTitle>
                        <Trans i18nKey="auth.registration.error.title">
                          Unknown Invitation Code
                        </Trans>
                      </AlertTitle>
                      <Trans i18nKey="auth.registration.error.content">
                        Please try again or contact{" "}
                        <a href="mailto:cipra.bnra@nccn.fgov.be">
                          cipra.bnra@nccn.fgov.be
                        </a>
                      </Trans>
                    </Alert>
                  )}
                  <Typography variant="body2" paragraph>
                    <Trans i18nKey="auth.registration.introduction1">
                      Please enter the invitation code you received from your
                      NCCN contact below. If you did not receive a code, please
                      contact{" "}
                      <a href="mailto:cipra.bnra@nccn.fgov.be">
                        cipra.bnra@nccn.fgov.be
                      </a>
                    </Trans>
                  </Typography>
                  <TextField
                    id="outlined-email-input"
                    label="Invitation Code"
                    type="invitationCode"
                    fullWidth
                    sx={{ mt: 4, mb: 2 }}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                  />
                </Box>
                <Stack spacing={2} direction="row" mt={2}>
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    loading={loading}
                    onClick={handleRegisterStart}
                  >
                    <Trans i18nKey="auth.button.startRegistration">
                      Start Registration
                    </Trans>
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
