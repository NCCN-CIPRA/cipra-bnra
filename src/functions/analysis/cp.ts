import {
  CPMatrix,
  DVCascadeSnapshot,
} from "../../types/dataverse/DVCascadeSnapshot";
import {
  CPMatrixCauseRow,
  DVRiskCascade,
} from "../../types/dataverse/DVRiskCascade";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { Indicators } from "../../types/global";
import { cpScale5FromPAbs, cpScale7FromPAbs } from "../indicators/cp";
import { mScale3FromPDaily, mScale7FromPDaily } from "../indicators/motivation";
import { pDailyFromReturnPeriodMonths } from "../indicators/probability";
import { SCENARIOS } from "../scenarios";
import { getConsensusCascade } from "./prepareRiskFiles";

const c = SCENARIOS.CONSIDERABLE;
const m = SCENARIOS.MAJOR;
const e = SCENARIOS.EXTREME;

export type AbsoluteCPMatrix = {
  [c]: AbsoluteCPMatrixEffectRow;
  [m]: AbsoluteCPMatrixEffectRow;
  [e]: AbsoluteCPMatrixEffectRow;
};

export type AbsoluteCPMatrixEffectRow = {
  [c]: number;
  [m]: number;
  [e]: number;
};

export const getNormalizedCPMatrix = (
  cpMatrix: CPMatrixCauseRow
): AbsoluteCPMatrix => {
  const c20 =
    (1 - cpMatrix[c][c].abs) *
    (1 - cpMatrix[c][m].abs) *
    (1 - cpMatrix[c][e].abs);
  const m20 =
    (1 - cpMatrix[m][c].abs) *
    (1 - cpMatrix[m][m].abs) *
    (1 - cpMatrix[m][e].abs);
  const e20 =
    (1 - cpMatrix[e][c].abs) *
    (1 - cpMatrix[e][m].abs) *
    (1 - cpMatrix[e][e].abs);

  const cTot =
    c20 + cpMatrix[c][c].abs + cpMatrix[c][m].abs + cpMatrix[c][e].abs;
  const mTot =
    m20 + cpMatrix[m][c].abs + cpMatrix[m][m].abs + cpMatrix[m][e].abs;
  const eTot =
    e20 + cpMatrix[e][c].abs + cpMatrix[e][m].abs + cpMatrix[e][e].abs;

  return {
    [c]: {
      [c]: cpMatrix[c][c].abs / cTot,
      [m]: cpMatrix[c][m].abs / cTot,
      [e]: cpMatrix[c][e].abs / cTot,
    },
    [m]: {
      [c]: cpMatrix[m][c].abs / mTot,
      [m]: cpMatrix[m][m].abs / mTot,
      [e]: cpMatrix[m][e].abs / mTot,
    },
    [e]: {
      [c]: cpMatrix[e][c].abs / eTot,
      [m]: cpMatrix[e][m].abs / eTot,
      [e]: cpMatrix[e][e].abs / eTot,
    },
  };
};

/**
 * This function should only be used during initial migration phases of the
 * snapshot system.
 *
 * Previously, risk cascades used the C2C, C2M, ... and C2C_quali, ... fields
 * to store cascade data.
 *
 * Additionally, some factors were applied during the calculation stages to
 * clear up some analysis errors.
 */
export const getCPMatrixFromOldFormat = (
  cause: DVRiskSnapshot,
  cascade: DVRiskCascade
): CPMatrixCauseRow => {
  // Apply the correction factors and average C2C and C2C quali values
  const consensusCascade = getConsensusCascade(null, null, cascade);

  const cpMatrix: CPMatrixCauseRow = {
    [c]: {
      [c]: {
        abs: getNewCPFromOldMAndCP(cause, c, consensusCascade.c2c),
        scale5: getNewCPFromOldMAndCP(
          cause,
          c,
          consensusCascade.c2c,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          c,
          consensusCascade.c2c,
          Indicators.V2
        ),
      },
      [m]: {
        abs: getNewCPFromOldMAndCP(cause, c, consensusCascade.c2m),
        scale5: getNewCPFromOldMAndCP(
          cause,
          c,
          consensusCascade.c2m,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          c,
          consensusCascade.c2m,
          Indicators.V2
        ),
      },
      [e]: {
        abs: getNewCPFromOldMAndCP(cause, c, consensusCascade.c2e),
        scale5: getNewCPFromOldMAndCP(
          cause,
          c,
          consensusCascade.c2e,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          c,
          consensusCascade.c2e,
          Indicators.V2
        ),
      },
    },
    [m]: {
      [c]: {
        abs: getNewCPFromOldMAndCP(cause, m, consensusCascade.m2c),
        scale5: getNewCPFromOldMAndCP(
          cause,
          m,
          consensusCascade.m2c,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          m,
          consensusCascade.m2c,
          Indicators.V2
        ),
      },
      [m]: {
        abs: getNewCPFromOldMAndCP(cause, m, consensusCascade.m2m),
        scale5: getNewCPFromOldMAndCP(
          cause,
          m,
          consensusCascade.m2m,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          m,
          consensusCascade.m2m,
          Indicators.V2
        ),
      },
      [e]: {
        abs: getNewCPFromOldMAndCP(cause, m, consensusCascade.m2e),
        scale5: getNewCPFromOldMAndCP(
          cause,
          m,
          consensusCascade.m2e,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          m,
          consensusCascade.m2e,
          Indicators.V2
        ),
      },
    },
    [e]: {
      [c]: {
        abs: getNewCPFromOldMAndCP(cause, e, consensusCascade.e2c),
        scale5: getNewCPFromOldMAndCP(
          cause,
          e,
          consensusCascade.e2c,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          e,
          consensusCascade.e2c,
          Indicators.V2
        ),
      },
      [m]: {
        abs: getNewCPFromOldMAndCP(cause, e, consensusCascade.e2m),
        scale5: getNewCPFromOldMAndCP(
          cause,
          e,
          consensusCascade.e2m,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          e,
          consensusCascade.e2m,
          Indicators.V2
        ),
      },
      [e]: {
        abs: getNewCPFromOldMAndCP(cause, e, consensusCascade.e2e),
        scale5: getNewCPFromOldMAndCP(
          cause,
          e,
          consensusCascade.e2e,
          Indicators.V1
        ),
        scale7: getNewCPFromOldMAndCP(
          cause,
          e,
          consensusCascade.e2e,
          Indicators.V2
        ),
      },
    },
  };

  return cpMatrix;
};

/**
 * During the previous BNRA iteration, the total probability of an attack by an actor was given by:
 *
 * Motivation of actor group (scenario) * CP of attack cascade
 *
 * In the new method, only the CP of the attack cascade is taken into account, and this value is renamed to "Motivation" of the actor
 * for this type of attack.
 */
export const getNewCPFromOldMAndCP = (
  cause: DVRiskSnapshot,
  causeScenario: SCENARIOS,
  cpAbsOld: number,
  indicators: Indicators | null = null
) => {
  if (cause.cr4de_risk_type === RISK_TYPE.MANMADE) {
    const rpMonths = cause.cr4de_quanti[causeScenario].dp.rpMonths;
    const pDaily = pDailyFromReturnPeriodMonths(rpMonths);

    const newPDaily = pDaily * cpAbsOld;

    if (!indicators) return newPDaily;

    if (indicators === Indicators.V1) {
      return Math.round(10 * mScale3FromPDaily(newPDaily)) / 10;
    }

    return Math.round(10 * mScale7FromPDaily(newPDaily)) / 10;
  }

  if (!indicators) return cpAbsOld;

  if (indicators === Indicators.V1) {
    return Math.round(10 * cpScale5FromPAbs(cpAbsOld)) / 10;
  }

  return Math.round(10 * cpScale7FromPAbs(cpAbsOld)) / 10;
};

// export const getTotalCP = (cpMatrix: CPMatrix) => {
//   return (
//     cpMatrix.considerable.considerable.abs +
//     cpMatrix.considerable.major.abs +
//     cpMatrix.considerable.extreme.abs +
//     cpMatrix.major.considerable.abs +
//     cpMatrix.major.major.abs +
//     cpMatrix.major.extreme.abs +
//     cpMatrix.extreme.considerable.abs +
//     cpMatrix.extreme.major.abs +
//     cpMatrix.extreme.extreme.abs
//   );
// };

export const getAverageCP = (
  cpMatrix: CPMatrix,
  totalCPs: Record<SCENARIOS, number>
) => {
  return (
    (cpMatrix[SCENARIOS.CONSIDERABLE].avg / totalCPs.considerable +
      cpMatrix[SCENARIOS.MAJOR].avg / totalCPs.major +
      cpMatrix[SCENARIOS.EXTREME].avg / totalCPs.extreme) /
    3
  );
};

export const getTotalCP = (
  causeScenario: SCENARIOS,
  effects: DVCascadeSnapshot[]
) => {
  return effects.reduce(
    (t, e) => t + e.cr4de_quanti_cp[causeScenario].avg,
    0.00001
  );
};

export const getTotalCPDynamic = (effects: DVCascadeSnapshot[]) => {
  return effects.reduce((t, e) => t + getCPDynamic(e), 0.00001);
};

const getCPDynamic = (c: DVCascadeSnapshot) => {
  return (
    getCPCauseDynamic(c, SCENARIOS.CONSIDERABLE) +
    getCPCauseDynamic(c, SCENARIOS.MAJOR) +
    getCPCauseDynamic(c, SCENARIOS.EXTREME)
  );
};

const getCPCauseDynamic = (c: DVCascadeSnapshot, causeScenario: SCENARIOS) => {
  return (
    c.cr4de_quanti_cp[causeScenario].considerable.abs +
    c.cr4de_quanti_cp[causeScenario].considerable.abs +
    c.cr4de_quanti_cp[causeScenario].considerable.abs
  );
};

export const getAverageCPDynamic = (
  c: DVCascadeSnapshot,
  effects: DVCascadeSnapshot[]
) => {
  return getCPDynamic(c) / getTotalCPDynamic(effects);
};

export const getAverageCauseCPDynamic = (
  cpMatrix: CPMatrix,
  causeScenario: SCENARIOS,
  effect: DVCascadeSnapshot
) => {
  const ii_s2c =
    cpMatrix[causeScenario].considerable.abs *
    effect.cr4de_quanti_effect.considerable.ti.all.euros;
  const ii_s2m =
    cpMatrix[causeScenario].major.abs *
    effect.cr4de_quanti_effect.major.ti.all.euros;
  const ii_s2e =
    cpMatrix[causeScenario].extreme.abs *
    effect.cr4de_quanti_effect.extreme.ti.all.euros;

  const ii_tot = 1 + ii_s2c + ii_s2m + ii_s2e;

  return (
    (cpMatrix[causeScenario].considerable.abs * ii_s2c +
      cpMatrix[causeScenario].major.abs * ii_s2m +
      cpMatrix[causeScenario].extreme.abs * ii_s2e) /
    ii_tot
  );
};
