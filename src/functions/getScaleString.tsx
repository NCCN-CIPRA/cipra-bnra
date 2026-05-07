export function getProbabilityScaleString(value: number, maxScale: number = 5) {
  const p = value / maxScale;

  if (p < 0.07) return "Impossible";
  if (p < 0.14) return "Theoretical";
  if (p < 0.21) return "Negligible";
  if (p < 0.29) return "Remote";
  if (p < 0.36) return "Rare";
  if (p < 0.43) return "Improbable";
  if (p < 0.5) return "Unlikely";
  if (p < 0.57) return "Marginal";
  if (p < 0.64) return "Possible";
  if (p < 0.71) return "Probable";
  if (p < 0.79) return "Likely";
  if (p < 0.86) return "Expected";
  if (p < 0.93) return "Imminent";
  if (p < 1.0) return "Inevitable";
  return "Certain";
}

export function getImpactScaleString(value: number, maxScale: number = 5) {
  const p = value / maxScale;

  if (p < 0.07) return "None"; //
  if (p < 0.21) return "Negligible"; // 1
  if (p < 0.36) return "Minimal"; // 2
  if (p < 0.5) return "Moderate"; // 3
  if (p < 0.64) return "Significant"; // 4
  if (p < 0.79) return "Serious"; // 5
  if (p < 0.93) return "Severe"; // 6
  return "Catastrophic"; // 7
}
