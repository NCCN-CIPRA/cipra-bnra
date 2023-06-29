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
import EventTimeline from "./EventTimeline";

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
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ScoreCard width={240} height={200} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ImportanceCard riskFile={riskFile} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ResultCard riskFile={riskFile} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <HistoryCard riskFile={riskFile} />
          </Box>
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <ParticipationTable riskFile={riskFile} participants={participants} reloadParticipants={async () => {}} />
        </Grid>
        <Grid xs={12}>
          <EventTimeline />
        </Grid>
      </Grid>
    </Container>
  );
}
