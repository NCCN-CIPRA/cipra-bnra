import { DVContact } from "../../../types/dataverse/DVContact";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import RiskFileStepper from "./RiskFileStepper";
import ParticipationTable from "../../../components/ParticipationTable";
import ScoreCard from "./ScoreCard";
import ResultCard from "./ResultCard";
import HistoryCard from "./HistoryCard";
import ImportanceCard from "./ImportanceCard";

export default function OverviewTab({
  riskFile,
  participants,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation<DVContact>[] | null;
}) {
  if (!riskFile || !participants) {
    return <LoadingTab />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid xs={12} sx={{ mb: 2 }}>
          <RiskFileStepper riskFile={riskFile} participations={participants} />
        </Grid>
        <Grid xs={3}>
          <Box sx={{ height: 200 }}>
            <ScoreCard />
          </Box>
        </Grid>
        <Grid xs={3}>
          <Box sx={{ height: 200 }}>
            <ImportanceCard />
          </Box>
        </Grid>
        <Grid xs={3}>
          <Box sx={{ height: 200 }}>
            <ResultCard />
          </Box>
        </Grid>
        <Grid xs={3}>
          <Box sx={{ height: 200 }}>
            <HistoryCard />
          </Box>
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <ParticipationTable riskFile={riskFile} participants={participants} reloadParticipants={async () => {}} />
        </Grid>
        <Grid xs={12}>
          <Box sx={{ height: 150, backgroundColor: "rgba(40, 200, 40, 0.3)", padding: 2 }}>Activity Log</Box>
        </Grid>
      </Grid>
    </Container>
  );
}
