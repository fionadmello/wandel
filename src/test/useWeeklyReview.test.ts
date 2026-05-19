import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { currentWeekEnding, useWeeklyReview } from "@/hooks/useWeeklyReview";
import type { WeeklyReview } from "@/types/database";

const { mockMaybeSingle } = vi.hoisted(() => ({
  mockMaybeSingle: vi.fn(),
}));

vi.mock("@/lib/supabase", () => {
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.maybeSingle = mockMaybeSingle;
  return { supabase: { from: () => builder } };
});

const REVIEW: WeeklyReview = {
  id: "review-1",
  user_id: "user-1",
  week_ending: "2026-05-17",
  engine_response: null,
  pride_note: null,
  self_rated_consistency: null,
  created_at: "2026-05-17T10:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("currentWeekEnding", () => {
  it("returns the same Sunday when today is Sunday", () => {
    // 2026-05-17 is a Sunday
    expect(currentWeekEnding(new Date(2026, 4, 17))).toBe("2026-05-17");
  });

  it("returns the upcoming Sunday when today is Monday", () => {
    // 2026-05-18 is Monday → next Sunday is 2026-05-24
    expect(currentWeekEnding(new Date(2026, 4, 18))).toBe("2026-05-24");
  });

  it("returns the upcoming Sunday when today is Wednesday", () => {
    expect(currentWeekEnding(new Date(2026, 4, 20))).toBe("2026-05-24");
  });

  it("returns the upcoming Sunday when today is Saturday", () => {
    expect(currentWeekEnding(new Date(2026, 4, 23))).toBe("2026-05-24");
  });
});

describe("useWeeklyReview", () => {
  it("returns null when no review exists for this week", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(() => useWeeklyReview("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("returns the review when one exists", async () => {
    mockMaybeSingle.mockResolvedValue({ data: REVIEW, error: null });

    const { result } = renderHook(() => useWeeklyReview("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(REVIEW);
  });

  it("throws when query errors", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useWeeklyReview("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useWeeklyReview(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockMaybeSingle).not.toHaveBeenCalled();
  });

  it("queries the correct week when a specific date is provided", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    // 2026-05-18 is Monday — week ending is 2026-05-24
    const { result } = renderHook(
      () => useWeeklyReview("user-1", new Date(2026, 4, 18)),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMaybeSingle).toHaveBeenCalled();
  });

  it("does not run when userId is empty, even with a date provided", () => {
    const { result } = renderHook(
      () => useWeeklyReview("", new Date(2026, 4, 18)),
      { wrapper },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockMaybeSingle).not.toHaveBeenCalled();
  });
});
