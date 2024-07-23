import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "../../hooks/useAPI";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Alert, AlertTitle, Box, Button, CircularProgress, Container, Fade, Typography } from "@mui/material";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";

export default function PermissionDeniedPage({}) {
  return (
    <Container sx={{}}>
      <Alert
        severity="error"
        sx={{ width: "600px", mx: "auto", my: 14 }}
        // action={
        // <Button color="inherit" size="small" onClick={() => navigate(-1)}>
        //   BACK
        // </Button>
        // }
      >
        <AlertTitle>Permission Denied</AlertTitle>
        <Typography variant="body1" paragraph>
          Unfortunately you do not seem to have the appropriate permissions to access the data on this page.
        </Typography>
        <Typography variant="body1" paragraph>
          Please contact us at <a href="mailto:cipra.bnra@nccn.fgov.be">cipra.bnra@nccn.fgov.be</a> if you would like to
          request access to this resource.
        </Typography>
      </Alert>
      <Box sx={{ textAlign: "center" }}>
        <img src="https://bnra.powerappsportals.com/BNRALogo.png" style={{ width: 400 }} />
      </Box>
    </Container>
  );
}
