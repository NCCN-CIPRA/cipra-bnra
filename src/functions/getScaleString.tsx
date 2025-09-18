export default function getScaleString(value: number, maxScale: number = 5) {
  const p = value / maxScale;

  if (p < 0.2) return "Very Low";
  if (p < 0.4) return "Low";
  if (p < 0.6) return "Medium";
  if (p < 0.8) return "High";
  return "Very High";
}
