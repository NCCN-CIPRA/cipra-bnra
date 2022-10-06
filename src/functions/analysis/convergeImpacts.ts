import { RiskCalculation } from "../../types/RiskCalculation";
import calculateIndirectImpacts from "./calculateIndirectImpacts";
import calculateTotalImpacts from "./calculateTotalImpacts";

export default function convergeImpacts(
  risks: RiskCalculation[],
  log: (line: string) => void,
  maxRuns: number = 10,
  maxDelta: number = 1
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
    const deltaTotalImpact = Math.abs(totalImpact - lastTotalImpact);

    if (deltaTotalImpact < maxDelta) {
      log(
        `Run ${run}: Convergence reached (Total impact: ${Math.round(totalImpact)}, Delta: ${Math.round(
          deltaTotalImpact
        )})...`
      );

      return;
    } else {
      log(
        `Run ${run}: Convergence not yet reached (Total Probability: ${Math.round(totalImpact)}, Delta: ${Math.round(
          deltaTotalImpact
        )})...`
      );
      lastTotalImpact = totalImpact;
    }
  }

  log("No convergence reached :(");
}
