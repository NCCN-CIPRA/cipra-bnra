export default function dayDifference(d1: Date, d2: Date) {
  const difference = d2.getTime() - d1.getTime();

  return Math.ceil(difference / (1000 * 3600 * 24));
}

export function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * 1000 * 3600 * 24);
}
