import round from "../roundNumberString";

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

export function pAbsFromMScale3(mScale3: number) {
  const index = Math.floor(mScale3 + 0.5);

  if (index < 0.5) return (mScale3 / 0.5) * motivationUpperBoundScale3[0];
  if (index >= 3.5) return 1;

  const lower = motivationLowerBoundScale3[index];
  const upper = motivationUpperBoundScale3[index];

  const diff = upper - lower;

  return lower + diff * ((mScale3 + 0.5) % 1);
}

export function pAbsFromMScale7(mScale7: number) {
  const index = Math.floor(mScale7 + 0.5);

  if (index < 0.5) return (mScale7 / 0.5) * motivationUpperBoundScale7[0];
  if (index >= 7.5) return 1;

  const lower = motivationLowerBoundScale7[index];
  const upper = motivationUpperBoundScale7[index];

  const diff = upper - lower;

  return lower + diff * ((mScale7 + 0.5) % 1);
}

export function mScale3FromPAbs(pAbs: number) {
  // Handle edge cases
  if (pAbs < motivationUpperBoundScale3[0])
    return 0.5 * (pAbs / motivationUpperBoundScale3[0]);
  if (pAbs >= 1) return motivationLowerBoundScale3.length - 0.5;

  // Find which interval the pAbs value falls into
  for (let i = 0; i < motivationLowerBoundScale3.length; i++) {
    const lower = motivationLowerBoundScale3[i];
    const upper = motivationUpperBoundScale3[i];

    if (pAbs >= lower && pAbs <= upper) {
      // Interpolate within the interval
      const fraction = (pAbs - lower) / (upper - lower);
      // Convert back from the +0.5 offset used in pAbsFromMScale3
      return i + (fraction - 0.5);
    }
  }

  // If not found in any interval, return the last scale value
  return motivationLowerBoundScale3.length - 0.5;
}

export function mScale7FromPAbs(pAbs: number) {
  // Handle edge cases
  if (pAbs < motivationUpperBoundScale7[0])
    return 0.5 * (pAbs / motivationUpperBoundScale7[0]);
  if (pAbs >= 1) return motivationLowerBoundScale7.length - 0.5;

  // Find which interval the pAbs value falls into
  for (let i = 0; i < motivationLowerBoundScale7.length; i++) {
    const lower = motivationLowerBoundScale7[i];
    const upper = motivationUpperBoundScale7[i];

    if (pAbs >= lower && pAbs <= upper) {
      // Interpolate within the interval
      const fraction = (pAbs - lower) / (upper - lower);
      // Convert back from the +0.5 offset used in pAbsFromMScale7
      return i - 0.5 + fraction;
    }
  }

  // If not found in any interval, return the last scale value
  return motivationLowerBoundScale7.length - 0.5;
}

export function mScale3to7(pScale5: number) {
  return mScale7FromPAbs(pAbsFromMScale3(pScale5));
}

export function mScale7to3(pScale5: number) {
  return mScale3FromPAbs(pAbsFromMScale7(pScale5));
}

export function getIntervalStringMScale3(mScale3: number) {
  if (mScale3 < 0.5)
    return `< ${round(2 * mScale3 * pAbsFromMScale3(0.5), 2)}%`;

  return `${round(100 * pAbsFromMScale3(mScale3 - 0.5), 1)}% - ${round(
    100 * pAbsFromMScale3(mScale3 + 0.5),
    2
  )}%`;
}

export function getIntervalStringMScale7(mScale7: number) {
  if (mScale7 <= 0) return "0%";
  if (mScale7 < 0.5)
    return `< ${round(2 * mScale7 * pAbsFromMScale7(0.5), 2)}%`;

  return `${round(100 * pAbsFromMScale7(mScale7 - 0.5), 1)}% - ${round(
    100 * pAbsFromMScale7(mScale7 + 0.5),
    2
  )}%`;
}
