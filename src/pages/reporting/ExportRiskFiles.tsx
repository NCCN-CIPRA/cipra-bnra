import { Box, List, ListItem, Typography } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import HistoricalEventsTable from "../../components/HistoricalEventsTable";
import ScenariosTable from "../../components/ScenariosTable";
import * as IP from "../../functions/intensityParameters";
import IntensityParametersTable from "../../components/IntensityParametersTable";
import ScenarioTable from "./ScenarioTable";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { hexToRGB } from "../../functions/colors";
import { DVAnalysisRun, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getDirectImpact, getIndirectImpact } from "../../functions/Impact";
import ImpactBarChart from "../../components/charts/ImpactBarChart";
import SankeyDiagram from "../../components/charts/SankeyDiagram";
import ScenarioMatrix from "../../components/charts/ScenarioMatrix";
import HistoricalEvents from "./HistoricalEvents";
import Scenario from "./Scenario";
import { getYearlyProbability } from "../../functions/analysis/calculateTotalRisk";
import ProbabilityOriginPieChart from "../../components/charts/ProbabilityOriginPieChart";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import getImpactColor from "../../functions/getImpactColor";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import ClimateChangeMatrix from "../../components/charts/ClimateChangeMatrix";

const getMostRelevantScenario = (r: RiskCalculation) => {
  if (r.tr_c > r.tr_m && r.tr_c > r.tr_e) return SCENARIOS.CONSIDERABLE;
  if (r.tr_m > r.tr_c && r.tr_m > r.tr_e) return SCENARIOS.MAJOR;
  return SCENARIOS.EXTREME;
};

const getScenarioSuffix = (scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

export default function ExportRiskFiles({
  riskFiles,
  cascades,
}: {
  riskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[];
  cascades: DVRiskCascade<SmallRisk>[];
}) {
  const calculations = riskFiles.map((rf) => JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as string));
  const cDict = cascades.reduce(
    (acc, c) => ({
      ...acc,
      [c.cr4de_bnrariskcascadeid]: c,
    }),
    {} as { [key: string]: DVRiskCascade }
  );

  return (
    <>
      {/* <Typography variant="h2" sx={{ mb: 4 }}>
        Standard Risks
      </Typography> */}

      {riskFiles
        .filter((rf) => rf.cr4de_risk_type === RISK_TYPE.STANDARD && rf.cr4de_latest_calculation)
        .map((rf) => {
          const intensityParameters = IP.unwrap(rf.cr4de_intensity_parameters);
          const calc: RiskCalculation = JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as string);
          const MRS = getMostRelevantScenario(calc);
          const MRSSuffix = getScenarioSuffix(MRS);

          const ti_H = Math.round(calc[`ti_Ha${MRSSuffix}`] + calc[`ti_Hb${MRSSuffix}`] + calc[`ti_Hc${MRSSuffix}`]);
          const ti_S = Math.round(
            calc[`ti_Sa${MRSSuffix}`] +
              calc[`ti_Sb${MRSSuffix}`] +
              calc[`ti_Sc${MRSSuffix}`] +
              calc[`ti_Sd${MRSSuffix}`]
          );
          const ti_E = Math.round(calc[`ti_Ea${MRSSuffix}`]);
          const ti_F = Math.round(calc[`ti_Fa${MRSSuffix}`] + calc[`ti_Fb${MRSSuffix}`]);

          const causes = [
            {
              name: "No underlying cause",
              p: calc[`dp${MRSSuffix}`],
              quali: rf[`cr4de_dp_quali${MRSSuffix}`],
            },
            ...(calc.causes
              .filter((c) => c[`ip${MRSSuffix}`] !== 0)
              .map((c) => ({
                name: c.cause.riskTitle,
                p: c[`ip${MRSSuffix}`],
                quali: cDict[c.cascadeId].cr4de_quali,
              })) || []),
          ].sort((a, b) => b.p - a.p);

          const effects = [
            getDirectImpact(calc),
            ...calc.effects.map((c) => getIndirectImpact(c, calc, cDict[c.cascadeId])),
          ];

          const catalyzing = cascades.filter(
            (c) =>
              c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid &&
              c.cr4de_c2c === null &&
              c.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0
          );
          const cc = cascades.filter((c) => c.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0);

          return (
            <Box sx={{ mb: 10 }}>
              <Typography variant="h3" sx={{ mb: 4 }}>
                {rf.cr4de_title}
              </Typography>

              <SankeyDiagram
                calculations={calculations}
                selectedNodeId={rf.cr4de_riskfilesid}
                setSelectedNodeId={() => {}}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="h5">Definition</Typography>
                <Box
                  sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}
                  dangerouslySetInnerHTML={{
                    __html: rf.cr4de_definition || "",
                  }}
                />
              </Box>

              {rf.cr4de_historical_events && (
                <Box sx={{ mt: 8 }}>
                  <Typography variant="h5">Historical Events</Typography>
                  <HistoricalEvents riskFile={rf} />
                </Box>
              )}

              {rf.cr4de_intensity_parameters && (
                <Box sx={{ mt: 8 }}>
                  <Typography variant="h5">Most Relevant Scenario</Typography>

                  <ScenarioMatrix calculation={calc} mrs={MRS} />

                  {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

                  <Scenario intensityParameters={intensityParameters} riskFile={rf} scenario={MRS} />
                </Box>
              )}

              <Box sx={{ mt: 8, clear: "both" }}>
                <Typography variant="h5">Probability Assessment</Typography>
                <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
                  <ProbabilityOriginPieChart
                    causes={causes
                      .filter((c) => c.p / calc[`tp${MRSSuffix}`] >= 0.01)
                      .slice(0, 5)
                      .map((c) => ({ ...c, total: calc[`tp${MRSSuffix}`] }))}
                  />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    There is an estimated{" "}
                    <b>{Math.round(10000 * getYearlyProbability(calc[`tp${MRSSuffix}`])) / 100}%</b> chance of an
                    incident of this magnitude to happen in the next 3 years. The following possible underlying causes
                    for such an incident were identified:
                  </Typography>

                  <Box sx={{ ml: 0 }}>
                    {causes.slice(0, 5).map((c, i) => (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">
                          {i + 1}. {c.name} ({Math.round((10000 * c.p) / calc[`tp${MRSSuffix}`]) / 100}% of total
                          probability)
                        </Typography>
                        <Box sx={{ ml: 2 }} dangerouslySetInnerHTML={{ __html: c.quali || "" }} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 8 }}>
                <Typography variant="h5">Impact Assessment</Typography>

                <Box
                  sx={{ borderLeft: "solid 8px " + getImpactColor("H"), px: 2, py: 1, mt: 2, backgroundColor: "white" }}
                >
                  {effects.filter((c) => c.h >= 0.01 && (c.h * ti_H) / calc.ti > 0.01).length > 0 ? (
                    <>
                      <Typography variant="h6">Human Impact</Typography>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        The human impact represents an estimated <b>{Math.round((100 * ti_H) / calc.ti)}%</b> of the
                        total impact of an incident of this magnitude. Possible explanation for the human impact are:
                      </Typography>

                      <List sx={{ ml: 2.5, listStyle: "disc" }}>
                        {effects
                          .filter((c) => c.h >= 0.01 && (c.h * ti_H) / calc.ti > 0.01)
                          .sort((a, b) => b.h - a.h)
                          .slice(0, 5)
                          .map((c, i) => (
                            <ListItem sx={{ mb: 1, display: "list-item", pl: 0 }} dense>
                              <Typography variant="subtitle2">{c.name} </Typography>
                              <Typography variant="caption">
                                <b>{Math.round(10000 * c.h) / 100}%</b> of total human impact,{" "}
                                <b>{Math.round((10000 * c.h * ti_H) / calc.ti) / 100}%</b> of total impact
                              </Typography>
                              {c.quali ? (
                                <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: c.quali || "" }} />
                              ) : (
                                <Box
                                  sx={{ ml: 0 }}
                                  dangerouslySetInnerHTML={{ __html: rf[`cr4de_di_quali_h${MRSSuffix}`] || "" }}
                                />
                              )}
                            </ListItem>
                          ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="caption">
                      The human impact is within the margin of error and further elaboration is not considered useful.
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{ borderLeft: "solid 8px " + getImpactColor("S"), px: 2, py: 1, mt: 2, backgroundColor: "white" }}
                >
                  {effects.filter((c) => c.s >= 0.01 && (c.s * ti_S) / calc.ti > 0.01).length > 0 ? (
                    <>
                      <Typography variant="h6">Societal Impact</Typography>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        The societal impact represents an estimated <b>{Math.round((100 * ti_S) / calc.ti)}%</b> of the
                        total impact of an incident of this magnitude. Possible explanation for the societal impact are:
                      </Typography>

                      <List sx={{ ml: 2.5, listStyle: "disc" }}>
                        {effects
                          .filter((c) => c.s >= 0.01 && (c.s * ti_S) / calc.ti > 0.01)
                          .sort((a, b) => b.s - a.s)
                          .slice(0, 5)
                          .map((c, i) => (
                            <ListItem sx={{ mb: 1, display: "list-item", pl: 0 }} dense>
                              <Typography variant="subtitle2">{c.name} </Typography>
                              <Typography variant="caption">
                                <b>{Math.round(10000 * c.s) / 100}%</b> of total scoietal impact,{" "}
                                <b>{Math.round((10000 * c.s * ti_S) / calc.ti) / 100}%</b> of total impact
                              </Typography>
                              {c.quali ? (
                                <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: c.quali || "" }} />
                              ) : (
                                <Box
                                  sx={{ ml: 0 }}
                                  dangerouslySetInnerHTML={{ __html: rf[`cr4de_di_quali_s${MRSSuffix}`] || "" }}
                                />
                              )}
                            </ListItem>
                          ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="caption">
                      The societal impact is within the margin of error and further elaboration is not considered
                      useful.
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{ borderLeft: "solid 8px " + getImpactColor("E"), px: 2, py: 1, mt: 2, backgroundColor: "white" }}
                >
                  <Typography variant="h6">Environmental Impact</Typography>

                  {effects.filter((c) => c.e >= 0.01 && (c.e * ti_E) / calc.ti > 0.01).length > 0 ? (
                    <>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        The environmental impact represents an estimated <b>{Math.round((100 * ti_E) / calc.ti)}%</b> of
                        the total impact of an incident of this magnitude. Possible explanation for the environmental
                        impact are:
                      </Typography>

                      <List sx={{ ml: 2.5, listStyle: "disc" }}>
                        {effects
                          .filter((c) => c.e >= 0.01 && (c.e * ti_E) / calc.ti > 0.01)
                          .sort((a, b) => b.e - a.e)
                          .slice(0, 5)
                          .map((c, i) => (
                            <ListItem sx={{ mb: 1, display: "list-item", pl: 0 }} dense>
                              <Typography variant="subtitle2">{c.name} </Typography>
                              <Typography variant="caption">
                                <b>{Math.round(10000 * c.e) / 100}%</b> of total environmental impact,{" "}
                                <b>{Math.round((10000 * c.e * ti_E) / calc.ti) / 100}%</b> of total impact
                              </Typography>
                              {c.quali ? (
                                <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: c.quali || "" }} />
                              ) : (
                                <Box
                                  sx={{ ml: 0 }}
                                  dangerouslySetInnerHTML={{ __html: rf[`cr4de_di_quali_e${MRSSuffix}`] || "" }}
                                />
                              )}
                            </ListItem>
                          ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="caption">
                      The environmental impact is within the margin of error and further elaboration is not considered
                      useful.
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{ borderLeft: "solid 8px " + getImpactColor("F"), px: 2, py: 1, mt: 2, backgroundColor: "white" }}
                >
                  <Typography variant="h6">Financial Impact</Typography>
                  {effects.filter((c) => c.f >= 0.01 && (c.f * ti_F) / calc.ti > 0.01).length > 0 ? (
                    <>
                      <Typography variant="body2" sx={{ mb: 3 }}>
                        The financial impact represents an estimated <b>{Math.round((100 * ti_F) / calc.ti)}%</b> of the
                        total impact of an incident of this magnitude. Possible explanation for the financial impact
                        are:
                      </Typography>

                      <List sx={{ ml: 2.5, listStyle: "disc" }}>
                        {effects
                          .filter((c) => c.f >= 0.01 && (c.f * ti_F) / calc.ti > 0.01)
                          .sort((a, b) => b.f - a.f)
                          .slice(0, 5)
                          .map((c, i) => (
                            <ListItem sx={{ mb: 1, display: "list-item", pl: 0 }} dense>
                              <Typography variant="subtitle2">{c.name} </Typography>
                              <Typography variant="caption">
                                <b>{Math.round(10000 * c.f) / 100}%</b> of total financial impact,{" "}
                                <b>{Math.round((10000 * c.f * ti_F) / calc.ti) / 100}%</b> of total impact
                              </Typography>
                              {c.quali ? (
                                <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: c.quali || "" }} />
                              ) : (
                                <Box
                                  sx={{ ml: 0 }}
                                  dangerouslySetInnerHTML={{ __html: rf[`cr4de_di_quali_f${MRSSuffix}`] || "" }}
                                />
                              )}
                            </ListItem>
                          ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="caption">
                      The financial impact is within the margin of error and further elaboration is not considered
                      useful.
                    </Typography>
                  )}
                </Box>

                <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
                  <Typography variant="h6">Cross-border Impact</Typography>
                  <Box
                    sx={{ ml: 2, borderTop: "1px solid #eee" }}
                    dangerouslySetInnerHTML={{
                      __html: rf.cr4de_cross_border_impact_quali_c || "",
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 8 }}>
                <Typography variant="h5">Climate Change</Typography>

                <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
                  <ClimateChangeMatrix calculation={calc} />

                  <Box sx={{ clear: "both" }} />
                </Box>
              </Box>

              <Box sx={{ mt: 8 }}>
                <Typography variant="h5">Other Catalysing Effects</Typography>

                <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
                  <List sx={{ ml: 2.5, listStyle: "disc" }}>
                    {catalyzing.map((c, i) => (
                      <ListItem sx={{ mb: 1, display: "list-item", pl: 0 }} dense>
                        <Typography variant="subtitle2">{c.cr4de_cause_hazard.cr4de_title} </Typography>

                        <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: c.cr4de_quali || "" }} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Box>
          );
        })}
    </>
  );
}
