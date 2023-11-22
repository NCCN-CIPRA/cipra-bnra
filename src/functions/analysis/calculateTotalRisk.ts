import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function CalculateTotalRisk(r: RiskCalculation) {
  r.tr_c = r.tp_c * r.ti_c;
  r.tr_m = r.tp_m * r.ti_m;
  r.tr_e = r.tp_e * r.ti_e;

  r.tr = (r.tr_c + r.tr_m + r.tr_e) / 3;

  r.causes.forEach((c) => {
    c.ir_c = r.tp_c === 0 ? 0 : (r.tr_c * c.ip_c) / r.tp_c;
    c.ir_m = r.tp_m === 0 ? 0 : (r.tr_m * c.ip_m) / r.tp_m;
    c.ir_e = r.tp_e === 0 ? 0 : (r.tr_e * c.ip_e) / r.tp_e;

    c.ir = (c.ir_c + c.ir_m + c.ir_e) / 3;
  });

  r.effects.forEach((c) => {
    c.ir_c = r.ti_c === 0 ? 0 : r.tr_c * (c.ii_c / r.ti_c);
    c.ir_m = r.ti_m === 0 ? 0 : r.tr_m * (c.ii_m / r.ti_m);
    c.ir_e = r.ti_e === 0 ? 0 : r.tr_e * (c.ii_e / r.ti_e);

    c.ir = (c.ir_c + c.ir_m + c.ir_e) / 3;
  });
}
