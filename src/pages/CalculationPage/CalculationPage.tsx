import { useState, useEffect, useRef, useMemo } from "react";
import {
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import {
  DVRiskFile,
  RESULT_SNAPSHOT,
  RISK_TYPE,
  RISKFILE_RESULT_FIELD,
} from "../../types/dataverse/DVRiskFile";
import {
  CASCADE_RESULT_SNAPSHOT,
  DVRiskCascade,
  getCascadeResultSnapshot,
  RISK_CASCADE_QUANTI_FIELDS,
} from "../../types/dataverse/DVRiskCascade";
import {
  DIRECT_ANALYSIS_QUANTI_FIELDS,
  DVDirectAnalysis,
} from "../../types/dataverse/DVDirectAnalysis";
import {
  CASCADE_ANALYSIS_QUANTI_FIELDS,
  DVCascadeAnalysis,
} from "../../types/dataverse/DVCascadeAnalysis";
import {
  CascadeCalculation,
  DVAnalysisRun,
  RiskCalculation,
} from "../../types/dataverse/DVAnalysisRun";
import { v4 as uuid } from "uuid";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import {
  getResultSnapshot,
  SmallRisk,
} from "../../types/dataverse/DVSmallRisk";
import RiskFilesDataGrid from "./RiskFilesDataGrid";
import RiskMatrix from "./RiskMatrix";
import RiskNetworkGraph from "./RiskNetworkGraph";
import CascadeDataGrid from "./CascadeDataGrid";
import SankeyGraph from "./SankeyGraph";
import RiskProfileGraph from "./RiskProfileGraph";
import ClimateChangeGraph from "./ClimateChangeGraph";
import ExecutiveSummaryGraph from "./ExecutiveSummaryGraphs";
import CalculationsDelta from "./CalculationsDelta";
import {
  // getDamageIndicatorAbsoluteScale,
  getTotalImpactRelative,
  getCategoryImpactRelative,
  getDamageIndicatorImpactRelative,
} from "../../functions/TotalImpact";
import {
  getScenarioLetter,
  getScenarioSuffix,
  SCENARIOS,
} from "../../functions/scenarios";
import { getTotalProbabilityRelativeScale } from "../../functions/Probability";
import roundString from "../../functions/roundNumberString";
import {
  Cascades,
  getAverageCP,
  getCascades,
  getCausesWithDP,
  getEffectsWithDI,
} from "../../functions/cascades";
import { getDamageIndicatorAbsoluteScale } from "../../functions/Impact";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { useTranslation } from "react-i18next";

const round = (v: number, dig: number) =>
  parseFloat(roundString(v, dig).replace(",", "."));

const getScenarioResult = (
  calculation: RiskCalculation,
  s: SCENARIOS
): { [key in RISKFILE_RESULT_FIELD]: number } => {
  const scenarioSuffix = getScenarioSuffix(s);

  const tp = calculation[`tp${scenarioSuffix}`];
  const tp50 = calculation[`tp50${scenarioSuffix}`];
  const tp_rel = getTotalProbabilityRelativeScale(calculation, scenarioSuffix);
  const tp50_rel = getTotalProbabilityRelativeScale(
    calculation,
    scenarioSuffix,
    true
  );
  const tp_diff = Math.abs(tp50 - tp);
  const tp_diff_rel = Math.abs(tp50_rel - tp_rel);
  const ti = calculation[`ti${scenarioSuffix}`];
  const ti_rel = getTotalImpactRelative(calculation, scenarioSuffix);

  const DP50_offset =
    tp_diff !== 0
      ? ((calculation[`dp50${scenarioSuffix}`] -
          calculation[`dp${scenarioSuffix}`]) /
          tp_diff) *
        tp_diff_rel
      : 0;

  // if (calculation.riskTitle.indexOf("Cold") >= 0) {
  //   console.log(
  //     s,
  //     tp,
  //     tp50,
  //     tp_rel,
  //     tp50_rel,
  //     tp_diff,
  //     tp_diff_rel,

  //     round((calculation[`dp${scenarioSuffix}`] / tp) * tp_rel + DP50_offset, 5)
  //   );
  // }

  return {
    TP: round(tp_rel, 5),
    TP50: round(tp50_rel, 5),

    TI: round(ti_rel, 5),
    TI_H: round(getCategoryImpactRelative(calculation, "H", scenarioSuffix), 5),
    TI_Ha: round(
      getDamageIndicatorImpactRelative(calculation, "Ha", scenarioSuffix),
      5
    ),
    TI_Hb: round(
      getDamageIndicatorImpactRelative(calculation, "Hb", scenarioSuffix),
      5
    ),
    TI_Hc: round(
      getDamageIndicatorImpactRelative(calculation, "Hc", scenarioSuffix),
      5
    ),
    TI_S: round(getCategoryImpactRelative(calculation, "S", scenarioSuffix), 5),
    TI_Sa: round(
      getDamageIndicatorImpactRelative(calculation, "Sa", scenarioSuffix),
      5
    ),
    TI_Sb: round(
      getDamageIndicatorImpactRelative(calculation, "Sb", scenarioSuffix),
      5
    ),
    TI_Sc: round(
      getDamageIndicatorImpactRelative(calculation, "Sc", scenarioSuffix),
      5
    ),
    TI_Sd: round(
      getDamageIndicatorImpactRelative(calculation, "Sd", scenarioSuffix),
      5
    ),
    TI_E: round(getCategoryImpactRelative(calculation, "E", scenarioSuffix), 5),
    TI_Ea: round(
      getDamageIndicatorImpactRelative(calculation, "Ea", scenarioSuffix),
      5
    ),
    TI_F: round(getCategoryImpactRelative(calculation, "F", scenarioSuffix), 5),
    TI_Fa: round(
      getDamageIndicatorImpactRelative(calculation, "Fa", scenarioSuffix),
      5
    ),
    TI_Fb: round(
      getDamageIndicatorImpactRelative(calculation, "Fb", scenarioSuffix),
      5
    ),

    TI_Ha_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Ha",
      scenarioSuffix
    ),
    TI_Hb_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Hb",
      scenarioSuffix
    ),
    TI_Hc_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Hc",
      scenarioSuffix
    ),
    TI_Sa_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Sa",
      scenarioSuffix
    ),
    TI_Sb_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Sb",
      scenarioSuffix
    ),
    TI_Sc_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Sc",
      scenarioSuffix
    ),
    TI_Sd_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Sd",
      scenarioSuffix
    ),
    TI_Ea_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Ea",
      scenarioSuffix
    ),
    TI_Fa_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Fa",
      scenarioSuffix
    ),
    TI_Fb_abs: getDamageIndicatorAbsoluteScale(
      calculation,
      "Fb",
      scenarioSuffix
    ),

    DP: round((calculation[`dp${scenarioSuffix}`] / tp) * tp_rel, 5),
    DP50: round(
      (calculation[`dp${scenarioSuffix}`] / tp) * tp_rel + DP50_offset,
      5
    ),

    DI: round((calculation[`di${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_H: round(
      ((calculation[`di_Ha${scenarioSuffix}`] +
        calculation[`di_Hb${scenarioSuffix}`] +
        calculation[`di_Hc${scenarioSuffix}`]) /
        ti) *
        ti_rel,
      5
    ),
    DI_Ha: round((calculation[`di_Ha${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Hb: round((calculation[`di_Hb${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Hc: round((calculation[`di_Hc${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_S: round(
      ((calculation[`di_Sa${scenarioSuffix}`] +
        calculation[`di_Sb${scenarioSuffix}`] +
        calculation[`di_Sc${scenarioSuffix}`] +
        calculation[`di_Sd${scenarioSuffix}`]) /
        ti) *
        ti_rel,
      5
    ),
    DI_Sa: round((calculation[`di_Sa${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Sb: round((calculation[`di_Sb${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Sc: round((calculation[`di_Sc${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Sd: round((calculation[`di_Sd${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_E: round((calculation[`di_Ea${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Ea: round((calculation[`di_Ea${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_F: round(
      ((calculation[`di_Fa${scenarioSuffix}`] +
        calculation[`di_Fb${scenarioSuffix}`]) /
        ti) *
        ti_rel,
      5
    ),
    DI_Fa: round((calculation[`di_Fa${scenarioSuffix}`] / ti) * ti_rel, 5),
    DI_Fb: round((calculation[`di_Fb${scenarioSuffix}`] / ti) * ti_rel, 5),
  };
};

export default function CalculationPage() {
  const api = useAPI();
  const { t } = useTranslation();
  const logLines = useRef<string[]>(["Loading data..."]);
  const [, setUpdateLog] = useState(Date.now());

  const [calculationProgress, setCalculationProgress] = useState<number | null>(
    null
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const [latestAnalysisId, setLatestAnalysisId] = useState<string | null>(
    "test"
  );

  const [useableDAs, setUseableDAs] = useState<
    DVDirectAnalysis<unknown, DVContact>[] | null
  >(null);
  const [useableCAs, setUseableCAs] = useState<
    DVCascadeAnalysis<unknown, unknown, DVContact>[] | null
  >(null);
  const [calculations, setCalculations] = useState<RiskCalculation[] | null>(
    null
  );
  const [results, setResults] = useState<DVRiskFile[] | null>(null);
  const [resultsRC, setResultsRC] = useState<DVRiskCascade<SmallRisk>[] | null>(
    null
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const logger = (line: string, slice: number = 0) => {
    logLines.current = [...logLines.current.slice(slice), line];
    setUpdateLog(Date.now());
  };

  const {
    data: participations,
    isFetching: loadingParticipations,
    reloadData: reloadParticipations,
  } = useRecords<DVParticipation>({
    table: DataTable.PARTICIPATION,
    onComplete: async (data) => {
      logger(`    Finished loading ${data.length} participations`);
    },
  });
  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile<DVAnalysisRun<unknown, string>>>({
    table: DataTable.RISK_FILE,
    query: `$filter=cr4de_risk_category ne 'test'&$expand=cr4de_latest_calculation`,
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} risk files`),
  });
  const {
    data: cascades,
    isFetching: loadingCascades,
    reloadData: reloadCascades,
  } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: `$select=_cr4de_cause_hazard_value,_cr4de_effect_hazard_value,cr4de_damp,${RISK_CASCADE_QUANTI_FIELDS.join(
      ","
    )},cr4de_result_snapshot&$expand=cr4de_cause_hazard($select=cr4de_title,cr4de_hazard_id),cr4de_effect_hazard($select=cr4de_title,cr4de_hazard_id)`,
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} cascades`),
  });
  const {
    data: directAnalyses,
    isFetching: loadingDAs,
    reloadData: reloadDAs,
  } = useRecords<DVDirectAnalysis<unknown, DVContact>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,cr4de_expert,cr4de_quality,${DIRECT_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_expert($select=emailaddress1)&$filter=_cr4de_expert_value ne null`,
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} direct analyses`),
  });
  const {
    data: cascadeAnalyses,
    isFetching: loadingCAs,
    reloadData: reloadCAs,
  } = useRecords<DVCascadeAnalysis<unknown, unknown, DVContact>>({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,_cr4de_cascade_value,cr4de_expert,cr4de_quality,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_expert($select=emailaddress1)&$filter=_cr4de_expert_value ne null`,
    onComplete: async (data) =>
      logger(`    Finished loading ${data.length} cascade analyses`),
  });
  const { data: summaries, isFetching: loadingSummaries } =
    useRecords<DVRiskSummary>({
      table: DataTable.RISK_SUMMARY,
      onComplete: async (data) =>
        logger(`    Finished loading ${data.length} risk file summaries`),
    });

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const isLoading =
    loadingRiskFiles ||
    loadingCascades ||
    loadingDAs ||
    loadingCAs ||
    loadingParticipations ||
    loadingSummaries;

  const calculator: Worker = useMemo(() => {
    const testUrl = new URL(
      "../../functions/analysis/calculator.worker.ts",
      import.meta.url
    );

    if (testUrl.href.indexOf("githack") >= 0) {
      return new Worker(
        new URL("https://bnra.powerappsportals.com/calculator.worker.js")
      );
    }

    return new Worker(
      new URL("../../functions/analysis/calculator.worker.ts", import.meta.url),
      { type: "module" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFiles]);

  const lastCalculations: RiskCalculation[] = useMemo(() => {
    if (!riskFiles) return [];

    return riskFiles
      .filter(
        (rf) =>
          rf.cr4de_latest_calculation &&
          rf.cr4de_latest_calculation.cr4de_results &&
          rf.cr4de_risk_type !== RISK_TYPE.EMERGING
      )
      .map((rf) => {
        const calc: RiskCalculation = JSON.parse(
          rf.cr4de_latest_calculation?.cr4de_results as string
        );

        // if (!calc.riskId) console.log(rf);

        return calc;
      });
  }, [riskFiles]);

  useEffect(() => {
    if (window.Worker) {
      // calculator.onmessage = (e: MessageEvent<MessageParams>) => {
      calculator.onmessage = (e: MessageEvent) => {
        if (e.data.type === "progress") {
          setCalculationProgress(e.data.value);
        }
        if (e.data.type === "result") {
          const newCalcs = e.data.value.map((c: RiskCalculation) => {
            const risk = riskFiles?.find(
              (r) => r.cr4de_riskfilesid === c.riskId
            );

            if (!risk) return c;

            return {
              ...c,
              keyRisk: risk.cr4de_key_risk,
              code: risk.cr4de_hazard_id,
              category: risk.cr4de_risk_category,
            };
          });

          setCalculations(newCalcs);

          if (riskFiles && cascades) {
            const cDict: {
              [key: string]: DVRiskCascade<SmallRisk, SmallRisk>;
            } = cascades.reduce(
              (acc, c) => ({
                ...acc,
                [c.cr4de_bnrariskcascadeid]: {
                  ...c,
                  results: {},
                },
              }),
              {}
            );

            const newResults: DVRiskFile[] = [];

            newCalcs.forEach((calculation: RiskCalculation) => {
              const riskFile = riskFiles.find(
                (rf) => rf.cr4de_riskfilesid === calculation.riskId
              );

              if (!riskFile) return;

              const result: RESULT_SNAPSHOT = {
                [SCENARIOS.CONSIDERABLE]: getScenarioResult(
                  calculation,
                  SCENARIOS.CONSIDERABLE
                ),
                [SCENARIOS.MAJOR]: getScenarioResult(
                  calculation,
                  SCENARIOS.MAJOR
                ),
                [SCENARIOS.EXTREME]: getScenarioResult(
                  calculation,
                  SCENARIOS.EXTREME
                ),
              };

              newResults.push({
                ...riskFile,
                results: result,
              });

              calculation.causes.forEach((c) => {
                const cascade = cDict[c.cascadeId];
                const cResult = cDict[c.cascadeId].results;

                if (!cascade || !cResult) throw new Error("Huh?");

                [
                  SCENARIOS.CONSIDERABLE,
                  SCENARIOS.MAJOR,
                  SCENARIOS.EXTREME,
                ].forEach((s) => {
                  const scenarioSuffix = getScenarioSuffix(s);

                  const tp = calculation[`tp${scenarioSuffix}`];
                  const tp50 = calculation[`tp50${scenarioSuffix}`];
                  // const tp_yearly = getYearlyProbability(tp);
                  const tp_rel = getTotalProbabilityRelativeScale(
                    calculation,
                    scenarioSuffix
                  );
                  const tp50_rel = getTotalProbabilityRelativeScale(
                    calculation,
                    scenarioSuffix,
                    true
                  );
                  const tp_diff = Math.abs(tp50 - tp);
                  const tp_diff_rel = Math.abs(tp50_rel - tp_rel);

                  const ip = (c[`ip${scenarioSuffix}`] / tp) * tp_rel;

                  cResult[`IP_All2${s[0].toUpperCase() as "C" | "M" | "E"}`] =
                    ip;

                  cResult[`IP50_All2${s[0].toUpperCase() as "C" | "M" | "E"}`] =
                    ip +
                    ((c[`ip50${scenarioSuffix}`] - c[`ip${scenarioSuffix}`]) /
                      tp_diff) *
                      tp_diff_rel;
                });
              });
              calculation.effects.forEach((e) => {
                const cascade = cDict[e.cascadeId];
                const cResult = cDict[e.cascadeId].results;

                if (!cascade || !cResult) throw new Error("Huh?");

                [
                  SCENARIOS.CONSIDERABLE,
                  SCENARIOS.MAJOR,
                  SCENARIOS.EXTREME,
                ].forEach((s) => {
                  const scenarioSuffix = getScenarioSuffix(s);
                  const scenarioLetter = getScenarioLetter(s);

                  const ti = calculation[`ti${scenarioSuffix}`];
                  // const tp_yearly = getYearlyProbability(tp);
                  const ti_rel = getTotalImpactRelative(
                    calculation,
                    scenarioSuffix
                  );

                  cResult[
                    `CP_AVG_${s[0].toUpperCase() as "C" | "M" | "E"}2All`
                  ] = getAverageCP(scenarioLetter, e);

                  cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All`] =
                    (e[`ii${scenarioSuffix}`] / ti) * ti_rel;

                  cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_H`] =
                    ((e[`ii_Ha${scenarioSuffix}`] +
                      e[`ii_Hb${scenarioSuffix}`] +
                      e[`ii_Hc${scenarioSuffix}`]) /
                      ti) *
                    ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Ha`
                  ] = (e[`ii_Ha${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Hb`
                  ] = (e[`ii_Hb${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Hc`
                  ] = (e[`ii_Hc${scenarioSuffix}`] / ti) * ti_rel;

                  cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_S`] =
                    ((e[`ii_Sa${scenarioSuffix}`] +
                      e[`ii_Sb${scenarioSuffix}`] +
                      e[`ii_Sc${scenarioSuffix}`] +
                      e[`ii_Sd${scenarioSuffix}`]) /
                      ti) *
                    ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sa`
                  ] = (e[`ii_Sa${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sb`
                  ] = (e[`ii_Sb${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sc`
                  ] = (e[`ii_Sc${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sd`
                  ] = (e[`ii_Sd${scenarioSuffix}`] / ti) * ti_rel;

                  cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_E`] =
                    (e[`ii_Ea${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Ea`
                  ] = (e[`ii_Ea${scenarioSuffix}`] / ti) * ti_rel;

                  cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_F`] =
                    ((e[`ii_Fa${scenarioSuffix}`] +
                      e[`ii_Fb${scenarioSuffix}`]) /
                      ti) *
                    ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Fa`
                  ] = (e[`ii_Fa${scenarioSuffix}`] / ti) * ti_rel;
                  cResult[
                    `II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Fb`
                  ] = (e[`ii_Fb${scenarioSuffix}`] / ti) * ti_rel;
                });
              });
            });

            setResults(newResults);
            setResultsRC(Object.values(cDict));
          }

          setIsCalculating(false);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculator]);

  useEffect(() => {
    if (
      !participations ||
      !participations[0] ||
      !directAnalyses ||
      !cascadeAnalyses
    )
      return;

    setUseableDAs(
      directAnalyses.filter((da) => {
        const p = participations.find(
          (p) =>
            p._cr4de_contact_value === da.cr4de_expert.contactid &&
            p._cr4de_risk_file_value === da._cr4de_risk_file_value
        );

        if (!p) return false;

        return p.cr4de_direct_analysis_finished;
      })
    );
    setUseableCAs(
      cascadeAnalyses.filter((ca) => {
        const p = participations.find(
          (p) =>
            p._cr4de_contact_value === ca.cr4de_expert.contactid &&
            p._cr4de_risk_file_value === ca._cr4de_risk_file_value
        );

        if (!p) return false;

        return p.cr4de_cascade_analysis_finished;
      })
    );
  }, [participations, directAnalyses, cascadeAnalyses]);

  const reloadData = () => {
    logger("Loading data...");
    reloadParticipations();
    reloadCascades();
    reloadRiskFiles();
    reloadDAs();
    reloadCAs();
  };

  const saveSummaries = async () => {
    if (!riskFiles || !cascades || !summaries) return;

    const riskFilesCalc = riskFiles.map((rf) => ({
      ...rf,
      results: getResultSnapshot(rf),
    }));

    const hc: { [key: string]: DVRiskFile } = riskFilesCalc.reduce(
      (acc, sr) => ({ ...acc, [sr.cr4de_riskfilesid]: sr }),
      {}
    );
    const riskCascades: DVRiskCascade<SmallRisk, SmallRisk>[] = cascades.map(
      (c) => ({
        ...c,
        cr4de_cause_hazard: hc[c._cr4de_cause_hazard_value],
        cr4de_effect_hazard: hc[c._cr4de_effect_hazard_value],
        results: getCascadeResultSnapshot(c),
      })
    );

    const realCascades = riskFilesCalc.reduce(
      (acc, rf) => getCascades(rf, acc, hc)(riskCascades),
      {} as { [key: string]: Cascades }
    );

    for (const rf of riskFilesCalc) {
      const summary = summaries.find(
        (s) => s.cr4de_hazard_id === rf.cr4de_hazard_id
      );

      const scenario = rf.cr4de_mrs || SCENARIOS.CONSIDERABLE;
      const causes = getCausesWithDP(
        rf,
        realCascades[rf.cr4de_riskfilesid],
        scenario
      );
      const effects = getEffectsWithDI(
        rf,
        realCascades[rf.cr4de_riskfilesid],
        scenario
      );

      let minP = 0;
      let cumulP = 0;

      if (rf.results) {
        const Ptot = rf.results[scenario].TP;

        for (const c of causes.sort((a, b) => b.p - a.p)) {
          cumulP += c.p / Ptot;

          if (cumulP >= 0.805) {
            minP = c.p;
            break;
          }
        }
      }

      const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);

      let minI = 0;
      let cumulI = 0;
      for (const e of effects.sort((a, b) => b.i - a.i)) {
        cumulI += e.i / Itot;

        if (cumulI >= 0.8) {
          minI = e.i;
          break;
        }
      }

      const newSummary = {
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${rf.cr4de_riskfilesid})`,

        cr4de_title: rf.cr4de_title,
        cr4de_risk_type: rf.cr4de_risk_type,
        cr4de_category: rf.cr4de_risk_category,
        cr4de_key_risk: rf.cr4de_key_risk,

        cr4de_label_hilp: rf.cr4de_label_hilp,
        cr4de_label_cc: rf.cr4de_label_cc,
        cr4de_label_cb: rf.cr4de_label_cb,
        cr4de_label_impact: rf.cr4de_label_impact,

        cr4de_mrs: rf.cr4de_mrs,
        cr4de_summary_en: rf.cr4de_mrs_summary,
        cr4de_summary_nl: rf.cr4de_mrs_summary_nl,
        cr4de_summary_fr: rf.cr4de_mrs_summary_fr,
        cr4de_summary_de: rf.cr4de_mrs_summary_de,

        cr4de_mrs_p: rf.results
          ? Math.round(10 * rf.results![scenario].TP) / 10
          : 0,
        cr4de_mrs_i: rf.results ? rf.results![scenario].TI : 0,
        cr4de_mrs_h: rf.results ? rf.results![scenario].TI_H : 0,
        cr4de_mrs_s: rf.results ? rf.results![scenario].TI_S : 0,
        cr4de_mrs_e: rf.results ? rf.results![scenario].TI_E : 0,
        cr4de_mrs_f: rf.results ? rf.results![scenario].TI_F : 0,

        cr4de_causing_risks:
          rf.cr4de_risk_type === RISK_TYPE.STANDARD
            ? JSON.stringify(
                causes
                  .filter((c) => c.p >= minP)
                  .map((c) => ({
                    cause_risk_id: "id" in c ? c.id : null,
                    cause_risk_title:
                      "id" in c ? t(c.name) : "No underlying cause",
                    cause_risk_p: c.p,
                  }))
              )
            : null,
        cr4de_effect_risks:
          rf.cr4de_risk_type === RISK_TYPE.EMERGING
            ? null
            : JSON.stringify(
                effects
                  .filter((e) => e.i >= minI)
                  .map((e) => ({
                    effect_risk_id: "id" in e ? e.id : null,
                    effect_risk_title: t(e.name),
                    effect_risk_i: e.i,
                  }))
              ),

        cr4de_definition: rf.cr4de_definition,
        cr4de_horizon_analysis: rf.cr4de_horizon_analysis,
        cr4de_historical_events: rf.cr4de_historical_events,
        cr4de_intensity_parameters: rf.cr4de_intensity_parameters,
        cr4de_scenario_considerable: rf.cr4de_scenario_considerable,
        cr4de_scenario_major: rf.cr4de_scenario_major,
        cr4de_scenario_extreme: rf.cr4de_scenario_extreme,
      };

      if (summary) {
        await api.updateRiskSummary(
          summary.cr4de_bnrariskfilesummaryid,
          newSummary
        );
      } else {
        await api.createRiskSummary(newSummary);
      }
    }
  };

  const saveSnapshot = async () => {
    if (!calculations || !cascades) return;

    const cDict: { [key: string]: DVRiskCascade<SmallRisk, SmallRisk> } =
      cascades.reduce(
        (acc, c) => ({
          ...acc,
          [c.cr4de_bnrariskcascadeid]: c,
        }),
        {}
      );
    const cRDict: { [key: string]: Partial<CASCADE_RESULT_SNAPSHOT> } =
      cascades.reduce(
        (acc, c) => ({
          ...acc,
          [c.cr4de_bnrariskcascadeid]: {},
        }),
        {}
      );

    for (let i = 0; i < calculations.length; i++) {
      const calculation = calculations[i];

      const riskId = calculation.riskId;

      const result: RESULT_SNAPSHOT = {
        [SCENARIOS.CONSIDERABLE]: getScenarioResult(
          calculation,
          SCENARIOS.CONSIDERABLE
        ),
        [SCENARIOS.MAJOR]: getScenarioResult(calculation, SCENARIOS.MAJOR),
        [SCENARIOS.EXTREME]: getScenarioResult(calculation, SCENARIOS.EXTREME),
      };

      await api.updateRiskFile(riskId, {
        cr4de_result_snapshot: JSON.stringify(result),
        // cr4de_mrs: getMostRelevantScenario(calculation),
      });

      calculation.causes.forEach((c) => {
        const cascade = cDict[c.cascadeId];
        const cResult = cRDict[c.cascadeId];

        if (!cascade || !cResult) throw new Error("Huh?");

        [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].forEach(
          (s) => {
            const scenarioSuffix = getScenarioSuffix(s);

            const tp = calculation[`tp${scenarioSuffix}`];
            const tp50 = calculation[`tp50${scenarioSuffix}`];
            // const tp_yearly = getYearlyProbability(tp);
            const tp_rel = getTotalProbabilityRelativeScale(
              calculation,
              scenarioSuffix
            );
            const tp50_rel = getTotalProbabilityRelativeScale(
              calculation,
              scenarioSuffix,
              true
            );
            const tp_diff = Math.abs(tp50 - tp);
            const tp_diff_rel = Math.abs(tp50_rel - tp_rel);

            const ip = (c[`ip${scenarioSuffix}`] / tp) * tp_rel;

            cResult[`IP_All2${s[0].toUpperCase() as "C" | "M" | "E"}`] = ip;

            cResult[`IP50_All2${s[0].toUpperCase() as "C" | "M" | "E"}`] =
              ip +
              ((c[`ip50${scenarioSuffix}`] - c[`ip${scenarioSuffix}`]) /
                tp_diff) *
                tp_diff_rel;
          }
        );
      });
      calculation.effects.forEach((e) => {
        const cResult = cRDict[e.cascadeId];

        [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].forEach(
          (s) => {
            const scenarioSuffix = getScenarioSuffix(s);
            const scenarioLetter = getScenarioLetter(s);

            const ti = calculation[`ti${scenarioSuffix}`];
            // const tp_yearly = getYearlyProbability(tp);
            const ti_rel = getTotalImpactRelative(calculation, scenarioSuffix);

            cResult[`CP_AVG_${s[0].toUpperCase() as "C" | "M" | "E"}2All`] =
              getAverageCP(scenarioLetter, e);

            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All`] = round(
              (e[`ii${scenarioSuffix}`] / ti) * ti_rel,
              5
            );

            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_H`] =
              round(
                ((e[`ii_Ha${scenarioSuffix}`] +
                  e[`ii_Hb${scenarioSuffix}`] +
                  e[`ii_Hc${scenarioSuffix}`]) /
                  ti) *
                  ti_rel,
                5
              );
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Ha`] =
              round((e[`ii_Ha${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Hb`] =
              round((e[`ii_Hb${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Hc`] =
              round((e[`ii_Hc${scenarioSuffix}`] / ti) * ti_rel, 5);

            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_S`] =
              round(
                ((e[`ii_Sa${scenarioSuffix}`] +
                  e[`ii_Sb${scenarioSuffix}`] +
                  e[`ii_Sc${scenarioSuffix}`] +
                  e[`ii_Sd${scenarioSuffix}`]) /
                  ti) *
                  ti_rel,
                5
              );
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sa`] =
              round((e[`ii_Sa${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sb`] =
              round((e[`ii_Sb${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sc`] =
              round((e[`ii_Sc${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Sd`] =
              round((e[`ii_Sd${scenarioSuffix}`] / ti) * ti_rel, 5);

            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_E`] =
              round((e[`ii_Ea${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Ea`] =
              round((e[`ii_Ea${scenarioSuffix}`] / ti) * ti_rel, 5);

            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_F`] =
              round(
                ((e[`ii_Fa${scenarioSuffix}`] + e[`ii_Fb${scenarioSuffix}`]) /
                  ti) *
                  ti_rel,
                5
              );
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Fa`] =
              round((e[`ii_Fa${scenarioSuffix}`] / ti) * ti_rel, 5);
            cResult[`II_${s[0].toUpperCase() as "C" | "M" | "E"}2All_Fb`] =
              round((e[`ii_Fb${scenarioSuffix}`] / ti) * ti_rel, 5);
          }
        );
      });

      //   logger(`Saving calculations (${i + 1}/${results.length})`, 1);
      setCalculationProgress(
        (100 * (i + 1)) / (calculations.length + Object.keys(cRDict).length)
      );
    }

    let i = calculations.length;

    for (const [, cR] of Object.entries(cRDict)) {
      if (Object.keys(cR).length <= 0) {
        continue;
      }

      // await api.updateCascade(cId, {
      //   cr4de_result_snapshot: JSON.stringify(cR),
      // });

      setCalculationProgress(
        (100 * (i + 1)) / (calculations.length + Object.keys(cRDict).length)
      );
      i += 1;
    }

    // logger("Done");
  };

  const saveResults = async () => {
    if (!calculations) return;

    setCalculationProgress(0);

    function flattenCause(c: CascadeCalculation): CascadeCalculation {
      return {
        ...c,
        effect: { riskId: c.effect.riskId } as unknown as RiskCalculation,
        cause: {
          ...c.cause,
          effects: [],
          causes: [],
        },
      };
    }

    function flattenEffect(e: CascadeCalculation): CascadeCalculation {
      return {
        ...e,
        cause: { riskId: e.cause.riskId } as unknown as RiskCalculation,
        effect: {
          ...e.effect,
          causes: [],
          effects: [],
        },
      };
    }

    // console.log("test");
    // console.log(
    //   JSON.stringify(
    //     calculations.map((calc) => ({
    //       ...calc,
    //       causes: calc.causes.map((cause) => flattenCause(cause)),
    //       effects: calc.effects.map((effect) => flattenEffect(effect)),
    //     }))
    //   ).length
    // );

    // logger(`Saving calculations (0/${results.length})`);

    const analysisId = uuid();
    setLatestAnalysisId(analysisId);

    for (let i = 0; i < calculations.length; i++) {
      const calculation = calculations[i];

      const flatCalculation: RiskCalculation = {
        ...calculation,
        causes: calculation.causes.map((cause) => flattenCause(cause)),
        effects: calculation.effects.map((effect) => flattenEffect(effect)),
      };

      //   const metrics = calculateMetrics(calculatedFields, results, riskFiles, participations);

      const riskId = flatCalculation.riskId;
      //   delete calculatedFields.riskId;

      const result = await api.createAnalysisRun({
        cr4de_analysis_id: analysisId,
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskId})`,
        cr4de_results: JSON.stringify(flatCalculation),
        // cr4de_risk_file_metrics: JSON.stringify(metrics),
      });
      await api.updateRiskFile(riskId, {
        "cr4de_latest_calculation@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns(${result.id})`,
      });

      //   logger(`Saving calculations (${i + 1}/${results.length})`, 1);
      setCalculationProgress((i + 1) / calculations.length);
    }

    // logger("Done");
  };

  // console.log(calculations);

  const runCalculations = async () => {
    if (
      !riskFiles ||
      !cascades ||
      !useableDAs ||
      !useableCAs ||
      !participations
    )
      return;

    setIsCalculating(true);
    setSelectedNode(null);

    setCalculationProgress(0);

    calculator.postMessage({
      riskFiles,
      cascades,
      participations,
      directAnalyses: useableDAs,
      cascadeAnalyses: useableCAs,
    });

    // setCalculations(calcs);
    // const [calculations, daMetrics, caMetrics] = await prepareRiskFiles(riskFiles, cascades, useableDAs, useableCAs);

    // logLines.push(
    //   "Direct Analysis Metrics:",
    //   `\t${roundPerc(daMetrics.consensus / daMetrics.total)} consensus values`,
    //   `\t${roundPerc(daMetrics.average / daMetrics.total)} averages values`,
    //   `\t${roundPerc(daMetrics.missing / daMetrics.total)} missing values`
    // );
    // logLines.push(
    //   "Cascade Analysis Metrics:",
    //   `\t${roundPerc(caMetrics.consensus / caMetrics.total)} consensus values`,
    //   `\t${roundPerc(caMetrics.average / caMetrics.total)} averages values`,
    //   `\t${roundPerc(caMetrics.missing / caMetrics.total)} missing values`,
    //   " "
    // );

    // const log = (line: string) => {
    //   logLines.push(line);
    //   setLog([...logLines]);
    // };

    // await convergeProbabilities(calculations, log, 30);
    // log(" ");
    // await convergeImpacts(calculations, log, 30);
    // log(" ");

    // calculations.forEach((c) => {
    //   c.r = c.ti * c.tp;

    //   const metrics = calculateMetrics(c, calculations, riskFiles, participations);
    // });
    // setResults(calculations);

    // setLog([...logLines, "Done"]);
  };

  useEffect(() => {
    if (calculations && selectedNode) {
      const c = calculations.find((c) => c.riskId === selectedNode);

      if (!c) return;

      // console.log("TP: ", r(c.tp), r(c.tp_c), r(c.tp_m), r(c.tp_e));
      // console.log(
      //   "TP sum: ",
      //   r(c.dp + c.causes.reduce((t, c) => t + c.ip, 0)),
      //   r(c.dp_c + c.causes.reduce((t, c) => t + c.ip_c, 0)),
      //   r(c.dp_m + c.causes.reduce((t, c) => t + c.ip_m, 0)),
      //   r(c.dp_e + c.causes.reduce((t, c) => t + c.ip_e, 0))
      // );

      // console.log("TI: ", r(c.ti), r(c.ti_c), r(c.ti_m), r(c.ti_e));
      // console.log(
      //   "TI sum: ",
      //   r(c.di + c.effects.reduce((t, c) => t + c.ii, 0)),
      //   r(c.di_c + c.effects.reduce((t, c) => t + c.ii_c, 0)),
      //   r(c.di_m + c.effects.reduce((t, c) => t + c.ii_m, 0)),
      //   r(c.di_e + c.effects.reduce((t, c) => t + c.ii_e, 0))
      // );

      // console.log(
      //   "TI sum",
      //   r(c.ti_Ha + c.ti_Hb + c.ti_Hc + c.ti_Sa + c.ti_Sb + c.ti_Sc + c.ti_Sd + c.ti_Ea + c.ti_Fa + c.ti_Fb),
      //   r(
      //     c.ti_Ha_c +
      //       c.ti_Hb_c +
      //       c.ti_Hc_c +
      //       c.ti_Sa_c +
      //       c.ti_Sb_c +
      //       c.ti_Sc_c +
      //       c.ti_Sd_c +
      //       c.ti_Ea_c +
      //       c.ti_Fa_c +
      //       c.ti_Fb_c
      //   ),
      //   r(
      //     c.ti_Ha_m +
      //       c.ti_Hb_m +
      //       c.ti_Hc_m +
      //       c.ti_Sa_m +
      //       c.ti_Sb_m +
      //       c.ti_Sc_m +
      //       c.ti_Sd_m +
      //       c.ti_Ea_m +
      //       c.ti_Fa_m +
      //       c.ti_Fb_m
      //   ),
      //   r(
      //     c.ti_Ha_e +
      //       c.ti_Hb_e +
      //       c.ti_Hc_e +
      //       c.ti_Sa_e +
      //       c.ti_Sb_e +
      //       c.ti_Sc_e +
      //       c.ti_Sd_e +
      //       c.ti_Ea_e +
      //       c.ti_Fa_e +
      //       c.ti_Fb_e
      //   )
      // );
      // console.log(
      //   "TI S: ",
      //   r(c.ti_Sa + c.ti_Sb + c.ti_Sc + c.ti_Sd),
      //   r(c.ti_Sa_c + c.ti_Sb_c + c.ti_Sc_c + c.ti_Sd_c),
      //   r(c.ti_Sa_m + c.ti_Sb_m + c.ti_Sc_m + c.ti_Sd_m),
      //   r(c.ti_Sa_e + c.ti_Sb_e + c.ti_Sc_e + c.ti_Sd_e)
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  const riskFile =
    (results
      ? results.find((r) => r.cr4de_riskfilesid === selectedNode)
      : null) || null;
  //console.log(calculations);
  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{}}>
            <Typography variant="subtitle2">Simulation log:</Typography>
            <Box
              sx={{
                mt: 1,
              }}
            >
              <Stack direction="row">
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {riskFiles && !loadingRiskFiles && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Files
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {cascades && !loadingCascades && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Cascades
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {participations && !loadingParticipations && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Participations
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {directAnalyses && !loadingDAs && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Direct Analyses
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {cascadeAnalyses && !loadingCAs && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Cascade Analyses
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {summaries && !loadingSummaries && (
                        <CheckIcon color="success" />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Summaries
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
              <Box sx={{ height: 8, mt: 2, mx: 1 }}>
                {calculationProgress !== null && (
                  <LinearProgress
                    variant="determinate"
                    value={calculationProgress}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading || isCalculating} onClick={reloadData}>
              Reload data
            </Button>
            <Button
              disabled={isLoading || isCalculating}
              onClick={runCalculations}
            >
              {calculations ? "Res" : "S"}tart calculation
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              color="warning"
              disabled={calculations === null || isCalculating}
              onClick={saveResults}
            >
              Save results
            </Button>
            <Button
              color="warning"
              disabled={
                calculations === null || isCalculating || !latestAnalysisId
              }
              onClick={saveSnapshot}
            >
              Save snapshot
            </Button>
            <Button
              color="warning"
              disabled={
                riskFiles === null ||
                cascades === null ||
                summaries === null ||
                isCalculating ||
                !latestAnalysisId
              }
              onClick={saveSummaries}
            >
              Save summaries
            </Button>
          </CardActions>
        </Card>

        <Box>
          <CalculationsDelta
            calculations={calculations}
            previousCalculations={lastCalculations}
            setSelectedNodeId={setSelectedNode}
          />

          <RiskNetworkGraph
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />

          <RiskMatrix
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />

          <RiskFilesDataGrid
            data={calculations}
            setSelectedRiskId={setSelectedNode}
          />

          <CascadeDataGrid data={calculations} />

          <SankeyGraph
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />
          <RiskProfileGraph
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />
          <ClimateChangeGraph riskFile={riskFile} cascades={resultsRC} />
          <ExecutiveSummaryGraph
            riskFile={
              riskFiles?.find((r) => r.cr4de_riskfilesid === selectedNode) ||
              ({} as DVRiskFile)
            }
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />
        </Box>
      </Container>
    </>
  );
}
