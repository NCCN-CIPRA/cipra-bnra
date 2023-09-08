import {
  DIRECT_ANALYSIS_SECTIONS_STANDARD,
  avg,
  getCADivergence,
  getDADivergence,
  getDASections,
  getQualiFieldName,
} from "../../../functions/inputProcessing";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DiscussionRequired } from "../../../types/DiscussionRequired";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../../../types/dataverse/DVContact";
import {
  DIRECT_ANALYSIS_EDITABLE_FIELDS,
  DVDirectAnalysis,
  FieldQuality,
} from "../../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile, DiscussionsRequired, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Typography,
  CircularProgress,
  Checkbox,
  Rating,
  Chip,
} from "@mui/material";

export default function InputOverviewTab({
  riskFile,
  participants,
  cascades,
  directAnalyses,
  cascadeAnalyses,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation<DVContact>[] | null;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;
}) {
  if (
    riskFile === null ||
    participants === null ||
    cascades === null ||
    directAnalyses === null ||
    cascadeAnalyses === null
  )
    return <CircularProgress sx={{ margin: "auto" }} />;

  const input = participants
    .filter((p) => p.cr4de_role === "expert")
    .map((p) => ({
      participant: p,
      directAnalysis: directAnalyses.find((da) => da._cr4de_expert_value === p._cr4de_contact_value),
    }));
  const cInput = cascades.map((c) => ({
    cascade: c,
    cascadeAnalyses: participants
      .filter((p) => p.cr4de_role === "expert")
      .map((p) => ({
        participant: p,
        cascadeAnalysis: cascadeAnalyses.find(
          (ca) =>
            ca._cr4de_cascade_value === c.cr4de_bnrariskcascadeid && ca._cr4de_expert_value === p._cr4de_contact_value
        ),
      })),
  }));

  const causes = cInput.filter(
    (c) =>
      c.cascade._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      c.cascade.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING
  );
  const catalysingEffects = cInput.filter(
    (c) =>
      c.cascade._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      c.cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING
  );
  const effects = cInput.filter(
    (c) =>
      riskFile.cr4de_risk_type !== RISK_TYPE.STANDARD &&
      c.cascade._cr4de_effect_hazard_value !== riskFile.cr4de_riskfilesid
  );

  console.log(
    getDADivergence(
      directAnalyses.filter((da) =>
        participants.some((p) => p._cr4de_contact_value === da._cr4de_expert_value && p.cr4de_cascade_analysis_finished)
      ),
      SCENARIOS.CONSIDERABLE,
      { name: "dp50", label: "" }
    )
  );

  return (
    <>
      {riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
        <Paper>
          <Toolbar disableGutters sx={{ px: 2, borderBottom: "1px solid #eee" }}>
            <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
              Direct Analysis
            </Typography>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  {input.map((i) => (
                    <TableCell align="center">
                      {i.participant.cr4de_contact.firstname} {i.participant.cr4de_contact.lastname}
                    </TableCell>
                  ))}
                  <TableCell align="center">Divergence</TableCell>
                  <TableCell align="center">Consolidated</TableCell>
                  <TableCell align="center">Discussion Required</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map((scenario) => (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={1000}
                        sx={{
                          backgroundColor: SCENARIO_PARAMS[scenario].color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {SCENARIO_PARAMS[scenario].titleDefault} Scenario
                      </TableCell>
                    </TableRow>
                    {getDASections(riskFile).map((section) => {
                      const qualiName = getQualiFieldName(scenario, section);

                      return (
                        <TableRow>
                          <TableCell>{section.label}</TableCell>
                          {input.map((i) => {
                            if (i.participant.cr4de_direct_analysis_finished === null)
                              return <TableCell align="center">/</TableCell>;

                            return (
                              <TableCell align="center">
                                {(i.directAnalysis?.cr4de_quality ?? {})[
                                  `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof FieldQuality
                                ] ? (
                                  <Rating
                                    size="small"
                                    value={
                                      (i.directAnalysis?.cr4de_quality ?? {})[
                                        `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof FieldQuality
                                      ]
                                    }
                                  />
                                ) : (
                                  "?"
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell align="center">
                            {section.name === "cb"
                              ? "-"
                              : `${
                                  100 *
                                  getDADivergence(
                                    directAnalyses?.filter((da) =>
                                      participants?.some(
                                        (p) =>
                                          p._cr4de_contact_value === da._cr4de_expert_value &&
                                          p.cr4de_direct_analysis_finished
                                      )
                                    ),
                                    scenario,
                                    section
                                  )
                                }%`}
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={
                                riskFile[qualiName as keyof DVRiskFile] !== null &&
                                riskFile[qualiName as keyof DVRiskFile] !== ""
                              }
                              size="small"
                              readOnly
                            />
                          </TableCell>
                          <TableCell align="center">
                            {riskFile.cr4de_discussion_required?.[
                              `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
                            ] === DiscussionRequired.REQUIRED && (
                              <Chip label={DiscussionRequired.REQUIRED} color="error" />
                            )}
                            {riskFile.cr4de_discussion_required?.[
                              `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
                            ] === DiscussionRequired.PREFERRED && (
                              <Chip label={DiscussionRequired.PREFERRED} color="warning" />
                            )}
                            {riskFile.cr4de_discussion_required?.[
                              `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
                            ] === DiscussionRequired.NOT_NECESSARY && (
                              <Chip label={DiscussionRequired.NOT_NECESSARY} color="success" />
                            )}
                            {riskFile.cr4de_discussion_required?.[
                              `${section.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DiscussionsRequired
                            ] == null && <Chip label="?" color="default" />}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {scenario !== SCENARIOS.EXTREME && (
                      <TableRow>
                        <TableCell colSpan={1000}>&nbsp;</TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper sx={{ mt: 8 }}>
        <Toolbar disableGutters sx={{ px: 2, borderBottom: "1px solid #eee" }}>
          <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
            Cascade Analysis
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Risk</TableCell>
                {input.map((i) => (
                  <TableCell align="center">
                    {i.participant.cr4de_contact.firstname} {i.participant.cr4de_contact.lastname}
                  </TableCell>
                ))}
                <TableCell align="center">Divergence</TableCell>
                <TableCell align="center">Consolidated</TableCell>
                <TableCell align="center">Discussion Required</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {causes.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={1000}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#eee",
                    }}
                  >
                    Causes
                  </TableCell>
                </TableRow>
              )}
              {causes.map((input) => (
                <TableRow>
                  <TableCell>{input.cascade.cr4de_cause_hazard.cr4de_title}</TableCell>
                  {input.cascadeAnalyses.map((e) => {
                    if (!e.cascadeAnalysis) {
                      return <TableCell align="center">-</TableCell>;
                    }
                    return (
                      <TableCell align="center">
                        {e.cascadeAnalysis?.cr4de_quality ? (
                          <Rating size="small" value={e.cascadeAnalysis?.cr4de_quality} />
                        ) : (
                          "?"
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    {100 *
                      getCADivergence(
                        input.cascadeAnalyses
                          .filter((i) => i.cascadeAnalysis && i.participant.cr4de_cascade_analysis_finished)
                          .map((p) => p.cascadeAnalysis) as DVCascadeAnalysis[]
                      )}
                    %
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={input.cascade.cr4de_quali !== null && input.cascade.cr4de_quali !== ""}
                      size="small"
                      readOnly
                    />
                  </TableCell>
                  <TableCell align="center">
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.REQUIRED && (
                      <Chip label={DiscussionRequired.REQUIRED} color="error" />
                    )}
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.PREFERRED && (
                      <Chip label={DiscussionRequired.PREFERRED} color="warning" />
                    )}
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.NOT_NECESSARY && (
                      <Chip label={DiscussionRequired.NOT_NECESSARY} color="success" />
                    )}
                    {input.cascade.cr4de_discussion_required == null && <Chip label="?" color="default" />}
                  </TableCell>
                </TableRow>
              ))}
              {causes.length > 0 && (effects.length > 0 || catalysingEffects.length > 0) && (
                <TableRow>
                  <TableCell colSpan={1000}>&nbsp;</TableCell>
                </TableRow>
              )}
              {effects.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={1000}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#eee",
                    }}
                  >
                    {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && "Potential Attacks"}
                    {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && "Catalyzed Risks"}
                  </TableCell>
                </TableRow>
              )}
              {effects.map((input) => (
                <TableRow>
                  <TableCell>{input.cascade.cr4de_effect_hazard.cr4de_title}</TableCell>
                  {input.cascadeAnalyses.map((e) => {
                    if (!e.cascadeAnalysis) {
                      return <TableCell align="center">-</TableCell>;
                    }
                    return (
                      <TableCell align="center">
                        {e.cascadeAnalysis?.cr4de_quality ? (
                          <Rating size="small" value={e.cascadeAnalysis?.cr4de_quality} />
                        ) : (
                          "?"
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    {100 *
                      getCADivergence(
                        input.cascadeAnalyses
                          .filter((p) => p.cascadeAnalysis)
                          .map((p) => p.cascadeAnalysis) as DVCascadeAnalysis[]
                      )}
                    %
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={input.cascade.cr4de_quali !== null && input.cascade.cr4de_quali !== ""}
                      size="small"
                      readOnly
                    />
                  </TableCell>
                  <TableCell align="center">
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.REQUIRED && (
                      <Chip label={DiscussionRequired.REQUIRED} color="error" />
                    )}
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.PREFERRED && (
                      <Chip label={DiscussionRequired.PREFERRED} color="warning" />
                    )}
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.NOT_NECESSARY && (
                      <Chip label={DiscussionRequired.NOT_NECESSARY} color="success" />
                    )}
                    {input.cascade.cr4de_discussion_required == null && <Chip label="?" color="default" />}
                  </TableCell>
                </TableRow>
              ))}
              {effects.length > 0 && catalysingEffects.length > 0 && (
                <TableRow>
                  <TableCell colSpan={1000}>&nbsp;</TableCell>
                </TableRow>
              )}
              {catalysingEffects.length > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={1000}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#eee",
                    }}
                  >
                    Catalysing Effects
                  </TableCell>
                </TableRow>
              )}
              {catalysingEffects.map((input) => (
                <TableRow>
                  <TableCell>{input.cascade.cr4de_cause_hazard.cr4de_title}</TableCell>
                  {input.cascadeAnalyses.map((e) => {
                    if (!e.cascadeAnalysis) {
                      return <TableCell align="center">-</TableCell>;
                    }
                    return (
                      <TableCell align="center">
                        {e.cascadeAnalysis?.cr4de_quality ? (
                          <Rating size="small" value={e.cascadeAnalysis?.cr4de_quality} />
                        ) : (
                          "?"
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    {input.cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0
                      ? `${
                          100 *
                          avg([
                            getDADivergence(
                              directAnalyses.filter((da) =>
                                participants.some(
                                  (p) =>
                                    p._cr4de_contact_value === da._cr4de_expert_value &&
                                    p.cr4de_cascade_analysis_finished
                                )
                              ),
                              SCENARIOS.CONSIDERABLE,
                              { name: "dp50", label: "" }
                            ),
                            getDADivergence(
                              directAnalyses.filter((da) =>
                                participants.some(
                                  (p) =>
                                    p._cr4de_contact_value === da._cr4de_expert_value &&
                                    p.cr4de_cascade_analysis_finished
                                )
                              ),
                              SCENARIOS.MAJOR,
                              { name: "dp50", label: "" }
                            ),
                            getDADivergence(
                              directAnalyses.filter((da) =>
                                participants.some(
                                  (p) =>
                                    p._cr4de_contact_value === da._cr4de_expert_value &&
                                    p.cr4de_cascade_analysis_finished
                                )
                              ),
                              SCENARIOS.EXTREME,
                              { name: "dp50", label: "" }
                            ),
                          ])
                        }%`
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={input.cascade.cr4de_quali !== null && input.cascade.cr4de_quali !== ""}
                      size="small"
                      readOnly
                    />
                  </TableCell>
                  <TableCell align="center">
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.REQUIRED && (
                      <Chip label={DiscussionRequired.REQUIRED} color="error" />
                    )}
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.PREFERRED && (
                      <Chip label={DiscussionRequired.PREFERRED} color="warning" />
                    )}
                    {input.cascade.cr4de_discussion_required === DiscussionRequired.NOT_NECESSARY && (
                      <Chip label={DiscussionRequired.NOT_NECESSARY} color="success" />
                    )}
                    {input.cascade.cr4de_discussion_required == null && <Chip label="?" color="default" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
