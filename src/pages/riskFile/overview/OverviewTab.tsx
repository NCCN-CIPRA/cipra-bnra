import { useState, useEffect } from "react";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import RiskFileStepper from "./RiskFileStepper";
import ParticipationTable from "../../../components/ParticipationTable";
import ScoreCard from "./ScoreCard";
import ResultCard from "./ResultCard";
import HistoryCard from "./HistoryCard";
import ImportanceCard from "./ImportanceCard";
import EventTimeline from "./EventTimeline";
import useRecords from "../../../hooks/useRecords";
import { DataTable } from "../../../hooks/useAPI";
import { DVAnalysisRun, RiskAnalysisResults } from "../../../types/dataverse/DVAnalysisRun";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getConsensusRiskFile } from "../../../functions/inputProcessing";

export default function OverviewTab({
  riskFile,
  directAnalyses,
  cascadeAnalyses,
  participants,
  calculations,
}: {
  riskFile: DVRiskFile | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;
  participants: DVParticipation<DVContact>[] | null;
  calculations: RiskAnalysisResults[] | null;
}) {
  const [consensus, setConsensus] = useState("");

  if (!riskFile || !calculations || !participants) {
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
            {participants && (
              <ScoreCard riskFile={riskFile} participants={participants} calculation={calculations[0].cr4de_results} />
            )}
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ImportanceCard riskFile={riskFile} calculation={calculations[0].cr4de_results} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ResultCard riskFile={riskFile} calculation={calculations[0].cr4de_results} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <HistoryCard riskFile={riskFile} calculations={calculations.slice().reverse()} />
          </Box>
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Consensus Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Consensus Type"
                  onChange={(e) => setConsensus(e.target.value as string)}
                >
                  <MenuItem value={"silence"}>Silence Procedure</MenuItem>
                  <MenuItem value={"meeting"}>Consensus Meeting</MenuItem>
                  <MenuItem value={"none"}>No Consensus</MenuItem>
                </Select>
              </FormControl>
              {consensus === "meeting" && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker sx={{ mt: 2, width: "100%" }} />
                </LocalizationProvider>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  if (!participants || !directAnalyses) return;

                  console.log(
                    getConsensusRiskFile(
                      directAnalyses.filter((da) =>
                        participants.some(
                          (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
                        )
                      )
                    )
                  );
                }}
              >
                Start Consensus Phase
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <ParticipationTable riskFile={riskFile} participants={participants} reloadParticipants={async () => {}} />
        </Grid>
        <Grid xs={12}>
          {directAnalyses && cascadeAnalyses && (
            <EventTimeline
              riskFile={riskFile}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              calculations={calculations}
              participants={participants}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
