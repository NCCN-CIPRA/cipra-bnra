export default function round(
  n?: number,
  digits: number = 2,
  separator: string = ",",
  thousandSeparator?: string
) {
  if (!n) return "0";

  const m = Math.pow(10, digits);

  const str = `${Math.round(m * n) / m}`.replace(".", separator);

  if (!thousandSeparator) return str;

  const parts = str.split(separator);
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return parts.join(separator);
}
