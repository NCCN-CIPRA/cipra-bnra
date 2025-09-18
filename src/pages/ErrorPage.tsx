import { Alert, AlertTitle, Box, CssBaseline, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { Environment, Indicators } from "../types/global";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <TitleBar
        user={null}
        setFakeRole={() => {}}
        defaultTitle={"BNRA"}
        showUser={false}
        environment={Environment.PUBLIC}
        setEnvironment={() => {}}
        indicators={Indicators.V1}
        setIndicators={() => {}}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert
          severity="error"
          sx={{ width: "600px", mb: 14 }}
          action={
            <Button color="inherit" size="small" onClick={() => navigate(-1)}>
              BACK
            </Button>
          }
        >
          <AlertTitle>Error</AlertTitle>A problem has occured. Please try again
          or contact us as{" "}
          <a href="mailto:cipra.bnra@nccn.fgov.be">cipra.bnra@nccn.fgov.be</a>
        </Alert>
        <img
          alt="logo"
          src="https://bnra.powerappsportals.com/BNRALogo.png"
          style={{ width: 400 }}
        />
      </Box>
    </>
  );
}
