import { useState, useEffect } from "react";
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
import { CalculatedRisk } from "../../../types/CalculatedRisk";

export default function OverviewTab({
  riskFile,
  participants,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation<DVContact>[] | null;
}) {
  const [calculatedRisk, setCalculatedRisk] = useState<CalculatedRisk | null>(null);

  useEffect(() => {
    if (!riskFile) return setCalculatedRisk(null);

    setCalculatedRisk({
      ...riskFile,
      calculated: JSON.parse(riskFile.cr4de_calculated || "[]"),
    });
  }, [riskFile]);

  if (!calculatedRisk || !participants) {
    return <LoadingTab />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid xs={12} sx={{ mb: 2 }}>
          <RiskFileStepper riskFile={calculatedRisk} participations={participants} />
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ScoreCard riskFile={calculatedRisk} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ImportanceCard riskFile={calculatedRisk} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ResultCard riskFile={calculatedRisk} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <HistoryCard riskFile={calculatedRisk} />
          </Box>
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <ParticipationTable
            riskFile={calculatedRisk}
            participants={participants}
            reloadParticipants={async () => {}}
          />
        </Grid>
        <Grid xs={12}>
          <EventTimeline />
        </Grid>
      </Grid>
    </Container>
  );
}
