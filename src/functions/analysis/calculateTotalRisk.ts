import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

const DAMAGE_INDICATORS = ["Ha", "Hb", "Hc", "Sa", "Sb", "Sc", "Sd", "Ea", "Fa", "Fb"];

const getWorstCaseScenario = (r: RiskCalculation) => {
  if (r.tr_c > r.tr_m && r.tr_c > r.tr_e) return "_c";
  if (r.tr_m > r.tr_c && r.tr_m > r.tr_e) return "_m";
  return "_e";
};

export default function calculateTotalRisk(r: RiskCalculation) {
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

  const wcsSuffix = getWorstCaseScenario(r);

  r.dp = r[`dp${wcsSuffix}`];
  r.tp = r[`tp${wcsSuffix}`];

  r.causes.forEach((c) => {
    c.ip = c[`ip${wcsSuffix}`];
  });

  r.di = r[`di${wcsSuffix}`];
  r.ti = r[`ti${wcsSuffix}`];

  DAMAGE_INDICATORS.forEach((d) => {
    //@ts-expect-error
    r[`ti_${d}`] = r[`ti_${d}${wcsSuffix}`];
  });

  r.effects.forEach((c) => {
    c.ii = c[`ii${wcsSuffix}`];
  });
}
