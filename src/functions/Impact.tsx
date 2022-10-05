// in k€ = € 1 000
const scales: { [key: string]: number } = {
  "0": 0,
  "0.5": 5000,
  "1": 16000,
  "1.5": 50000,
  "2": 160000,
  "2.5": 500000,
  "3": 1600000,
  "3.5": 5000000,
  "4": 16000000,
  "4.5": 50000000,
  "5": 160000000,
};

export function getAbsoluteImpact(scaleString: string | null) {
  if (scaleString === null) return 0;

  return 1000 * scales[scaleString.slice(2)];
}

export function getImpactScale(absoluteImpact: number, scalePrefix: string) {
  if (absoluteImpact === 0) return `${scalePrefix}0`;

  const diffs = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [v[0], Math.abs(Math.log(1000 * v[1]) - Math.log(absoluteImpact))]);

  const minDiff = diffs.reduce((min, cur) => (min[1] > cur[1] ? cur : min));

  return `${scalePrefix}${minDiff[0]}`;
}
