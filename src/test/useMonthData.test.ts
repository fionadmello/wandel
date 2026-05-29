import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useMonthBreakObservations,
  useMonthBuildObservations,
  useMonthEngineActivity,
  useMonthEngineMarks,
} from "@/hooks/useMonthData";

const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }));

vi.mock("@/lib/supabase", () => {
  const lte = () => ({
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
      mockQuery().then(resolve, reject),
    order: () => mockQuery(),
  });
  const gte = { lte };
  const eq: Record<string, unknown> = { gte: () => gte };
  eq.eq = () => eq;
  return {
    supabase: {
      from: () => ({
        select: () => eq,
      }),
    },
  };
});

const ENGINE_MARK = {
  id: "em-1",
  user_id: "user-1",
  date: "2026-04-10",
  timer_completed: false,
  confirmed_at: "2026-04-10T08:00:00Z",
};

const BREAK_OBS = {
  id: "bo-1",
  habit_id: "habit-1",
  user_id: "user-1",
  job: "Stress relief",
  context: null,
  urge_intensity: 7,
  aftermath: null,
  logged_at: "2026-04-10T10:00:00Z",
  break_observation_emotions: [],
};

const BUILD_OBS = {
  id: "buo-1",
  habit_id: "habit-2",
  user_id: "user-1",
  date: "2026-04-10",
  sub_type: null,
  mark_type: "full" as const,
  mark_label: "Full session",
  note: null,
  logged_at: "2026-04-10T09:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useMonthEngineMarks", () => {
  it("returns engine marks for the month", async () => {
    mockQuery.mockReturnValue(
      Promise.resolve({ data: [ENGINE_MARK], error: null }),
    );

    const { result } = renderHook(
      () => useMonthEngineMarks("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([ENGINE_MARK]);
  });

  it("returns empty array when no marks exist", async () => {
    mockQuery.mockReturnValue(Promise.resolve({ data: [], error: null }));

    const { result } = renderHook(
      () => useMonthEngineMarks("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws on error", async () => {
    mockQuery.mockReturnValue(
      Promise.resolve({ data: null, error: { message: "DB error" } }),
    );

    const { result } = renderHook(
      () => useMonthEngineMarks("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useMonthBreakObservations", () => {
  it("returns break observations for the month", async () => {
    mockQuery.mockReturnValue(
      Promise.resolve({ data: [BREAK_OBS], error: null }),
    );

    const { result } = renderHook(
      () => useMonthBreakObservations("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([BREAK_OBS]);
  });

  it("throws on error", async () => {
    mockQuery.mockReturnValue(
      Promise.resolve({ data: null, error: { message: "DB error" } }),
    );

    const { result } = renderHook(
      () => useMonthBreakObservations("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useMonthBuildObservations", () => {
  it("returns build observations for the month", async () => {
    mockQuery.mockReturnValue(
      Promise.resolve({ data: [BUILD_OBS], error: null }),
    );

    const { result } = renderHook(
      () => useMonthBuildObservations("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([BUILD_OBS]);
  });

  it("throws on error", async () => {
    mockQuery.mockReturnValue(
      Promise.resolve({ data: null, error: { message: "DB error" } }),
    );

    const { result } = renderHook(
      () => useMonthBuildObservations("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useMonthEngineActivity", () => {
  it("returns deduplicated union of dates across all four tables", async () => {
    mockQuery
      .mockReturnValueOnce(
        Promise.resolve({
          data: [{ date: "2026-04-01" }, { date: "2026-04-05" }],
          error: null,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          data: [{ date: "2026-04-05" }, { date: "2026-04-10" }],
          error: null,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          data: [{ date: "2026-04-15" }],
          error: null,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          data: [{ date: "2026-04-20" }],
          error: null,
        }),
      );

    const { result } = renderHook(
      () => useMonthEngineActivity("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([
      "2026-04-01",
      "2026-04-05",
      "2026-04-10",
      "2026-04-15",
      "2026-04-20",
    ]);
  });

  it("returns empty array when all four tables return empty", async () => {
    mockQuery
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }));

    const { result } = renderHook(
      () => useMonthEngineActivity("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws when the first table errors", async () => {
    mockQuery
      .mockReturnValueOnce(
        Promise.resolve({ data: null, error: { message: "DB error" } }),
      )
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }));

    const { result } = renderHook(
      () => useMonthEngineActivity("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("throws when the take_up_space_log table errors", async () => {
    mockQuery
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(Promise.resolve({ data: [], error: null }))
      .mockReturnValueOnce(
        Promise.resolve({ data: null, error: { message: "DB error" } }),
      );

    const { result } = renderHook(
      () => useMonthEngineActivity("user-1", 2026, 4),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
