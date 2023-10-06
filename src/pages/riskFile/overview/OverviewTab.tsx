import { useState, useEffect } from "react";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { CONSENSUS_TYPE, DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
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
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { DVAnalysisRun, RiskAnalysisResults } from "../../../types/dataverse/DVAnalysisRun";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getConsensusCascade, getConsensusRiskFile } from "../../../functions/inputProcessing";
import { addDays, format } from "date-fns";
import nlBE from "date-fns/locale/nl-BE";
import { LoadingButton } from "@mui/lab";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";

export default function OverviewTab({
  riskFile,
  cascades,
  directAnalyses,
  cascadeAnalyses,
  participants,
  calculations,
  reloadRiskFile,
  reloadCascades,
}: {
  riskFile: DVRiskFile | null;
  cascades: DVRiskCascade[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;
  participants: DVParticipation<DVContact>[] | null;
  calculations: RiskAnalysisResults[] | null;
  reloadRiskFile: () => Promise<void>;
  reloadCascades: () => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [consensus, setConsensus] = useState<CONSENSUS_TYPE | string>("");
  const [consensusDate, setConsensusDate] = useState<Date | null>(null);
  const api = useAPI();

  if (!riskFile || !cascades || !calculations || !participants || !directAnalyses || !cascadeAnalyses) {
    return <LoadingTab />;
  }

  const startConsensus = async () => {
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      ...getConsensusRiskFile(
        directAnalyses.filter((da) =>
          participants.some(
            (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
          )
        )
      ),
      cr4de_consensus_type: consensus,
      cr4de_consensus_date:
        (consensus === CONSENSUS_TYPE.MEETING && consensusDate) ||
        (consensus === CONSENSUS_TYPE.SILENCE && addDays(new Date(), 14)) ||
        (consensus === CONSENSUS_TYPE.NONE && new Date()),
    });

    for (let c of cascades) {
      await api.updateCascade(
        c.cr4de_bnrariskcascadeid,
        getConsensusCascade(
          cascadeAnalyses.filter((da) =>
            participants.some(
              (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
            )
          )
        )
      );
    }

    await reloadRiskFile();
    await reloadCascades();

    setIsSaving(false);
  };

  const cancelConsensus = async () => {
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      ...Object.keys(
        getConsensusRiskFile(
          directAnalyses.filter((da) =>
            participants.some(
              (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
            )
          )
        )
      ).reduce(
        (f, k) => ({
          ...f,
          [k]: null,
        }),
        {}
      ),
      cr4de_consensus_type: null,
      cr4de_consensus_date: null,
    });

    for (let c of cascades) {
      await api.updateCascade(c.cr4de_bnrariskcascadeid, {
        ...Object.keys(
          getConsensusCascade(
            cascadeAnalyses.filter((da) =>
              participants.some(
                (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
              )
            )
          )
        ).reduce(
          (f, k) => ({
            ...f,
            [k]: null,
          }),
          {}
        ),
      });
    }

    await reloadRiskFile();
    await reloadCascades();

    setIsSaving(false);
  };

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
          {riskFile.cr4de_consensus_type === null ? (
            <Card>
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel>Consensus Type</InputLabel>
                  <Select label="Consensus Type" onChange={(e) => setConsensus(e.target.value as CONSENSUS_TYPE)}>
                    <MenuItem value={CONSENSUS_TYPE.SILENCE}>Silence Procedure</MenuItem>
                    <MenuItem value={CONSENSUS_TYPE.MEETING}>Consensus Meeting</MenuItem>
                    <MenuItem value={CONSENSUS_TYPE.NONE}>No Consensus</MenuItem>
                  </Select>
                </FormControl>
                {consensus === CONSENSUS_TYPE.MEETING && (
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nlBE}>
                    <DatePicker
                      sx={{ mt: 2, width: "100%" }}
                      value={consensusDate}
                      onChange={(v) => setConsensusDate(v)}
                    />
                  </LocalizationProvider>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <LoadingButton
                  loading={isSaving}
                  placeholder="Saving average values..."
                  disabled={consensus === "" || (consensus === CONSENSUS_TYPE.MEETING && !consensusDate)}
                  onClick={startConsensus}
                >
                  Start Consensus Phase
                </LoadingButton>
              </CardActions>
            </Card>
          ) : (
            <Card>
              <CardContent>
                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.MEETING && riskFile.cr4de_consensus_date && (
                  <Typography variant="body1">
                    Consensus meeting planned on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                  </Typography>
                )}

                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.SILENCE && riskFile.cr4de_consensus_date && (
                  <Typography variant="body1">
                    Silence procedure ending on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                  </Typography>
                )}

                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.NONE && riskFile.cr4de_consensus_date && (
                  <Typography variant="body1">
                    Consensus phase was skipped on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <LoadingButton loading={isSaving} onClick={cancelConsensus} color="warning">
                  Cancel Consensus Phase
                </LoadingButton>
              </CardActions>
            </Card>
          )}
        </Grid>
        <Grid xs={12} sx={{ my: 2 }}>
          <ParticipationTable riskFile={riskFile} participants={participants} reloadParticipants={async () => {}} />
        </Grid>
        {/* <Grid xs={12}>
          {directAnalyses && cascadeAnalyses && (
            <EventTimeline
              riskFile={riskFile}
              directAnalyses={directAnalyses}
              cascadeAnalyses={cascadeAnalyses}
              calculations={calculations}
              participants={participants}
            />
          )}
        </Grid> */}
      </Grid>
    </Container>
  );
}
