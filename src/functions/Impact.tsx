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

export function getImpactScaleNumber(absoluteImpact: number) {
  if (absoluteImpact === 0) return "0";

  const diffs: [string, number][] = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [v[0], Math.abs(Math.log(1000 * v[1]) - Math.log(absoluteImpact))]);

  const minDiff = diffs.reduce((min, cur) => (min[1] >= cur[1] ? cur : min));

  return minDiff[0];
}

export function getImpactScale(absoluteImpact: number, scalePrefix: string) {
  return `${scalePrefix}${getImpactScaleNumber(absoluteImpact)}`;
}

export function getMoneyString(impactNumber: number) {
  if (impactNumber < 1000000) {
    return `€ ${impactNumber.toLocaleString()}`;
  }
  if (impactNumber < 1000000000) {
    return `€ ${(Math.round(impactNumber / 10000) / 100).toLocaleString()}M`;
  }
  if (impactNumber < 1000000000000) {
    return `€ ${(Math.round(impactNumber / 10000000) / 100).toLocaleString()}B`;
  }

  return `€ ${(Math.round(impactNumber / 10000000000) / 100).toLocaleString()}T`;
}
