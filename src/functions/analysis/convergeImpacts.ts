import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import calculateIndirectImpacts from "./calculateIndirectImpacts";
import calculateTotalImpacts from "./calculateTotalImpacts";

export default function convergeImpacts({
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
  log("Converging impacts...");

  let lastTotalImpact = 0;

  for (let run = 1; run <= maxRuns; run++) {
    risks.forEach((r) => calculateIndirectImpacts(r, damping));
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
    ordered.sort(
      // (a, b) => b.ti - a.ti
      (a, b) =>
        b.ti_c * b.tp_c - a.ti_c * a.tp_c + b.ti_m * b.tp_m - a.ti_m * a.tp_m + b.ti_e * b.tp_e - a.ti_e * a.tp_e
    );

    console.log(ordered);

    for (let risk of ordered) {
      console.log(
        `${risk.riskTitle}: ${risk.tp} - ${risk.ti} - ${
          risk.ti_c * risk.tp_c + risk.ti_m * risk.tp_m + risk.ti_e * risk.tp_e
        }`
      );

      const orderedEffects = [...risk.effects];
      orderedEffects.sort((a, b) => b.ii - a.ii);

      for (let i = 0; i < Math.min(orderedEffects.length, 5); i++) {
        console.log(`     ${orderedEffects[i].effect.riskTitle}: ${orderedEffects[i].ii}`);
      }
    }

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
