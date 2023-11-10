import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import calculateIndirectImpacts from "./calculateIndirectImpacts";
import calculateTotalImpacts from "./calculateTotalImpacts";

export default function convergeImpacts(
  risks: RiskCalculation[],
  log: (line: string) => void,
  maxRuns: number = 10,
  maxDelta: number = 0.001
) {
  log("Converging impacts...");

  let lastTotalImpact = 0;

  for (let run = 1; run <= maxRuns; run++) {
    risks.forEach(calculateIndirectImpacts);
    risks.forEach(calculateTotalImpacts);

    let totalImpact = 0;
    for (let j = 0; j < risks.length; j++) {
      totalImpact += risks[j].ti;

      if (isNaN(totalImpact)) {
        console.error("Error in calculations, impact was NaN: ", risks[j]);
        throw new Error("Error in calculations, impact was NaN");
      }
    }

    console.log(`====================== Run ${run} ======================`);

    const ordered = [...risks];
    ordered.sort((a, b) => b.tp - a.ti);

    console.log(ordered);

    // for (let risk of ordered) {
    //   console.log(`${risk.riskTitle}: ${risk.ti}`);

    //   const orderedCauses = [...risk.causes];
    //   orderedCauses.sort((a, b) => b.ii - a.ii);

    //   for (let i = 0; i < Math.min(orderedCauses.length, 5); i++) {
    //     console.log(`     ${orderedCauses[i].cause.riskTitle}: ${orderedCauses[i].ii}`);
    //   }
    // }

    console.log("\n\n\n");
    const deltaTotalImpact = Math.abs(totalImpact - lastTotalImpact) / totalImpact;

    if (deltaTotalImpact < maxDelta) {
      log(`\tRun ${run}: Convergence reached (Delta: ${Math.round(10000 * deltaTotalImpact) / 100}%)...`);

      return;
    } else {
      log(`\tRun ${run}: Convergence not yet reached (Delta: ${Math.round(10000 * deltaTotalImpact) / 100}%)...`);
      lastTotalImpact = totalImpact;
    }
  }

  log("No convergence reached :(");
}
