import { RiskCalculation } from "../../types/RiskCalculation";
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
        throw new Error("Error in calculations, probability was NaN");
      }
    }

    const deltaTotalProbability = Math.abs(totalProbability - lastTotalProbability);

    if (deltaTotalProbability < maxDelta) {
      log(
        `Run ${run}: Convergence reached (Total Probability: ${Math.round(1000 * totalProbability) / 1000}, Delta: ${
          Math.round(1000 * deltaTotalProbability) / 1000
        })...`
      );

      return;
    } else {
      log(
        `Run ${run}: Convergence not yet reached (Total Probability: ${
          Math.round(1000 * totalProbability) / 1000
        }, Delta: ${Math.round(1000 * deltaTotalProbability) / 1000})...`
      );
      lastTotalProbability = totalProbability;
    }
  }

  log("No convergence reached :(");
}
