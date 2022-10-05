const DPScales: { [key: string]: number } = {
  DP0: 0,
  "DP0.5": 0.001,
  DP1: 0.0016,
  "DP1.5": 0.003,
  DP2: 0.0036,
  "DP2.5": 0.01,
  DP3: 0.016,
  "DP3.5": 0.03,
  DP4: 0.036,
  "DP4.5": 0.1,
  DP5: 0.16,
};
const MScales: { [key: string]: number } = {
  M0: 0,
  "M0.5": 0.001,
  M1: 0.0016,
  "M1.5": 0.003,
  M2: 0.0036,
  "M2.5": 0.01,
  M3: 0.016,
  "M3.5": 0.03,
  M4: 0.036,
  "M4.5": 0.1,
  M5: 0.16,
};
const CPScales: { [key: string]: number } = {
  CP0: 0,
  "CP0.5": 0.001,
  CP1: 0.004,
  "CP1.5": 0.01,
  CP2: 0.04,
  "CP2.5": 0.1,
  CP3: 0.3,
  "CP3.5": 0.5,
  CP4: 0.7,
  "CP4.5": 0.9,
  CP5: 0.95,
};

export function getAbsoluteProbability(scaleString: string | null) {
  if (scaleString === null) return 0;

  if (scaleString.startsWith("DP")) {
    return DPScales[scaleString];
  } else if (scaleString.startsWith("CP")) {
    return CPScales[scaleString];
  } else if (scaleString.startsWith("M")) {
    return MScales[scaleString];
  }

  return -1;
}

export function getProbabilityScale(absoluteProbability: number, scalePrefix: string) {
  let scales;
  if (scalePrefix === "DP") scales = DPScales;
  else if (scalePrefix === "CP") scales = CPScales;
  else if (scalePrefix === "M") scales = MScales;
  else return "??";

  if (absoluteProbability === 0) return `${scalePrefix}0`;

  const diffs = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [v[0], Math.abs(Math.log(v[1]) - Math.log(absoluteProbability))]);

  const minDiff = diffs.reduce((min, cur) => (min[1] > cur[1] ? cur : min));

  return minDiff[0];
}
