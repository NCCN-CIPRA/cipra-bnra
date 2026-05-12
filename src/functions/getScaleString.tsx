export function getProbabilityScaleString(value: number, maxScale: number = 5) {
  const p = 7 * (value / maxScale);

  if (p < 0.1) return "Impossible";
  if (p < 1) return "Very Low";
  if (p < 2) return "Low";
  if (p < 3) return "Low - Medium";
  if (p < 4) return "Medium";
  if (p < 5) return "Medium - High";
  if (p < 6) return "High";
  return "Very High";
}

export function getImpactScaleString(value: number, maxScale: number = 5) {
  const p = 7 * (value / maxScale);

  if (p < 0.1) return "No Impact"; //
  if (p < 1) return "Very Low";
  if (p < 2) return "Low";
  if (p < 3) return "Low - Medium";
  if (p < 4) return "Medium";
  if (p < 5) return "Medium - High";
  if (p < 6) return "High";
  return "Very High";
}
