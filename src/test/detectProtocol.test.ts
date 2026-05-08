import { describe, expect, it } from "vitest";

import {
  detectEngineDrift,
  detectHabitDrift,
} from "@/features/protocols/detectProtocol";
import type { Habit } from "@/types/database";

const TODAY = "2026-05-08";
const EMPTY = new Map<string, Set<string>>();

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    user_id: "user-1",
    category: "build",
    name: "Running",
    status: "active",
    paused_at: null,
    sort_order: 0,
    created_at: "",
    ...overrides,
  };
}

function obsByDate(entries: [string, string[]][]): Map<string, Set<string>> {
  return new Map(entries.map(([date, ids]) => [date, new Set(ids)]));
}

describe("detectHabitDrift", () => {
  it("returns null when habit has observations on both of the last two days", () => {
    const habits = [makeHabit()];
    const obs = obsByDate([
      ["2026-05-07", ["habit-1"]],
      ["2026-05-06", ["habit-1"]],
    ]);
    expect(detectHabitDrift(habits, EMPTY, obs, TODAY)).toBeNull();
  });

  it("returns null when only yesterday is missed (first miss is weather)", () => {
    const habits = [makeHabit()];
    // logged day before yesterday, missed yesterday
    const obs = obsByDate([["2026-05-06", ["habit-1"]]]);
    expect(detectHabitDrift(habits, EMPTY, obs, TODAY)).toBeNull();
  });

  it("returns drift when two consecutive days are missed", () => {
    const habits = [makeHabit()];
    const result = detectHabitDrift(habits, EMPTY, EMPTY, TODAY);
    expect(result).not.toBeNull();
    expect(result?.id).toBe("habit_drift");
    expect(result?.habitId).toBe("habit-1");
    expect(result?.trackType).toBe("build");
    expect(result?.trackName).toBe("Running");
    expect(result?.currentStep).toBe(0);
  });

  it("skips habits that are not active", () => {
    const habits = [makeHabit({ status: "paused" })];
    expect(detectHabitDrift(habits, EMPTY, EMPTY, TODAY)).toBeNull();
  });

  it("returns the most drifted habit when multiple are drifting", () => {
    const habit1 = makeHabit({ id: "habit-1", name: "Running" });
    const habit2 = makeHabit({ id: "habit-2", name: "Meditation" });
    // habit1: logged on 2026-05-05 → 2 consecutive missed days
    // habit2: no observations → 10 consecutive missed days
    const obs = obsByDate([["2026-05-05", ["habit-1"]]]);
    const result = detectHabitDrift([habit1, habit2], EMPTY, obs, TODAY);
    expect(result?.habitId).toBe("habit-2");
    expect(result?.driftDays).toBe(10);
  });

  it("checks break obs for break habits and build obs for build habits", () => {
    const breakHabit = makeHabit({
      id: "break-1",
      category: "break",
      name: "Nail biting",
    });
    const buildHabit = makeHabit({
      id: "build-1",
      category: "build",
      name: "Running",
    });
    // break habit has recent observations (no drift), build habit has none
    const breakObs = obsByDate([
      ["2026-05-07", ["break-1"]],
      ["2026-05-06", ["break-1"]],
    ]);
    const result = detectHabitDrift(
      [breakHabit, buildHabit],
      breakObs,
      EMPTY,
      TODAY,
    );
    expect(result?.habitId).toBe("build-1");
    expect(result?.trackType).toBe("build");
  });

  it("returns null when there are no active habits", () => {
    expect(detectHabitDrift([], EMPTY, EMPTY, TODAY)).toBeNull();
  });
});

describe("detectEngineDrift", () => {
  it("returns null when mirror was done yesterday", () => {
    expect(detectEngineDrift(new Set(["2026-05-07"]), TODAY)).toBeNull();
  });

  it("returns null when 2 days are missed", () => {
    // last mark on 2026-05-06 → 1 consecutive missed day (only yesterday)
    expect(detectEngineDrift(new Set(["2026-05-06"]), TODAY)).toBeNull();
  });

  it("returns engine_slip when exactly 3 consecutive days are missed", () => {
    // last mark on 2026-05-04 → missed 05-07, 05-06, 05-05 = 3 days
    const result = detectEngineDrift(new Set(["2026-05-04"]), TODAY);
    expect(result?.id).toBe("engine_slip");
    expect(result?.trackType).toBe("engine");
    expect(result?.habitId).toBeNull();
  });

  it("returns engine_drift when 7 consecutive days are missed", () => {
    // last mark on 2026-04-30 → missed 05-07 through 05-01 = 7 days
    const result = detectEngineDrift(new Set(["2026-04-30"]), TODAY);
    expect(result?.id).toBe("engine_drift");
    expect(result?.driftDays).toBe(7);
  });

  it("returns engine_drift when no marks exist at all", () => {
    const result = detectEngineDrift(new Set(), TODAY);
    expect(result?.id).toBe("engine_drift");
    expect(result?.driftDays).toBe(10);
  });

  it("returns engine_drift not engine_slip when missed days exceed 7", () => {
    // last mark on 2026-04-29 → 9 consecutive missed days
    const result = detectEngineDrift(new Set(["2026-04-29"]), TODAY);
    expect(result?.id).toBe("engine_drift");
  });
});
