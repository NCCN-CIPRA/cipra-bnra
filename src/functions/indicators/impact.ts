/**
 *
 * @param iScale7 The number on the 0-7 point scale
 * @param aggregation The amount of damage indicators that are aggregated in the scale
 *
 */
export function eurosFromIScale7(iScale7: number, aggregation: number = 1) {
  if (iScale7 <= 0.5) {
    // Linear from 0 to 0.5
    return (iScale7 / 0.5) * 500000;
  }

  return aggregation * Math.exp(1.92 * (iScale7 - 0.5) + 13.2);
}

export function iScale7FromEuros(
  euros: number,
  aggregation: number = 1,
  round = 10
) {
  if (euros <= 500000) {
    return Math.round(round * (euros / 500000) * 0.5) / round;
  }

  return (
    Math.round(round * ((Math.log(euros / aggregation) - 13.2) / 1.92 + 0.5)) /
    round
  );
}

const BASE_TI_SCALE_5_IMPACT = 8 * 10 ** 8;

export function tiScale5FromEuros(euros: number, round = 10) {
  if (euros < BASE_TI_SCALE_5_IMPACT) return euros / BASE_TI_SCALE_5_IMPACT;

  return (
    Math.round(
      round * (1 + Math.log10(euros / BASE_TI_SCALE_5_IMPACT) / Math.log10(5))
    ) / round
  );
}

export function eurosFromTIScale5(tiScale5: number) {
  if (tiScale5 <= 1) return tiScale5 * BASE_TI_SCALE_5_IMPACT;

  return BASE_TI_SCALE_5_IMPACT * Math.pow(5, tiScale5 - 1);
}

export function tiScale5to7(tiScale5: number, round = 10) {
  return iScale7FromEuros(eurosFromTIScale5(tiScale5), 10, round);
}

export function tiScale7to5(iScale7: number, round = 10) {
  return tiScale5FromEuros(eurosFromIScale7(iScale7, 10), round);
}

const BASE_DI_SCALE_5_IMPACT = 5000000;

export function eurosFromDIScale5(diScale5: number) {
  if (diScale5 <= 0.5) return (diScale5 / 0.5) * BASE_DI_SCALE_5_IMPACT;

  return 1600000 * Math.pow(10, diScale5);
}

export function diScale5FromEuros(euros: number, round = 2) {
  if (euros <= BASE_DI_SCALE_5_IMPACT)
    return Math.round(round * (euros / BASE_DI_SCALE_5_IMPACT) * 0.5) / round;

  return Math.round(round * Math.log10(euros / 1600000)) / round;
}

export function diScale5to7(diScale5: number, round = 10) {
  return iScale7FromEuros(eurosFromDIScale5(diScale5), 1, round);
}

export function diScale7to5(iScale7: number, round = 10) {
  return diScale5FromEuros(eurosFromIScale7(iScale7), round);
}

export function categoryImpactScale5to7(iScale5: number) {
  return (iScale5 / 5) * 7;
}

export function categoryImpactScale7to5(iScale7: number) {
  return (iScale7 / 7) * 5;
}
