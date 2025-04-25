import { RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { SCENARIO_SUFFIX } from "./scenarios";

export type Cause = {
  id: string | null;
  name: string;
  p: number;
  quali: string | null;
};

// Upper bounds of interval
// Return period of an event
const DPScales: { [key: string]: number } = {
  "0": 30000,
  "1": 3000,
  "2": 300,
  "3": 30,
  "4": 3,
  "5": 0.3,
};

// Upper bound of interval
// Probability of at least 1 attack in the next 3 years
const MScales: { [key: string]: number } = {
  "0": 0.01,
  "1": 0.5,
  "2": 0.0,
  "3": 1,
};
const CPScales: { [key: string]: number } = {
  "0": 0,
  "0.5": 0.001,
  "1": 0.004,
  "1.5": 0.01,
  "2": 0.04,
  "2.5": 0.1,
  "3": 0.3,
  "3.5": 0.5,
  "4": 0.7,
  "4.5": 0.9,
  "5": 0.95,
};

const logMean = (x: number, y: number) =>
  (y - x) / (Math.log10(y) - Math.log10(x));
const mean = (x: number, y: number) => (x + y) / 2;

export function getReturnPeriod(DPScaleString: string) {
  if (DPScaleString === "DP0")
    return logMean(DPScales["0"], DPScales["0"] * 10);

  if (DPScaleString.indexOf(".") >= 0) {
    const scaleNumber = Math.floor(parseFloat(DPScaleString.replace("DP", "")));
    return DPScales[scaleNumber];
  } else {
    const scaleNumber = parseInt(DPScaleString.replace("DP", ""), 10);
    const upperReturnPeriod = DPScales[scaleNumber - 1];
    const lowerReturnPeriod = DPScales[scaleNumber];

    return logMean(lowerReturnPeriod, upperReturnPeriod);
  }
}

export function get3YearLikelihood(MScaleString: string) {
  if (MScaleString === "M0") return mean(0, MScales["0"]);

  if (MScaleString.indexOf(".") >= 0) {
    const scaleNumber = Math.floor(parseFloat(MScaleString.replace("M", "")));
    return MScales[scaleNumber];
  } else {
    const scaleNumber = parseInt(MScaleString.replace("M", ""), 10);
    return mean(MScales[scaleNumber - 1], MScales[scaleNumber]);
  }
}

export function getDPDailyProbability(scaleString: string | null) {
  if (scaleString === null) return 0;

  // Assuming poisson distribution
  return 1 - Math.exp(-1 / (getReturnPeriod(scaleString) * 365));
}

export function getMDailyProbability(scaleString: string | null) {
  if (scaleString === null) return 0;

  // Assuming poisson distribution
  return (-1 * Math.log(1 - get3YearLikelihood(scaleString))) / (3 * 365);
}

export function getAbsoluteProbability(
  scaleString: string | null,
  scaleFactor: number = 1
) {
  if (scaleString === null) return 0;

  if (scaleString.startsWith("DP")) {
    return getDPDailyProbability(scaleString) * scaleFactor;
  } else if (scaleString.startsWith("CP")) {
    return CPScales[scaleString.replace("CP", "")] * scaleFactor;
  } else if (scaleString.startsWith("M")) {
    return getMDailyProbability(scaleString) * scaleFactor;
  }

  return -1;
}

export function getProbabilityScaleNumber(
  absoluteProbability: number,
  scalePrefix: string
) {
  let scales;
  if (scalePrefix === "DP") scales = DPScales;
  else if (scalePrefix === "DP50-") scales = DPScales;
  else if (scalePrefix === "CP") scales = CPScales;
  else if (scalePrefix === "M") scales = MScales;
  else return "??";

  if (absoluteProbability === 0) return "0";

  const diffs: [string, number][] = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [
      v[0],
      Math.abs(Math.log(v[1]) - Math.log(absoluteProbability)),
    ]);

  const minDiff = diffs.reduce((min, cur) => (min[1] > cur[1] ? cur : min));

  return minDiff[0];
}

export function getProbabilityScale(
  absoluteProbability: number,
  scalePrefix: string
) {
  return `${scalePrefix}${getProbabilityScaleNumber(
    absoluteProbability,
    scalePrefix
  )}`;
}

export const getPercentageProbability = (p: number) => {
  return `${Math.round(p * 10000) / 100}%`;
};

export const getYearlyProbability = (dailyP: number) => {
  return 1 - Math.pow(1 - dailyP, 365);
};

const rescaleProbability = (p: number) => {
  return 5 + Math.log(p + 0.0103) / Math.log(2.5);
};

export function getTotalProbabilityRelativeScale(
  calculation: RiskCalculation,
  scenarioSuffix: SCENARIO_SUFFIX,
  tp50: boolean = false
) {
  return rescaleProbability(
    getYearlyProbability(calculation[`tp${tp50 ? "50" : ""}${scenarioSuffix}`])
  );
}

export function getYearlyProbabilityFromRelative(p: number) {
  return Math.pow(Math.E, (p - 5) * Math.log(2.5)) - 0.0103;
}

export function getPartialProbabilityRelativeScale(p_daily: number) {
  // const tp = getYearlyProbability(calculation[`tp${tp50 ? "50" : ""}${scenarioSuffix}`]);
  // const ratio = getYearlyProbability(p_daily) / tp;

  // return ratio * rescaleProbability(tp);
  return rescaleProbability(getYearlyProbability(p_daily));
}
