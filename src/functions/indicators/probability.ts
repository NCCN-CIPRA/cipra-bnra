/**
 * Probability scales are based around the concept of the return period,
 * as this is the most intuitive statistical property for experts with
 * topical risk knowledge but little statistical knowledge.
 *
 * All risks are assumed to be Poisson distributed. The following parameters
 * are thus deducible from the estimated scale:
 *
 * pScale5 - An estimation given by the experts, given in the form of DP1 - DP5.5
 * pScale7 - An estimation given by the experts using the new scales, given in the form of DP1 - DP7.5
 *
 * rpMonths - The return period in months. This parameter is directly calculable from the DP scales using
 *            an exponential growth formula (return period grows exponentially as a function of DP scale)
 *              rpMonths = 12 * 3 * 10^(4.5 - pScale5)
 *              rpMonths = 12 * e^(12 - 2.3 * pScale7)
 *
 * pMonthly - The probability of exceedence of a single event in any given month, i.e. the probability
 *            that at least one event will take place in any given month.
 *            To calculate this, we assume the poisson distribution:
 *              pMonthly = 1 - e^(1 / rpMonths)
 *
 * pDaily -   The probability of exceedence of a single event on any given day, i.e. the probability
 *            that at least one event will take place on any given day.
 *            We assume an average of 30.437 days per month and again use the poisson distribution
 *              pDaily = 1 - e^((1 / 30.437) / rpMonths)
 *
 *            The inverse formula is given by:
 *              rpMonths = - (1 / 30.437) / ln(1 - pDaily)
 *
 *
 * Source: https://en.wikipedia.org/wiki/Return_period
 */

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
  return returnPeriodMonthsFromPTimeframe(pDaily, 1 / 30.437);
}

export function returnPeriodMonthsFromPTimeframe(
  pTimeframe: number,
  timeframeMonths: number
) {
  return -timeframeMonths / Math.log(1 - pTimeframe);
}

export function pDailyFromReturnPeriodMonths(rpMonths: number) {
  return pTimeframeFromReturnPeriodMonths(rpMonths, 1 / 30.437);
}

export function pTimeframeFromReturnPeriodMonths(
  rpMonths: number,
  timeframeMonths: number
) {
  return 1 - Math.exp(-timeframeMonths / rpMonths);
}

export function pScale5FromReturnPeriodMonths(rpMonths: number, round = 10) {
  return Math.round(round * (4.5 - Math.log10(rpMonths / (12 * 3)))) / round;
}

export function pScale7FromReturnPeriodMonths(rpMonths: number, round = 10) {
  return Math.round((round * (12 - Math.log(rpMonths / 12))) / 2.3) / round;
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
