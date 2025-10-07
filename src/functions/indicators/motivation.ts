/**
 * The motivation scale are described in term of the probability of a specific
 * attack scenario to be succesfully executed by an actor group in the following
 * 3 years.
 *
 * All events are assumed to be Poisson distributed.
 */
import round from "../roundNumberString";
import {
  pDailyFromReturnPeriodMonths,
  pTimeframeFromReturnPeriodMonths,
  returnPeriodMonthsFromPDaily,
  returnPeriodMonthsFromPTimeframe,
} from "./probability";

export const motivationLowerBoundScale3 = [0, 1 / 100, 50 / 100, 90 / 100];

export const motivationUpperBoundScale3 = [
  1 / 100,
  50 / 100,
  90 / 100,
  100 / 100,
];
export const motivationLowerBoundScale7 = [
  0,
  0.01 / 100,
  10 / 100,
  25 / 100,
  40 / 100,
  55 / 100,
  75 / 100,
  90 / 100,
];
export const motivationUpperBoundScale7 = [
  0.01 / 100,
  10 / 100,
  25 / 100,
  40 / 100,
  55 / 100,
  75 / 100,
  90 / 100,
  100 / 100,
];

export function pDailyFromP3years(p3Years: number) {
  const rpMonths = returnPeriodMonthsFromPTimeframe(p3Years, 3 * 12);
  return pDailyFromReturnPeriodMonths(rpMonths);
}

export function p3YearsFromMScale3(mScale3: number) {
  const index = Math.floor(mScale3 + 0.5);

  if (index < 0.5) return (mScale3 / 0.5) * motivationUpperBoundScale3[0];
  if (index >= 3.5) return 1;

  const lower = motivationLowerBoundScale3[index];
  const upper = motivationUpperBoundScale3[index];

  const diff = upper - lower;

  return lower + diff * ((mScale3 + 0.5) % 1);
}

export function pDailyFromMScale3(mScale3: number) {
  const p3Years = p3YearsFromMScale3(mScale3);

  const rpMonths = returnPeriodMonthsFromPTimeframe(p3Years, 3 * 12);
  return pDailyFromReturnPeriodMonths(rpMonths);
}

export function p3YearsFromMScale7(mScale7: number) {
  const index = Math.floor(mScale7 + 0.5);

  if (index < 0.5) return (mScale7 / 0.5) * motivationUpperBoundScale7[0];
  if (index >= 7.5) return 1;

  const lower = motivationLowerBoundScale7[index];
  const upper = motivationUpperBoundScale7[index];

  const diff = upper - lower;

  return lower + diff * ((mScale7 + 0.5) % 1);
}

export function pDailyFromMScale7(mScale7: number) {
  const p3Years = p3YearsFromMScale7(mScale7);

  const rpMonths = returnPeriodMonthsFromPTimeframe(p3Years, 3 * 12);
  return pDailyFromReturnPeriodMonths(rpMonths);
}

export function mScale3FromPDaily(pDaily: number) {
  const rpMonths = returnPeriodMonthsFromPDaily(pDaily);
  const p3Years = pTimeframeFromReturnPeriodMonths(rpMonths, 3 * 12);

  // Handle edge cases
  if (p3Years < motivationUpperBoundScale3[0])
    return 0.5 * (p3Years / motivationUpperBoundScale3[0]);
  if (p3Years >= 1) return motivationLowerBoundScale3.length - 0.5;

  // Find which interval the p3Years value falls into
  for (let i = 0; i < motivationLowerBoundScale3.length; i++) {
    const lower = motivationLowerBoundScale3[i];
    const upper = motivationUpperBoundScale3[i];

    if (p3Years >= lower && p3Years <= upper) {
      // Interpolate within the interval
      const fraction = (p3Years - lower) / (upper - lower);
      // Convert back from the +0.5 offset used in pDailyFromMScale3
      return i + (fraction - 0.5);
    }
  }

  // If not found in any interval, return the last scale value
  return motivationLowerBoundScale3.length - 0.5;
}

export function mScale7FromPDaily(pDaily: number) {
  const rpMonths = returnPeriodMonthsFromPDaily(pDaily);
  const p3Years = pTimeframeFromReturnPeriodMonths(rpMonths, 3 * 12);

  // Handle edge cases
  if (p3Years < motivationUpperBoundScale7[0])
    return 0.5 * (p3Years / motivationUpperBoundScale7[0]);
  if (p3Years >= 1) return motivationLowerBoundScale7.length - 0.5;

  // Find which interval the pAbs value falls into
  for (let i = 0; i < motivationLowerBoundScale7.length; i++) {
    const lower = motivationLowerBoundScale7[i];
    const upper = motivationUpperBoundScale7[i];

    if (p3Years >= lower && p3Years <= upper) {
      // Interpolate within the interval
      const fraction = (p3Years - lower) / (upper - lower);
      // Convert back from the +0.5 offset used in pDailyFromMScale7
      return i - 0.5 + fraction;
    }
  }

  // If not found in any interval, return the last scale value
  return motivationLowerBoundScale7.length - 0.5;
}

export function mScale3to7(pScale5: number) {
  return mScale7FromPDaily(pDailyFromMScale3(pScale5));
}

export function mScale7to3(pScale5: number) {
  return mScale3FromPDaily(pDailyFromMScale7(pScale5));
}

export function getIntervalStringMScale3(mScale3: number) {
  if (mScale3 < 0.5)
    return `< ${round(2 * mScale3 * pDailyFromMScale3(0.5), 2)}%`;

  return `${round(100 * pDailyFromMScale3(mScale3 - 0.5), 1)}% - ${round(
    100 * pDailyFromMScale3(mScale3 + 0.5),
    2
  )}%`;
}

export function getIntervalStringMScale7(mScale7: number) {
  if (mScale7 <= 0) return "0%";
  if (mScale7 < 0.5)
    return `< ${round(2 * mScale7 * pDailyFromMScale7(0.5), 2)}%`;

  return `${round(100 * pDailyFromMScale7(mScale7 - 0.5), 1)}% - ${round(
    100 * pDailyFromMScale7(mScale7 + 0.5),
    2
  )}%`;
}
