import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function calculateIndirectProbabilities(risk: RiskCalculation, dampingFactor: number = 1) {
  risk.causes.forEach((cascade) => {
    const damping = cascade.damp ? dampingFactor : 1;

    cascade.ip_c = Math.min(
      100000000,
      cascade.c2c * (cascade.cause.tp_c || 0) * damping +
        cascade.m2c * (cascade.cause.tp_m || 0) * damping +
        cascade.e2c * (cascade.cause.tp_e || 0) * damping
    );
    cascade.ip_m = Math.min(
      100000000,
      cascade.c2m * (cascade.cause.tp_c || 0) * damping +
        cascade.m2m * (cascade.cause.tp_m || 0) * damping +
        cascade.e2m * (cascade.cause.tp_e || 0) * damping
    );
    cascade.ip_e = Math.min(
      100000000,
      cascade.c2e * (cascade.cause.tp_c || 0) * damping +
        cascade.m2e * (cascade.cause.tp_m || 0) * damping +
        cascade.e2e * (cascade.cause.tp_e || 0) * damping
    );

    cascade.ip = cascade.ip_c + cascade.ip_m + cascade.ip_e;

    if (isNaN(cascade.ip_c) || isNaN(cascade.ip_m) || isNaN(cascade.ip_e) || isNaN(cascade.ip)) {
      console.error("Error in calculations, probability was NaN: ", risk, cascade);
      throw new Error("Error in calculations, probability was NaN");
    }

    cascade.ip50_c = Math.min(
      100000000,
      cascade.c2c * (cascade.cause.tp50_c || 0) * damping +
        cascade.m2c * (cascade.cause.tp50_m || 0) * damping +
        cascade.e2c * (cascade.cause.tp50_e || 0) * damping
    );
    cascade.ip50_m = Math.min(
      100000000,
      cascade.c2m * (cascade.cause.tp50_c || 0) * damping +
        cascade.m2m * (cascade.cause.tp50_m || 0) * damping +
        cascade.e2m * (cascade.cause.tp50_e || 0) * damping
    );
    cascade.ip50_e = Math.min(
      100000000,
      cascade.c2e * (cascade.cause.tp50_c || 0) * damping +
        cascade.m2e * (cascade.cause.tp50_m || 0) * damping +
        cascade.e2e * (cascade.cause.tp50_e || 0) * damping
    );

    cascade.ip50 = cascade.ip50_c + cascade.ip50_m + cascade.ip50_e;

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

  risk.ip50_c = risk.causes.reduce((acc, effect) => acc + effect.ip50_c, 0);
  risk.ip50_m = risk.causes.reduce((acc, effect) => acc + effect.ip50_m, 0);
  risk.ip50_e = risk.causes.reduce((acc, effect) => acc + effect.ip50_e, 0);

  risk.ip50 = risk.ip50_c + risk.ip50_m + risk.ip50_e;

  // if (risk.ip > 1) {
  //   console.error(
  //     "Error in calculations, probability was >1: ",
  //     risk,
  //     [...risk.causes].sort((a, b) => b.ip_e - a.ip_e)
  //   );
  //   throw new Error("Error in calculations, probability was >1");
  // }
}
