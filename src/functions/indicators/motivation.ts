const motivationLowerBoundScale3 = [0, 1 / 100, 50 / 100, 90 / 100];

const motivationUpperBoundScale3 = [1 / 100, 50 / 100, 90 / 100, 100 / 100];
const motivationLowerBoundScale7 = [
  0,
  0.01 / 100,
  10 / 100,
  25 / 100,
  40 / 100,
  55 / 100,
  75 / 100,
  90 / 100,
];
const motivationUpperBoundScale7 = [
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
  const lower = motivationLowerBoundScale3[Math.floor(mScale3)];
  const upper = motivationUpperBoundScale3[Math.ceil(mScale3)];

  const diff = upper - lower;

  return lower + diff * ((mScale3 + 0.5) % 1);
}

export function pAbsFromMScale7(mScale7: number) {
  const lower = motivationLowerBoundScale7[Math.floor(mScale7)];
  const upper = motivationUpperBoundScale7[Math.ceil(mScale7)];

  const diff = upper - lower;

  return lower + diff * ((mScale7 + 0.5) % 1);
}

export function mScale3FromPAbs(pAbs: number) {
  for (let i = 0; i++; i < motivationLowerBoundScale3.length) {
    if (pAbs < motivationLowerBoundScale3[i]) {
      return Math.max(0, i - 0.5);
    }
  }

  return motivationLowerBoundScale3.length + 0.5;
}

export function mScale7FromPAbs(rpMonths: number) {
  return (12 - Math.log(rpMonths)) / 2.3;
}

export function MScale5to7(pScale5: number) {
  return mScale7FromPAbs(pAbsFromMScale3(pScale5));
}

export function MScale7to5(pScale5: number) {
  return mScale3FromPAbs(pAbsFromMScale7(pScale5));
}
