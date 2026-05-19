import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useWeeklyReviewHistory } from "@/hooks/useWeeklyReviewHistory";
import type { WeeklyReviewWithHabits } from "@/types/database";

const { mockOrder } = vi.hoisted(() => ({ mockOrder: vi.fn() }));

vi.mock("@/lib/supabase", () => {
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.order = mockOrder;
  return { supabase: { from: () => builder } };
});

const REVIEW: WeeklyReviewWithHabits = {
  id: "review-1",
  user_id: "user-1",
  week_ending: "2026-05-17",
  engine_response: "Solid week.",
  pride_note: null,
  self_rated_consistency: 4,
  created_at: "2026-05-17T10:00:00Z",
  habit_reviews: [
    {
      id: "hr-1",
      review_id: "review-1",
      habit_id: "habit-1",
      what_done: "Did the thing",
      what_got_in_way: "Tiredness",
      adjustment: "Earlier bedtime",
      created_at: "2026-05-17T10:00:00Z",
    },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useWeeklyReviewHistory", () => {
  it("returns all reviews with habit data", async () => {
    mockOrder.mockResolvedValue({ data: [REVIEW], error: null });

    const { result } = renderHook(() => useWeeklyReviewHistory("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([REVIEW]);
  });

  it("returns empty array when no reviews exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useWeeklyReviewHistory("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws when query errors", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useWeeklyReviewHistory("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useWeeklyReviewHistory(""), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});
