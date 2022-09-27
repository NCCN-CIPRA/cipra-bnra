import { Box, Container, CssBaseline, Typography } from '@mui/material';
import { useEffect } from 'react';
import './App.css';
import TitleBar from './TitleBar';

function App() {
  useEffect(() => {
    const getRiskFiles = async function() {
      try {
        const riskFiles = await fetch("https://bnra.powerappsportals.com/_api/cr4de_riskfileses", {
          mode: "no-cors",
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        console.log(riskFiles);
      } catch (e) {
        console.log(e);
      }
    }

    getRiskFiles();
  });

  return (
    <div className="App">
      <CssBaseline />
      <TitleBar title="BNRA 2023 - 2026 Risk Identification - Validation" />
      <Container>
        <Box mt={5}>
          <Typography variant="body1" my={2}>
            Welcome to the <b>BNRA 2023 - 2026 Risk File Validation Application</b>, the first step in the risk analysis process!
          </Typography>
          <Typography variant="body1" my={2}>
            In this phase we present to you a first look at the hazards and their corresponding risk files for which you have volunteered to participate as expert. Each of these hazards should be visible in the list below.
          </Typography>
          <Typography variant="body1" my={2}>
            Because the risk files will form the basis for all of the following analytical phases, it is of utmost importance that the information they hold is correct and complete. A preliminary risk file has been written out by NCCN analists, but your topical expertise is required to validate the compiled information. Therefore, <b>we kindly ask you to read the different sections for each of the hazards in the list and provide any corrections, feedback or comments in the fields provided</b>. All input may be provided in the language you feel most comfortable with.
          </Typography>
          <Typography variant="body1" my={2}>
            If you believe an error has been made with regards to the hazards assigned to you, please get in touch with your contact person at NCCN, or email us at <a href="mailto:dist.nccn.bnra@nccn.fgov.be">dist.nccn.bnra@nccn.fgov.be</a>
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default App;
