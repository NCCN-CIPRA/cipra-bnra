const cpLowerBoundScale5 = [
  0,
  0.1 / 100,
  1 / 100,
  10 / 100,
  50 / 100,
  90 / 100,
];

const cpUpperBoundScale5 = [
  0.1 / 100,
  1 / 100,
  10 / 100,
  50 / 100,
  90 / 100,
  100 / 100,
];

export function pAbsFromCPScale5(mScale5: number) {
  const index = Math.floor(mScale5 + 0.5);

  if (index < 0) return 0;
  if (index >= 3.5) return 1;

  const lower = cpLowerBoundScale5[index];
  const upper = cpUpperBoundScale5[index];

  const diff = upper - lower;

  return lower + diff * ((mScale5 + 0.5) % 1);
}
