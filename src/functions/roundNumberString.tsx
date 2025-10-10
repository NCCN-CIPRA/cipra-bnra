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

export function roundMax(n: number) {
  // Rounds the number to the highest digit, i.e. 5231 -> 5000

  if (n <= 0) return 0;

  const digits = Math.floor(Math.log10(n));
  const factor = Math.pow(10, digits);
  return Math.round(n / factor) * factor;
}

export function prettyRound(n: number): string {
  const num = Math.round(n);

  if (num < 5) return num.toString();

  const magnitude = Math.floor(Math.log10(num));
  const base = Math.pow(10, magnitude);

  // Normalize to get the first 2 digits
  const normalized = num / base;

  // Round to a nice digit: 1, 1.5, 2, 2.5, 5, 10
  let rounded: number;
  if (normalized < 1.25) {
    rounded = 1;
  } else if (normalized <= 2) {
    rounded = 1.5;
  } else if (normalized <= 3.75) {
    rounded = 2.5;
  } else if (normalized <= 7.5) {
    rounded = 5;
  } else {
    rounded = 10;
  }

  return round(rounded * base, 0, ",", " ");
}
