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

  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [remember, setRemember] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [registrationForm, setRegistrationForm] = useState("");

  const handleChangeTab = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setResetPassword(false);
    setRegistering(false);
    setTab(newValue);
  };

  const handleLogin = async () => {
    const response = await fetch("https://bnra.powerappsportals.com/SignIn", {
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

    if (response.status === 200) {
      navigate("/");
    } else {
      // TODO: Error
    }
  };

  const handleForgotPassword = async () => {
    const response = await fetch(
      "https://bnra.powerappsportals.com/ForgotPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          __RequestVerificationToken:
            localStorage.getItem("antiforgerytoken") || "",
          Email: email,
        }),
      }
    );

    if (response.status === 200) {
      setResetPassword(false);
    } else {
      // TODO: Error
    }
  };

  const handleRegisterStart = async () => {
    const response = await fetch("https://bnra.powerappsportals.com/Register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        __RequestVerificationToken:
          localStorage.getItem("antiforgerytoken") || "",
        InvitationCode: inviteCode,
        RedeemByLogin: "false",
      }),
    });

    if (response.status === 500) {
      const responseText = await response.text();

      const formHtml = `<form method="post" action="./Register?returnUrl=%2F&amp;invitationCode=q7tqXtl1mwxcZYMy0HlbEFepkVgUwCQvDelqmCRo32M0G3aJ3KPNpjHHmSncMqrAZQHuoT21cNorTyuC2HKYt65alF7-58DbVqp6P6MSRk18KfOPhCxnopWYgXlnxjkyEVN-x24fZow4iZojROlwqTNg2MBvwLBKHEel4RgZzAY-&amp;msCorrelationId=cbd333b9-d9ef-44b4-a166-e8137d22e432&amp;instanceId=d5e7f6ef215086c3f4017c096aaf3e8cd5bc855f64a16876f9f4b4f13b14531b&amp;tenantId=de192ca2-f778-4bb0-b5f1-5cce5803789a&amp;portalId=6355a931-0a0e-4a46-b516-8e55896cca49&amp;orgId=303cf766-f85b-4e52-8a06-e0a807a472a8&amp;environmentId=Default-de192ca2-f778-4bb0-b5f1-5cce5803789a&amp;portalApp=site-3944e3b0-61bd-4033-917b-e8e55214e662-EUn&amp;portalType=CDSStarterPortal&amp;portalProductionOrTrialType=Trial&amp;licenseType=PowerPortal&amp;portalVersion=9.4.8.62&amp;islandId=107&amp;portalDomain=https%3A%2F%2Fbnra.powerappsportals.com" id="Register">
      <div class="aspNetHidden">
      <input type="hidden" name="__EVENTTARGET" id="__EVENTTARGET" value="" />
      <input type="hidden" name="__EVENTARGUMENT" id="__EVENTARGUMENT" value="" />
      <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="/Z05oLvlgACZmlHLTYlfU8j7z1PsgMaKqwx/CHMccb7aPuPIVPNmVvmIlJeMk8fGXN3Wpl0YSE5Xjykkt5Buv/NL2l/vtG3RQlkTTjX4jtfZUCoBp9E6FyxytQlX+Qw48GAZCT/1eyv+m4zHXUw9zddfadHBwH+QOi3H7GAiDwKXcX3kzUEJHirNQpAo5UrQdETxGH5siwIAl9DFe/rrzA0u/PQziPTsfTmrD429f1C6/vkI4zugX9x4VsOg+XdUf7pdDYT5rLQ81EfI4nGBPKi/r7k2YifXcchVbk+IpN8PO5jtVZHIY3WrQKZC1PENBG8zo7br55x6qkJvmr2+mw==" />
      </div>
      
      <script type="text/javascript">
      //<![CDATA[
      var theForm = document.forms['Register'];
      if (!theForm) {
          theForm = document.Register;
      }
      function __doPostBack(eventTarget, eventArgument) {
          if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
              theForm.__EVENTTARGET.value = eventTarget;
              theForm.__EVENTARGUMENT.value = eventArgument;
              theForm.submit();
          }
      }
      //]]>
      </script>
      
      
      <script src="/WebResource.axd?d=pynGkmcFUV13He1Qd6_TZJPDfSZt44QEqKwGCW7u0JfFxENkRZy00TQmujRY054T3y5N9br5kRs6nZrqSUPsKQ2&amp;t=637814653746327080" type="text/javascript"></script>
      
      
      <script src="/ScriptResource.axd?d=NJmAwtEo3Ipnlaxl6CMhvvfMW8AluJP1qOGG6RANIqj7qGHS0thdGVj1_WGrcI-DRb1hJmSYkkyrT1O6VReC96Y-0IveuPzi17dViuQGEqs7nGvtLMb1OjwQs-6P9OPmKe1bvf-SHGMAzg-gh4sPMECd8EQFs3UI6kiRO35VLJU1&amp;t=49337fe8" type="text/javascript"></script>
      <script src="/ScriptResource.axd?d=dwY9oWetJoJoVpgL6Zq8OCk2NQxKtV_f0HwqeHAFTI1wfQkXnlQLJ5SXF31Iphi3dkQKTQRntOC5DQv3JELCSQHYDpfLlW57_Qnvl6CYwOATfh1oeoHj_w1uyeDIK-8seocfONSOTArV6AYeuo0qwBOkCndBL3b2KfBYbFbEeD81&amp;t=49337fe8" type="text/javascript"></script>
      <div class="aspNetHidden">
      
        <input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="82F9452B" />
        <input type="hidden" name="__VIEWSTATEENCRYPTED" id="__VIEWSTATEENCRYPTED" value="" />
      </div>
          <script type="text/javascript">
      //<![CDATA[
      Sys.WebForms.PageRequestManager._initialize('ctl00$ctl00$ContentContainer$MainContent$MainContent$ctl00', 'Register', [], [], [], 90, 'ctl00$ctl00');
      //]]>
      </script>
      
          <div id="ContentContainer_MainContent_MainContent_SecureRegister">
        
            
              <div class="alert alert-info">
                Inwisselcode:
                <strong>q7tqXtl1mwxcZYMy0HlbEFepkVgUwCQvDelqmCRo32M0G3aJ3KPNpjHHmSncMqrAZQHuoT21cNorTyuC2HKYt65alF7-58DbVqp6P6MSRk18KfOPhCxnopWYgXlnxjkyEVN-x24fZow4iZojROlwqTNg2MBvwLBKHEel4RgZzAY-</strong>
              </div>
            
            <div class="row">
              <div id="ContentContainer_MainContent_MainContent_LocalLogin">
          
                <div class="col-md-6">
                  <div class="form-horizontal">
                        <h1 class="login-heading-section">
                          <span id="ContentContainer_MainContent_MainContent_RegisterLocalFormHeading"><span class="xrm-editable-text&#32;xrm-attribute"><span class="xrm-attribute-value">Registreren voor een nieuw lokaal account</span></span></span>
                        </h1>
                        
                        <div id="ContentContainer_MainContent_MainContent_ShowEmail">
            
                          <div class="form-group">
                            <label class="col-sm-4 control-label required" for="EmailTextBox">
                              <span id="ContentContainer_MainContent_MainContent_EmailLabel"><span class="xrm-editable-text&#32;xrm-attribute"><span class="xrm-attribute-value">E-mail</span></span></span></label>
                            <div class="col-sm-8">
                              <input name="ctl00$ctl00$ContentContainer$MainContent$MainContent$EmailTextBox" type="text" value="a@a.com" id="EmailTextBox" class="form-control" />
                            </div>
                          </div>
                        
          </div>
                        <div id="ContentContainer_MainContent_MainContent_ShowUserName">
            
                          <div class="form-group">
                            <label class="col-sm-4 control-label required" for="UserNameTextBox">
                              <span id="ContentContainer_MainContent_MainContent_UsernameLabel"><span class="xrm-editable-text&#32;xrm-attribute"><span class="xrm-attribute-value">Gebruikersnaam</span></span></span></label>
                            <div class="col-sm-8">
                              <input name="ctl00$ctl00$ContentContainer$MainContent$MainContent$UserNameTextBox" type="text" id="UserNameTextBox" class="form-control" />
                            </div>
                          </div>
                        
          </div>
                        <div class="form-group">
                          <label class="col-sm-4 control-label required" for="PasswordTextBox">
                            <span id="ContentContainer_MainContent_MainContent_PasswordLabel"><span class="xrm-editable-text&#32;xrm-attribute"><span class="xrm-attribute-value">Wachtwoord</span></span></span></label>
                          <div class="col-sm-8">
                            <input name="ctl00$ctl00$ContentContainer$MainContent$MainContent$PasswordTextBox" type="password" id="PasswordTextBox" class="form-control" autocomplete="new-password" />
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-4 control-label required" for="ConfirmPasswordTextBox">
                            <span id="ContentContainer_MainContent_MainContent_ConfirmPasswordLabel"><span class="xrm-editable-text&#32;xrm-attribute"><span class="xrm-attribute-value">Wachtwoord bevestigen</span></span></span></label>
                          <div class="col-sm-8">
                            <input name="ctl00$ctl00$ContentContainer$MainContent$MainContent$ConfirmPasswordTextBox" type="password" autocomplete="off" id="ConfirmPasswordTextBox" class="form-control" />
                          </div>
                        </div>
                        
                        <div class="form-group">
                          <div class="col-sm-offset-4 col-sm-8">
                            <input type="submit" name="ctl00$ctl00$ContentContainer$MainContent$MainContent$SubmitButton" value="Registreren" id="SubmitButton" title="Registreren" class="btn&#32;btn-primary" />
                          </div>
                        </div>
                    </div>
                </div>
              
        </div>
              <div id="ContentContainer_MainContent_MainContent_ExternalLogin">
          
                <div class="col-md-6">
                  <input name="__RequestVerificationToken" type="hidden" value="9KdzVG8gCI3jPQFKyKbLr1oeXFcHDu2v63NKpf-SXUlwaMtOORoTFCFOTR3zWm8jGS0Z3Ah3D6ZHgfP15XeU4IvMVKFTbv1N81eKp4HRQEI1" />
                  <div class="form-horizontal">
                      <h1 class="login-heading-section">
                        <span id="ContentContainer_MainContent_MainContent_RegisterExternalLabel"><span class="xrm-editable-text&#32;xrm-attribute"><span class="xrm-attribute-value">Registreren met een extern account</span></span></span></h1>
                      <div id="ContentContainer_MainContent_MainContent_ExternalLoginButtons">
            <button onclick="__doPostBack('ctl00$ctl00$ContentContainer$MainContent$MainContent$ctl01','')" name="provider" type="submit" class="btn&#32;btn-primary&#32;btn-line" title="Azure&#32;AD" value="https://login.windows.net/de192ca2-f778-4bb0-b5f1-5cce5803789a/">Azure AD</button>&nbsp;
          </div>
                  </div>
                </div>
              
        </div>
            </div>
          
      </div>
          
          <script type="text/javascript">
            $(document).ready(function () {
              document.querySelector('title').innerHTML = ($('.nav-tabs > li.active').text() + "&nbsp;· Startportal");
              $("#SubmitButton").on("click", function () {
                $.blockUI({ message: null, overlayCSS: { opacity: .3 } });
              });
              portal.UpdateValidationSummary("ValidationSummary1");
            });
              </script>
        </form>`;

      setRegistrationForm(formHtml);

      setRegistering(true);
    } else {
      // TODO: Error
    }
  };

  const handleRegister = async () => {
    document.getElementById("EmailTextBox")!.setAttribute("value", email);
    document.getElementById("UserNameTextBox")!.setAttribute("value", email);
    document.getElementById("PasswordTextBox")!.setAttribute("value", password);
    document
      .getElementById("ConfirmPasswordTextBox")!
      .setAttribute("value", password2);

    document
      .getElementById("registration-form")!
      .getElementsByTagName("form")[0]
      .submit();
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
                action="/Account/Login/ExternalLogin?ReturnUrl=%2F"
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
