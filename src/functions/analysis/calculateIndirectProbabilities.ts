import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function calculateIndirectProbabilities(risk: RiskCalculation) {
  risk.causes.forEach((cause) => {
    cause.ip_c =
      cause.c2c * (cause.risk.tp_c || 0) + cause.m2c * (cause.risk.tp_m || 0) + cause.e2c * (cause.risk.tp_e || 0);
    cause.ip_m =
      cause.c2m * (cause.risk.tp_c || 0) + cause.m2m * (cause.risk.tp_m || 0) + cause.e2m * (cause.risk.tp_e || 0);
    cause.ip_e =
      cause.c2e * (cause.risk.tp_c || 0) + cause.m2e * (cause.risk.tp_m || 0) + cause.e2e * (cause.risk.tp_e || 0);

    cause.ip = cause.ip_c + cause.ip_m + cause.ip_e;
  });

  risk.ip_c = risk.causes.reduce((acc, effect) => acc + effect.ip_c, 0);
  risk.ip_m = risk.causes.reduce((acc, effect) => acc + effect.ip_m, 0);
  risk.ip_e = risk.causes.reduce((acc, effect) => acc + effect.ip_e, 0);

  risk.ip = risk.ip_c + risk.ip_m + risk.ip_e;
}
