export default function round(n?: number, digits: number = 2) {
  if (!n) return NaN;

  const m = Math.pow(10, 2);

  return `${Math.round(m * n) / m}`.replace(".", ",");
}
