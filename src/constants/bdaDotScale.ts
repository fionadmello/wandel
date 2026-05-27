const MIN_RAW = Math.pow(1, 1.8);
const RANGE_RAW = Math.pow(10, 1.8) - MIN_RAW;

export function dotSize(v: number): number {
  const clamped = Math.min(10, Math.max(1, v));
  return 4 + ((Math.pow(clamped, 1.8) - MIN_RAW) / RANGE_RAW) * 32;
}

export function dotOpacity(v: number): number {
  const clamped = Math.min(10, Math.max(1, v));
  return Math.min(0.95, Math.max(0.2, 0.2 + (clamped / 10) * 0.75));
}
