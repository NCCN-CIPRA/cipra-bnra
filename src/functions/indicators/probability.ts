export function returnPeriodMonthsFromPScale5(pScale5: number) {
  return 12 * 3 * Math.pow(10, 4 - pScale5);
}

export function returnPeriodMonthsFromPScale7(pScale7: number) {
  return Math.exp(12 - 2.3 * pScale7);
}

export function pScale5FromReturnPeriodMonths(rpMonths: number) {
  return 4 - Math.log10(rpMonths / (12 * 3));
}

export function pScale7FromReturnPeriodMonths(rpMonths: number) {
  return (12 - Math.log(rpMonths)) / 2.3;
}

export function PScale5to7(pScale5: number) {
  return pScale7FromReturnPeriodMonths(returnPeriodMonthsFromPScale5(pScale5));
}

export function PScale7to5(pScale5: number) {
  return pScale5FromReturnPeriodMonths(returnPeriodMonthsFromPScale7(pScale5));
}
