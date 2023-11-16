import { useState, useEffect } from "react";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import {
  CONSENSUS_TYPE,
  DVRiskFile,
  DiscussionsRequired,
  RISK_FILE_QUANTI_FIELDS,
  RISK_TYPE,
} from "../../../types/dataverse/DVRiskFile";
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
  Tooltip,
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
import { DIRECT_ANALYSIS_EDITABLE_FIELDS, DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  getCompletedDirectAnalyses,
  getConsensusCascade,
  getConsensusRiskFile,
} from "../../../functions/inputProcessing";
import { addDays, format } from "date-fns";
import nlBE from "date-fns/locale/nl-BE";
import { LoadingButton } from "@mui/lab";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import useProcess from "../../../hooks/useProcess";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DiscussionRequired } from "../../../types/DiscussionRequired";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

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
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
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
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const api = useAPI();
  const process = useProcess();

  const [test, setTest] = useState<any>(null);

  const getParameter = (field: string) => {
    if (field.indexOf("_climate_change_") >= 0) {
      return `cc_${field.slice(-1)}`;
    }
    if (field.indexOf("_dp_") >= 0) {
      return `dp_${field.slice(-1)}`;
    }

    return `${field.slice(-4, -3)}_${field.slice(-1)}`;
  };

  if (!riskFile || !cascades || !calculations || !participants || !directAnalyses || !cascadeAnalyses) {
    return <LoadingTab />;
  }

  const startConsensus = async () => {
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      ...getConsensusRiskFile(getCompletedDirectAnalyses(riskFile, participants, directAnalyses)),
      cr4de_consensus_type: consensus,
      cr4de_consensus_date:
        (consensus === CONSENSUS_TYPE.MEETING && consensusDate) ||
        (consensus === CONSENSUS_TYPE.SILENCE && addDays(new Date(), 14)) ||
        (consensus === CONSENSUS_TYPE.NONE && new Date()),
    });

    for (let c of cascades) {
      if (
        riskFile.cr4de_risk_type === RISK_TYPE.STANDARD &&
        riskFile.cr4de_riskfilesid === c._cr4de_cause_hazard_value
      ) {
        continue;
      }

      await api.updateCascade(
        c.cr4de_bnrariskcascadeid,
        getConsensusCascade(
          cascadeAnalyses.filter(
            (ca) =>
              ca._cr4de_cascade_value === c.cr4de_bnrariskcascadeid &&
              participants.some(
                (pa) => pa._cr4de_contact_value === ca._cr4de_expert_value && pa.cr4de_cascade_analysis_finished
              ) &&
              !CASCADE_ANALYSIS_QUANTI_FIELDS.some((f) => ca[f] === null)
          ),
          riskFile.cr4de_riskfilesid === c._cr4de_cause_hazard_value
        )
      );
    }

    if (sendEmail) {
      if (consensus === CONSENSUS_TYPE.MEETING) await process.startConsensusMeeting(riskFile);
      else if (consensus === CONSENSUS_TYPE.SILENCE) await process.startConsensusSilenceProcedure(riskFile);
    }

    await reloadRiskFile();
    await reloadCascades();

    setIsSaving(false);
  };

  const cancelConsensus = async () => {
    setIsSaving(true);

    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      // ...Object.keys(
      //   getConsensusRiskFile(
      //     directAnalyses.filter((da) =>
      //       participants.some(
      //         (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
      //       )
      //     )
      //   )
      // ).reduce(
      //   (f, k) => ({
      //     ...f,
      //     [k]: null,
      //   }),
      //   {}
      // ),
      cr4de_consensus_type: null,
      cr4de_consensus_date: null,
    });

    // for (let c of cascades) {
    //   await api.updateCascade(c.cr4de_bnrariskcascadeid, {
    //     ...Object.keys(
    //       getConsensusCascade(
    //         cascadeAnalyses.filter((da) =>
    //           participants.some(
    //             (p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished
    //           )
    //         ),
    //         riskFile.cr4de_riskfilesid === c._cr4de_cause_hazard_value
    //       )
    //     ).reduce(
    //       (f, k) => ({
    //         ...f,
    //         [k]: null,
    //       }),
    //       {}
    //     ),
    //   });
    // }

    await reloadRiskFile();
    await reloadCascades();

    setIsSaving(false);
  };

  const checkConsensus = () => {
    const check = {
      weights: getConsensusRiskFile(getCompletedDirectAnalyses(riskFile, participants, directAnalyses)),
      noWeights: getConsensusRiskFile(getCompletedDirectAnalyses(riskFile, participants, directAnalyses), false),
      cascades: [] as any[],
    };

    for (let c of cascades) {
      if (
        riskFile.cr4de_risk_type === RISK_TYPE.STANDARD &&
        riskFile.cr4de_riskfilesid === c._cr4de_cause_hazard_value
      ) {
        continue;
      }

      check.cascades.push({
        cascade: c,
        weights: getConsensusCascade(
          cascadeAnalyses.filter(
            (ca) =>
              ca._cr4de_cascade_value === c.cr4de_bnrariskcascadeid &&
              participants.some(
                (pa) => pa._cr4de_contact_value === ca._cr4de_expert_value && pa.cr4de_cascade_analysis_finished
              ) &&
              !CASCADE_ANALYSIS_QUANTI_FIELDS.some((f) => ca[f] === null)
          ),
          riskFile.cr4de_riskfilesid === c._cr4de_cause_hazard_value
        ),
        noWeights: getConsensusCascade(
          cascadeAnalyses.filter(
            (ca) =>
              ca._cr4de_cascade_value === c.cr4de_bnrariskcascadeid &&
              participants.some(
                (pa) => pa._cr4de_contact_value === ca._cr4de_expert_value && pa.cr4de_cascade_analysis_finished
              ) &&
              !CASCADE_ANALYSIS_QUANTI_FIELDS.some((f) => ca[f] === null)
          ),
          riskFile.cr4de_riskfilesid === c._cr4de_cause_hazard_value,
          false
        ),
      });
    }

    // console.log(check.cascades);

    setTest(check);
  };

  const fixConsensus = async () => {
    const weights = getConsensusRiskFile(getCompletedDirectAnalyses(riskFile, participants, directAnalyses));

    console.log(
      RISK_FILE_QUANTI_FIELDS.filter((f) => {
        if (
          riskFile.cr4de_discussion_required &&
          riskFile.cr4de_discussion_required[getParameter(f) as keyof DiscussionsRequired] ===
            DiscussionRequired.RESOLVED
        ) {
          return false;
        }
        if (
          riskFile[f] === test.noWeights[f] &&
          riskFile[f] === test.weights[f] &&
          test.weights[f] === test.noWeights[f]
        ) {
          return false;
        }
        return true;
      }).reduce(
        (u, f) => ({
          ...u,
          [f]: test.weights[f],
        }),
        {} as Partial<DVRiskFile>
      )
    );

    await api.updateRiskFile(
      riskFile.cr4de_riskfilesid,
      RISK_FILE_QUANTI_FIELDS.filter((f) => {
        if (
          riskFile.cr4de_discussion_required &&
          riskFile.cr4de_discussion_required[getParameter(f) as keyof DiscussionsRequired] ===
            DiscussionRequired.RESOLVED
        ) {
          return false;
        }
        if (
          riskFile[f] === test.noWeights[f] &&
          riskFile[f] === test.weights[f] &&
          test.weights[f] === test.noWeights[f]
        ) {
          return false;
        }
        return true;
      }).reduce(
        (u, f) => ({
          ...u,
          [f]: test.weights[f],
        }),
        {} as Partial<DVRiskFile>
      )
    );
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
              <ScoreCard
                riskFile={riskFile}
                participants={participants}
                calculation={calculations[0] ? calculations[0].cr4de_results : null}
              />
            )}
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ImportanceCard riskFile={riskFile} calculation={calculations[0] ? calculations[0].cr4de_results : null} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <ResultCard riskFile={riskFile} calculation={calculations[0] ? calculations[0].cr4de_results : null} />
          </Box>
        </Grid>
        <Grid xs={6} md={3}>
          <Box sx={{ height: 200 }}>
            <HistoryCard riskFile={riskFile} calculations={calculations ? calculations.slice().reverse() : null} />
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
                <FormGroup sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
                    label={`Send invitation email to ${participants
                      .filter((p) => p.cr4de_cascade_analysis_finished)
                      .map((p) => p.cr4de_contact.emailaddress1)
                      .join(", ")}`}
                  />
                </FormGroup>
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
                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.MEETING &&
                  riskFile.cr4de_consensus_date &&
                  new Date(riskFile.cr4de_consensus_date) >= new Date() && (
                    <Typography variant="body1">
                      Consensus meeting planned on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                    </Typography>
                  )}
                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.MEETING &&
                  riskFile.cr4de_consensus_date &&
                  new Date(riskFile.cr4de_consensus_date) < new Date() && (
                    <Typography variant="body1">
                      Consensus meeting took place on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                    </Typography>
                  )}

                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.SILENCE &&
                  riskFile.cr4de_consensus_date &&
                  new Date(riskFile.cr4de_consensus_date) >= new Date() && (
                    <Typography variant="body1">
                      Silence procedure ending on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                    </Typography>
                  )}

                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.SILENCE &&
                  riskFile.cr4de_consensus_date &&
                  new Date(riskFile.cr4de_consensus_date) < new Date() && (
                    <Typography variant="body1">
                      Silence procedure ended on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                    </Typography>
                  )}

                {riskFile.cr4de_consensus_type === CONSENSUS_TYPE.NONE && riskFile.cr4de_consensus_date && (
                  <Typography variant="body1">
                    Consensus phase was skipped on {format(new Date(riskFile.cr4de_consensus_date), "dd.MM.yyyy")}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Tooltip
                  title={
                    riskFile.cr4de_consensus_date !== null && new Date(riskFile.cr4de_consensus_date) < new Date()
                      ? "This risk file has been finalized. To click this button anyway, please contact an administrator"
                      : "Cancel the consensus phase and erase all consensus values"
                  }
                >
                  <Box>
                    <LoadingButton
                      disabled={
                        riskFile.cr4de_consensus_date !== null && new Date(riskFile.cr4de_consensus_date) < new Date()
                      }
                      loading={isSaving}
                      onClick={cancelConsensus}
                      color="warning"
                    >
                      Cancel Consensus Phase
                    </LoadingButton>
                  </Box>
                </Tooltip>
              </CardActions>
            </Card>
          )}
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              {test && (
                <>
                  <Typography variant="subtitle1">Risk File Fields:</Typography>
                  <table>
                    <tr>
                      <th>Parameters</th>
                      <th>Risk File</th>
                      <th>No Weights</th>
                      <th>Weights</th>
                    </tr>
                    {RISK_FILE_QUANTI_FIELDS.filter((f) => {
                      if (
                        riskFile.cr4de_discussion_required &&
                        riskFile.cr4de_discussion_required[getParameter(f) as keyof DiscussionsRequired] ===
                          DiscussionRequired.RESOLVED
                      ) {
                        return false;
                      }
                      if (riskFile[f] === test.weights[f]) {
                        return false;
                      }
                      return true;
                    }).map((f) => (
                      <tr>
                        <td>{f}</td>

                        {[riskFile, test.noWeights, test.weights].map((rf) => (
                          <td style={{ paddingLeft: 10, paddingRight: 10 }}>{rf[f]}</td>
                        ))}
                        <td>
                          {riskFile.cr4de_discussion_required &&
                            riskFile.cr4de_discussion_required[getParameter(f) as keyof DiscussionsRequired]}
                        </td>
                      </tr>
                    ))}
                  </table>
                </>
              )}

              {test && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 4 }}>
                    Cascades:
                  </Typography>
                  <table>
                    <tr>
                      <th style={{ textAlign: "left" }}>Parameters</th>
                      <th>Cascade</th>
                      <th>No Weights</th>
                      <th>Weights</th>
                    </tr>
                    {test.cascades
                      .filter((c: any) => {
                        if (c.cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING) return false;
                        return CASCADE_ANALYSIS_QUANTI_FIELDS.some((f) => {
                          return (
                            c.cascade[f] !== c.weights[f] &&
                            c.cascade.cr4de_discussion_required !== DiscussionRequired.RESOLVED
                          );
                        });
                      })
                      .map((c: any) => (
                        <>
                          <tr>
                            <td colSpan={4}>
                              {(c.cascade as DVRiskCascade<SmallRisk, SmallRisk>).cr4de_cause_hazard.cr4de_title} causes{" "}
                              {(c.cascade as DVRiskCascade<SmallRisk, SmallRisk>).cr4de_effect_hazard.cr4de_title}
                            </td>
                          </tr>
                          <tr>
                            {CASCADE_ANALYSIS_QUANTI_FIELDS.filter((f) => {
                              return c.cascade[f] !== c.weights[f];
                              return true;
                            }).map((f) => (
                              <tr>
                                <td>{f}</td>

                                {[c.cascade, c.noWeights, c.weights].map((rf) => (
                                  <td style={{ paddingLeft: 10, paddingRight: 10 }}>{rf[f] || "-"}</td>
                                ))}
                                <td>{c.cascade.cr4de_discussion_required}</td>
                              </tr>
                            ))}
                          </tr>
                        </>
                      ))}
                  </table>
                </>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <LoadingButton
                loading={isSaving}
                disabled={!test}
                placeholder="Updating average values..."
                onClick={fixConsensus}
              >
                Update inconsistent data
              </LoadingButton>
              <LoadingButton loading={isSaving} placeholder="Checking average values..." onClick={checkConsensus}>
                Check consensus data
              </LoadingButton>
            </CardActions>
          </Card>
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
