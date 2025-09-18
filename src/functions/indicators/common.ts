export function logMean(x: number, y: number) {
  return (y - x) / (Math.log10(y) - Math.log10(x));
}
