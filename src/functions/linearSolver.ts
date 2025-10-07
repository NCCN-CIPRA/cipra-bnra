/**
 * This codes solves a set of 3 linear equations
 * for back-calculating Total impacts used in the
 * previous version of the calculations
 */

import { CPMatrix } from "../types/dataverse/DVCascadeSnapshot";

export function solveCascade(
  cpMatrix: CPMatrix,
  ii_c: number,
  ii_m: number,
  ii_e: number
): { ti_c: number; ti_m: number; ti_e: number } {
  const sol = solveLinear3x3(
    [
      [
        cpMatrix.considerable.considerable.abs,
        cpMatrix.considerable.major.abs,
        cpMatrix.considerable.extreme.abs,
      ],
      [
        cpMatrix.major.considerable.abs,
        cpMatrix.major.major.abs,
        cpMatrix.major.extreme.abs,
      ],
      [
        cpMatrix.extreme.considerable.abs,
        cpMatrix.extreme.major.abs,
        cpMatrix.extreme.extreme.abs,
      ],
    ],
    [ii_c, ii_m, ii_e]
  );
  console.log(sol);
  if (!sol.solution) {
    return {
      ti_c: 0,
      ti_m: 0,
      ti_e: 0,
    };
  }

  return {
    ti_c: sol.solution[0],
    ti_m: sol.solution[1],
    ti_e: sol.solution[2],
  };
}

function solveLinear3x3(
  matrix: number[][],
  rhs: number[]
): { solution: number[] | null; steps: string[]; error: string | null } {
  console.log(matrix, rhs);
  const A: number[][] = matrix.map((r) => r.slice());
  const b: number[] = rhs.slice();
  const n = 3;
  const localSteps: string[] = [];

  for (let k = 0; k < n; k++) {
    let maxRow = k;
    let maxVal = Math.abs(A[k][k]);
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(A[i][k]) > maxVal) {
        maxVal = Math.abs(A[i][k]);
        maxRow = i;
      }
    }
    if (maxVal === 0) {
      return {
        solution: null,
        steps: localSteps,
        error: "Matrix is singular or nearly singular (no unique solution).",
      };
    }
    if (maxRow !== k) {
      [A[k], A[maxRow]] = [A[maxRow], A[k]];
      [b[k], b[maxRow]] = [b[maxRow], b[k]];
      localSteps.push(`Swap row ${k + 1} with row ${maxRow + 1}`);
    }

    for (let i = k + 1; i < n; i++) {
      const factor = A[i][k] / A[k][k];
      for (let j = k; j < n; j++) {
        A[i][j] -= factor * A[k][j];
      }
      b[i] -= factor * b[k];
      localSteps.push(
        `Eliminate row ${i + 1} using row ${k + 1}: factor = ${factor.toFixed(
          6
        )}`
      );
    }
  }

  localSteps.push("Upper triangular matrix:");
  for (let i = 0; i < n; i++) {
    localSteps.push(
      A[i].map((v) => v.toFixed(6)).join("\t") + " | " + b[i].toFixed(6)
    );
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
    x[i] = s / A[i][i];
    localSteps.push(`Back substitute x_${i + 1} = ${x[i].toFixed(12)}`);
  }

  return { solution: x, steps: localSteps, error: null };
}
