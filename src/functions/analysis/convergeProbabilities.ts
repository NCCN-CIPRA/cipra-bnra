import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import calculateIndirectProbabilities from "./calculateIndirectProbabilities";
import calculateTotalProbabilities from "./calculateTotalProbabilities";

export default async function convergeProbabilities({
  risks,
  log,
  damping = 1,
  maxRuns = 10,
  maxDelta = 0.001,
}: {
  risks: RiskCalculation[];
  log: (line: string) => void;
  damping: number;
  maxRuns: number;
  maxDelta?: number;
}) {
  log("Converging probabilities...");

  let lastTotalProbability = 0;
  const lastProbabilities: { [key: string]: number }[] = [];

  for (let run = 1; run <= maxRuns; run++) {
    risks.forEach((r) => calculateIndirectProbabilities(r, damping));
    risks.forEach(calculateTotalProbabilities);

    let totalProbability = 0;
    lastProbabilities.unshift({});
    for (let j = 0; j < risks.length; j++) {
      totalProbability += risks[j].tp;
      lastProbabilities[0][risks[j].riskId] = risks[j].tp;

      if (isNaN(totalProbability)) {
        console.error("Error in calculations, probability was NaN: ", risks[j]);
        console.error("Run: ", run);
        throw new Error("Error in calculations, probability was NaN");
      }
    }

    console.log(`====================== Run ${run} ======================`);

    const ordered = [...risks];
    ordered.sort((a, b) => b.tp - a.tp);

    console.log(ordered);

    // for (let risk of ordered) {
    //   console.log(`${risk.riskTitle}: ${risk.tp}`);

    //   const orderedCauses = [...risk.causes];
    //   orderedCauses.sort((a, b) => b.ip - a.ip);

    //   for (let i = 0; i < Math.min(orderedCauses.length, 5); i++) {
    //     console.log(`     ${orderedCauses[i].cause.riskTitle}: ${orderedCauses[i].ip}`);
    //   }
    // }

    console.log("\n\n\n");
    const deltaTotalProbability = Math.abs(totalProbability - lastTotalProbability) / totalProbability;

    if (deltaTotalProbability < maxDelta) {
      log(`\tRun ${run}: Convergence reached (Delta: ${Math.round(10000 * deltaTotalProbability) / 100}%)...`);

      return;
    } else {
      log(`\tRun ${run}: Convergence not yet reached (Delta: ${Math.round(10000 * deltaTotalProbability) / 100}%)...`);
      lastTotalProbability = totalProbability;
    }

    // if (run > 2) {
    //   log("====== Blowouts =======");

    //   for (let risk of risks) {
    //     if (
    //       lastProbabilities[0][risk.riskId] - lastProbabilities[1][risk.riskId] >
    //       lastProbabilities[1][risk.riskId] - lastProbabilities[2][risk.riskId]
    //     ) {
    //       log(
    //         `${risk.riskTitle}: ${lastProbabilities[0][risk.riskId] - lastProbabilities[1][risk.riskId]} = ${
    //           lastProbabilities[1][risk.riskId] - lastProbabilities[2][risk.riskId]
    //         }`
    //       );
    //     }
    //   }
    // }
  }

  log("No convergence reached :(");
}
