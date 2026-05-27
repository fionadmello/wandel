import { describe, expect, it } from "vitest";

import { computeInsight } from "@/constants/insightLine";

describe("computeInsight", () => {
  it("flat: all within 2 → Steady", () => {
    expect(computeInsight(6, 7, 6)).toBe(
      "Steady — the challenge held its ground",
    );
  });
  it("flat: spread exactly 2 → Steady", () => {
    expect(computeInsight(5, 7, 5)).toBe(
      "Steady — the challenge held its ground",
    );
  });
  it("flat: all identical → Steady", () => {
    expect(computeInsight(5, 5, 5)).toBe(
      "Steady — the challenge held its ground",
    );
  });
  it("peaked: D max, A <= B, D-A >= 3 → Hardest in the moment", () => {
    expect(computeInsight(5, 9, 2)).toBe(
      "Hardest in the moment — and it passed",
    );
  });
  it("peaked: A = B, D-A >= 3 → Hardest in the moment", () => {
    expect(computeInsight(4, 8, 4)).toBe(
      "Hardest in the moment — and it passed",
    );
  });
  it("peaked: D max but A > B → not peaked", () => {
    expect(computeInsight(3, 8, 5)).not.toBe(
      "Hardest in the moment — and it passed",
    );
  });
  it("still rising: A is max → Still sitting", () => {
    expect(computeInsight(4, 7, 9)).toBe("Still sitting with this one");
  });
  it("surprised: B <= 4 and D >= 7 → Harder than expected", () => {
    expect(computeInsight(3, 8, 4)).toBe(
      "Harder than you expected, and you showed up anyway",
    );
  });
  it("surprised: boundary B=4, D=7 → Harder than expected", () => {
    expect(computeInsight(4, 7, 5)).toBe(
      "Harder than you expected, and you showed up anyway",
    );
  });
  it("fear dissolved: B >= 7 and A <= 4 → Easier than braced for", () => {
    expect(computeInsight(8, 7, 2)).toBe("Easier than you braced for");
  });
  it("fear dissolved: boundary B=7, A=4 → Easier than braced for", () => {
    expect(computeInsight(7, 5, 4)).toBe("Easier than you braced for");
  });
  it("fallback → It took courage", () => {
    expect(computeInsight(6, 9, 7)).toBe(
      "It took courage, and you're through it",
    );
  });
  it("fallback: moderate spread → It took courage", () => {
    expect(computeInsight(5, 8, 6)).toBe(
      "It took courage, and you're through it",
    );
  });
});
