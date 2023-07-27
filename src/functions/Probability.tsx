const DPScales: { [key: string]: number } = {
  "0": 0,
  "0.5": 0.001,
  "1": 0.0016,
  "1.5": 0.003,
  "2": 0.0036,
  "2.5": 0.01,
  "3": 0.016,
  "3.5": 0.03,
  "4": 0.036,
  "4.5": 0.1,
  "5": 0.16,
};
const MScales: { [key: string]: number } = {
  "0": 0,
  "0.5": 0.001,
  "1": 0.0016,
  "1.5": 0.003,
  "2": 0.0036,
  "2.5": 0.01,
  "3": 0.016,
  "3.5": 0.03,
  "4": 0.036,
  "4.5": 0.1,
  "5": 0.16,
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

export function getAbsoluteProbability(scaleString: string | null) {
  if (scaleString === null) return 0;

  if (scaleString.startsWith("DP")) {
    return DPScales[scaleString.replace("DP", "")];
  } else if (scaleString.startsWith("CP")) {
    return CPScales[scaleString.replace("CP", "")];
  } else if (scaleString.startsWith("M")) {
    return MScales[scaleString.replace("M", "")];
  }

  return -1;
}

export function getProbabilityScaleNumber(absoluteProbability: number, scalePrefix: string) {
  let scales;
  if (scalePrefix === "DP") scales = DPScales;
  else if (scalePrefix === "DP50-") scales = DPScales;
  else if (scalePrefix === "CP") scales = CPScales;
  else if (scalePrefix === "M") scales = MScales;
  else return "??";

  if (absoluteProbability === 0) return "0";

  const diffs: [string, number][] = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [v[0], Math.abs(Math.log(v[1]) - Math.log(absoluteProbability))]);

  const minDiff = diffs.reduce((min, cur) => (min[1] > cur[1] ? cur : min));

  return minDiff[0];
}

export function getProbabilityScale(absoluteProbability: number, scalePrefix: string) {
  return `${scalePrefix}${getProbabilityScaleNumber(absoluteProbability, scalePrefix)}`;
}
