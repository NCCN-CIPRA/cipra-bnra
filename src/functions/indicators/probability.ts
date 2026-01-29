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

import round, { roundMax } from "../roundNumberString";

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
  return Math.abs(-timeframeMonths / Math.log(1 - pTimeframe));
}

export function returnPeriodMonthsFromYearlyEventRate(
  averageYearlyEvents: number
) {
  const returnPeriodYears = 1 / averageYearlyEvents;

  const returnPeriodMonths = 12 * returnPeriodYears;

  return returnPeriodMonths;
}

export function pDailyFromReturnPeriodMonths(rpMonths: number | null) {
  return pTimeframeFromReturnPeriodMonths(rpMonths, 1 / 30.437);
}

export function pTimeframeFromReturnPeriodMonths(
  rpMonths: number | null,
  timeframeMonths: number
) {
  if (rpMonths === null) return 0;

  return 1 - Math.exp(-timeframeMonths / rpMonths);
}

export function pScale5FromReturnPeriodMonths(
  rpMonths: number | null,
  round = 10
) {
  if (rpMonths === null) return 0;

  return Math.max(
    0,
    Math.round(round * (4.5 - Math.log10(rpMonths / (12 * 3)))) / round
  );
}

export function pScale7FromReturnPeriodMonths(
  rpMonths: number | null,
  round = 10
) {
  if (rpMonths === null) return 0;

  return Math.max(
    0,
    Math.round((round * (12 - Math.log(rpMonths / 12))) / 2.3) / round
  );
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

export function getReturnPeriodYearsIntervalStringDPScale5(pScale5: number) {
  if (pScale5 <= 0) return null;

  if (pScale5 < 0.5)
    return `> ${round(
      (20 * (0.5 - pScale5) * returnPeriodMonthsFromPScale5(0.5)) / 12,
      2,
      ",",
      " "
    )}`;

  return `${round(
    returnPeriodMonthsFromPScale5(pScale5 - 0.5) / 12,
    2,
    ",",
    " "
  )} - ${round(
    returnPeriodMonthsFromPScale5(pScale5 + 0.5) / 12,
    2,
    ",",
    " "
  )}`;
}

export function getReturnPeriodYearsIntervalStringPScale7(pScale7: number) {
  if (pScale7 <= 0) return null;

  if (pScale7 <= 1)
    return `> ${roundMax(
      returnPeriodMonthsFromPScale7(pScale7 + 0.5) / 12
    )} years`;

  const rpMax = returnPeriodMonthsFromPScale7(pScale7 - 0.5);
  const rpMin = returnPeriodMonthsFromPScale7(pScale7 + 0.5);

  if (rpMin < 12 || rpMax < 12) {
    return `around ${round(roundMax(rpMin), 0, ",", " ")} - ${round(
      roundMax(rpMax),
      0,
      ",",
      " "
    )} months`;
  }

  return `around ${round(roundMax(rpMin / 12), 2, ",", " ")} - ${round(
    roundMax(rpMax / 12),
    2,
    ",",
    " "
  )} years`;
}
