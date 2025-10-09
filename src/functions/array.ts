export function list(
  maxValue: number,
  interval: number,
  startValue: number = 0
) {
  return new Array(Math.floor((maxValue - startValue) / interval) + 1)
    .fill(0)
    .map((_, i) => startValue + i * interval);
}
