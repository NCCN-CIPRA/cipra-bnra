import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import calculateTotalImpact, { getEffectGraph } from "./calculateTotalImpact";
import calculateTotalProbability, {
  getCausalGraph,
} from "./calculateTotalProbability";
import calculateTotalRisk from "./calculateTotalRisk";
import prepareRiskFiles from "./prepareRiskFiles";

export default function runAnalysis(
  {
    riskFiles,
    cascades,
    participations,
    directAnalyses,
    cascadeAnalyses,
  }: // runs,
  // damping,
  // log,
  // setCalculationProgress,
  {
    riskFiles: DVRiskFile[];
    cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
    //   contacts: DVContact[];
    participations: DVParticipation[];
    directAnalyses: DVDirectAnalysis<unknown, DVContact>[];
    cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[];
    // runs: number;
    // damping: number;
    // log: (l: string) => void;
  },
  setCalculationProgress: (l: number) => void
) {
  const riskFilesDict = riskFiles.reduce(
    (d, c) => ({
      ...d,
      [c.cr4de_riskfilesid]: c,
    }),
    {} as { [key: string]: DVRiskFile }
  );

  const calculations = prepareRiskFiles(
    riskFiles,
    riskFilesDict,
    cascades,
    participations,
    directAnalyses,
    cascadeAnalyses
  );

  return calculations.map((c, i) => {
    const graph = getEffectGraph(getCausalGraph(c));

    // if (c.riskTitle.indexOf("lectricity") < 0) return c;

    calculateTotalProbability(graph);
    calculateTotalImpact(graph);
    calculateTotalRisk(graph);

    // console.log((100 * (i + 1)) / calculations.length);
    setCalculationProgress((100 * (i + 1)) / calculations.length);

    // console.log(`(${i + 1}/${calculations.length}) - Starting calculation for "${c.riskTitle}"`);
    // c.tp_c = calculateTotalProbability(c, SCENARIOS.CONSIDERABLE);
    // c.tp_m = calculateTotalProbability(c, SCENARIOS.MAJOR);
    // c.tp_e = calculateTotalProbability(c, SCENARIOS.EXTREME);
    // c.causes.forEach((cascade) => (c.ip = c.ip_c + c.ip_m + c.ip_e));

    return graph;
  });
}
