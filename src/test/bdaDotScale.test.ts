import { describe, expect, it } from "vitest";

import { dotOpacity, dotSize } from "@/constants/bdaDotScale";

describe("dotSize", () => {
  it("returns exactly 4 for v=1 (minimum)", () => {
    expect(dotSize(1)).toBe(4);
  });

  it("returns exactly 36 for v=10 (maximum)", () => {
    expect(dotSize(10)).toBe(36);
  });

  it("is monotonically increasing across the range", () => {
    for (let v = 1; v < 10; v++) {
      expect(dotSize(v + 1)).toBeGreaterThan(dotSize(v));
    }
  });

  it("clamps v=0 to v=1 result", () => {
    expect(dotSize(0)).toBe(dotSize(1));
  });

  it("clamps v=11 to v=10 result", () => {
    expect(dotSize(11)).toBe(dotSize(10));
  });

  it("mid-range v=5 is between 4 and 36", () => {
    const s = dotSize(5);
    expect(s).toBeGreaterThan(4);
    expect(s).toBeLessThan(36);
  });
});

describe("dotOpacity", () => {
  it("returns 0.275 for v=1", () => {
    expect(dotOpacity(1)).toBeCloseTo(0.275, 2);
  });

  it("returns 0.95 for v=10", () => {
    expect(dotOpacity(10)).toBeCloseTo(0.95, 2);
  });

  it("returns ~0.65 for v=6", () => {
    expect(dotOpacity(6)).toBeCloseTo(0.65, 2);
  });

  it("clamps result to [0.2, 0.95]", () => {
    expect(dotOpacity(0)).toBeGreaterThanOrEqual(0.2);
    expect(dotOpacity(11)).toBeLessThanOrEqual(0.95);
  });
});
