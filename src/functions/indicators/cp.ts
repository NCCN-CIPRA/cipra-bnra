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
export const cpLowerBoundScale7 = [
  0,
  0.01 / 100,
  10 / 100,
  25 / 100,
  40 / 100,
  55 / 100,
  75 / 100,
  90 / 100,
];
export const cpUpperBoundScale7 = [
  0.01 / 100,
  10 / 100,
  25 / 100,
  40 / 100,
  55 / 100,
  75 / 100,
  90 / 100,
  100 / 100,
];

export function pAbsFromCPScale5(cpScale5: number) {
  const index = Math.floor(cpScale5 + 0.5);

  if (index < 0.5) return (cpScale5 / 0.5) * cpUpperBoundScale5[0];
  if (index >= 5.5) return 1;

  const lower = cpLowerBoundScale5[index];
  const upper = cpUpperBoundScale5[index];

  const diff = upper - lower;

  return lower + diff * ((cpScale5 + 0.5) % 1);
}

export function cpScale5FromPAbs(pAbs: number) {
  // Handle edge cases
  if (pAbs < cpUpperBoundScale5[0]) return 0.5 * (pAbs / cpUpperBoundScale5[0]);
  if (pAbs >= 1) return cpLowerBoundScale5.length - 0.5;

  // Find which interval the pAbs value falls into
  for (let i = 0; i < cpLowerBoundScale5.length; i++) {
    const lower = cpLowerBoundScale5[i];
    const upper = cpUpperBoundScale5[i];

    if (pAbs >= lower && pAbs <= upper) {
      // Interpolate within the interval
      const fraction = (pAbs - lower) / (upper - lower);
      // Convert back from the +0.5 offset used in pAbsFromMScale3
      return i + (fraction - 0.5);
    }
  }

  // If not found in any interval, return the last scale value
  return cpLowerBoundScale5.length - 0.5;
}

export function cpScale7FromPAbs(pAbs: number) {
  // Handle edge cases
  if (pAbs < cpUpperBoundScale7[0]) return 0.5 * (pAbs / cpUpperBoundScale7[0]);
  if (pAbs >= 1) return cpLowerBoundScale7.length - 0.5;

  // Find which interval the pAbs value falls into
  for (let i = 0; i < cpLowerBoundScale7.length; i++) {
    const lower = cpLowerBoundScale7[i];
    const upper = cpUpperBoundScale7[i];

    if (pAbs >= lower && pAbs <= upper) {
      // Interpolate within the interval
      const fraction = (pAbs - lower) / (upper - lower);
      // Convert back from the +0.5 offset used in pAbsFromMScale7
      return i - 0.5 + fraction;
    }
  }

  // If not found in any interval, return the last scale value
  return cpLowerBoundScale7.length - 0.5;
}
