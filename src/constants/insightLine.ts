export function computeInsight(b: number, d: number, a: number): string {
  const max = Math.max(b, d, a);
  const min = Math.min(b, d, a);

  if (max - min <= 2) return "Steady — the challenge held its ground";
  if (d === max && a <= b && d - a >= 3)
    return "Hardest in the moment — and it passed";
  if (a === max) return "Still sitting with this one";
  if (b <= 4 && d >= 7)
    return "Harder than you expected, and you showed up anyway";
  if (b >= 7 && a <= 4) return "Easier than you braced for";
  return "It took courage, and you're through it";
}
