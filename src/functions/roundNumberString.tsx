export default function round(n?: number, digits: number = 2) {
  if (!n) return "0";

  const m = Math.pow(10, digits);

  return `${Math.round(m * n) / m}`.replace(".", ",");
}
