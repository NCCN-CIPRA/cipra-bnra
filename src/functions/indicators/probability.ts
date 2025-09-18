export function returnPeriodMonthsFromPScale5(pScale5: number) {
  return 12 * 3 * Math.pow(10, 4.5 - pScale5);
}

// The old TP scale was rescaled to allow for larger probabilities
export function returnPeriodMonthsFromTPScale5(tpScale5: number) {
  const yearlyP = Math.pow(Math.E, (tpScale5 - 5) * Math.log(2.5)) - 0.0103;
  return (1 / yearlyP) * 12;
}

export function returnPeriodMonthsFromPScale7(pScale7: number) {
  return 12 * Math.exp(12 - 2.3 * pScale7);
}

export function returnPeriodMonthsFromPDaily(pDaily: number) {
  return 1 / Math.pow(pDaily, 30.437);
}

export function pScale5FromReturnPeriodMonths(rpMonths: number) {
  return 4.5 - Math.log10(rpMonths / (12 * 3));
}

export function pScale7FromReturnPeriodMonths(rpMonths: number) {
  return (12 - Math.log(rpMonths / 12)) / 2.3;
}

export function pScale5to7(pScale5: number) {
  return pScale7FromReturnPeriodMonths(returnPeriodMonthsFromPScale5(pScale5));
}

export function tpScale5to7(tpScale5: number) {
  return pScale7FromReturnPeriodMonths(
    returnPeriodMonthsFromTPScale5(tpScale5)
  );
}

export function pScale7to5(pScale5: number) {
  return pScale5FromReturnPeriodMonths(returnPeriodMonthsFromPScale7(pScale5));
}
