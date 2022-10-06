import { RiskCalculation } from "../../types/RiskCalculation";

export default function calculateTotalProbabilities(risk: RiskCalculation) {
  risk.dp = risk.dp_c + risk.dp_m + risk.dp_e;

  risk.tp_c = risk.dp_c + risk.ip_c;
  risk.tp_m = risk.dp_m + risk.ip_m;
  risk.tp_e = risk.dp_e + risk.ip_e;

  risk.tp = risk.tp_c + risk.tp_m + risk.tp_e;

  // Relative probabilities
  risk.rp_c = risk.tp_c / (risk.tp || 1);
  risk.rp_m = risk.tp_m / (risk.tp || 1);
  risk.rp_e = risk.tp_e / (risk.tp || 1);
}
