import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function calculateIndirectProbabilities(risk: RiskCalculation) {
  risk.causes.forEach((cascade) => {
    cascade.ip_c = Math.min(
      1,
      cascade.c2c * (cascade.cause.tp_c || 0) +
        cascade.m2c * (cascade.cause.tp_m || 0) +
        cascade.e2c * (cascade.cause.tp_e || 0)
    );
    cascade.ip_m = Math.min(
      1,
      cascade.c2m * (cascade.cause.tp_c || 0) +
        cascade.m2m * (cascade.cause.tp_m || 0) +
        cascade.e2m * (cascade.cause.tp_e || 0)
    );
    cascade.ip_e = Math.min(
      1,
      cascade.c2e * (cascade.cause.tp_c || 0) +
        cascade.m2e * (cascade.cause.tp_m || 0) +
        cascade.e2e * (cascade.cause.tp_e || 0)
    );

    cascade.ip = cascade.ip_c + cascade.ip_m + cascade.ip_e;

    if (isNaN(cascade.ip_c) || isNaN(cascade.ip_m) || isNaN(cascade.ip_e) || isNaN(cascade.ip)) {
      console.error("Error in calculations, probability was NaN: ", risk, cascade);
      throw new Error("Error in calculations, probability was NaN");
    }

    // if (cause.ip > 1) {
    //   console.error("Error in calculations, probability was >1: ", risk, cause);
    //   throw new Error("Error in calculations, probability was >1");
    // }
  });

  risk.ip_c = risk.causes.reduce((acc, effect) => acc + effect.ip_c, 0);
  risk.ip_m = risk.causes.reduce((acc, effect) => acc + effect.ip_m, 0);
  risk.ip_e = risk.causes.reduce((acc, effect) => acc + effect.ip_e, 0);

  risk.ip = risk.ip_c + risk.ip_m + risk.ip_e;

  if (isNaN(risk.ip_c) || isNaN(risk.ip_m) || isNaN(risk.ip_e) || isNaN(risk.ip)) {
    console.error("Error in calculations, probability was NaN: ", risk);
    throw new Error("Error in calculations, probability was NaN");
  }

  // if (risk.ip > 1) {
  //   console.error(
  //     "Error in calculations, probability was >1: ",
  //     risk,
  //     [...risk.causes].sort((a, b) => b.ip_e - a.ip_e)
  //   );
  //   throw new Error("Error in calculations, probability was >1");
  // }
}
