import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function calculateTotalProbabilities(risk: RiskCalculation) {
  risk.dp = risk.dp_c + risk.dp_m + risk.dp_e;

  risk.tp_c = risk.dp_c + risk.ip_c;
  risk.tp_m = risk.dp_m + risk.ip_m;
  risk.tp_e = risk.dp_e + risk.ip_e;

  risk.tp = risk.tp_c + risk.tp_m + risk.tp_e;

  risk.tp50_c = risk.dp50_c + risk.ip50_c;
  risk.tp50_m = risk.dp50_m + risk.ip50_m;
  risk.tp50_e = risk.dp50_e + risk.ip50_e;

  risk.tp50 = risk.tp50_c + risk.tp50_m + risk.tp50_e;

  // Relative probabilities
  risk.rp_c = risk.tp_c / (risk.tp || 1);
  risk.rp_m = risk.tp_m / (risk.tp || 1);
  risk.rp_e = risk.tp_e / (risk.tp || 1);
}
