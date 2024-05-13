export default function getScaleString(value: number) {
  if (value < 1) return "Very Low";
  if (value < 2) return "Low";
  if (value < 3) return "Medium";
  if (value < 4) return "High";
  return "Very High";
}
