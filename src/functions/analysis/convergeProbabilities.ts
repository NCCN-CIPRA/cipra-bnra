import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import calculateIndirectProbabilities from "./calculateIndirectProbabilities";
import calculateTotalProbabilities from "./calculateTotalProbabilities";

export default async function convergeProbabilities(
  risks: RiskCalculation[],
  log: (line: string) => void,
  maxRuns: number = 10,
  maxDelta: number = 0.001
) {
  log("Converging probabilities...");

  let lastTotalProbability = 0;

  for (let run = 1; run <= maxRuns; run++) {
    risks.forEach(calculateIndirectProbabilities);
    risks.forEach(calculateTotalProbabilities);

    let totalProbability = 0;
    for (let j = 0; j < risks.length; j++) {
      totalProbability += risks[j].tp;

      if (isNaN(totalProbability)) {
        console.error("Error in calculations, probability was NaN: ", risks[j]);
        console.error("Run: ", run);
        throw new Error("Error in calculations, probability was NaN");
      }
    }

    const deltaTotalProbability = Math.abs(totalProbability - lastTotalProbability) / totalProbability;

    if (deltaTotalProbability < maxDelta) {
      log(`\tRun ${run}: Convergence reached (Delta: ${Math.round(10000 * deltaTotalProbability) / 100}%)...`);

      return;
    } else {
      log(`\tRun ${run}: Convergence not yet reached (Delta: ${Math.round(10000 * deltaTotalProbability) / 100}%)...`);
      lastTotalProbability = totalProbability;
    }
  }

  log("No convergence reached :(");
}
