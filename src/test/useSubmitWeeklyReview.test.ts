import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSubmitWeeklyReview } from "@/hooks/useSubmitWeeklyReview";
import type { SubmitWeeklyReviewPayload } from "@/types/review";

const { mockReviewSingle, mockHabitsInsert } = vi.hoisted(() => ({
  mockReviewSingle: vi.fn(),
  mockHabitsInsert: vi.fn(),
}));

vi.mock("@/lib/supabase", () => {
  const reviewBuilder: Record<string, unknown> = {};
  const insertReturn: Record<string, unknown> = {};
  insertReturn.select = () => insertReturn;
  insertReturn.single = mockReviewSingle;
  reviewBuilder.insert = () => insertReturn;

  const habitsBuilder: Record<string, unknown> = {};
  habitsBuilder.insert = mockHabitsInsert;

  return {
    supabase: {
      from: (table: string) =>
        table === "weekly_reviews" ? reviewBuilder : habitsBuilder,
    },
  };
});

const PAYLOAD: SubmitWeeklyReviewPayload = {
  weekEnding: "2026-05-17",
  engineResponse: "Showed up every day.",
  prideNote: "Stood back up after the slip.",
  selfRatedConsistency: 4,
  habitResponses: [
    {
      habitId: "habit-1",
      whatDone: "Did the thing",
      whatGotInWay: "Tiredness",
      adjustment: "Earlier bedtime",
    },
  ],
};

const REVIEW_ROW = {
  id: "review-1",
  user_id: "user-1",
  week_ending: "2026-05-17",
  engine_response: "Showed up every day.",
  pride_note: "Stood back up after the slip.",
  self_rated_consistency: 4,
  created_at: "2026-05-17T10:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useSubmitWeeklyReview", () => {
  it("inserts the review row then the habit rows", async () => {
    mockReviewSingle.mockResolvedValue({ data: REVIEW_ROW, error: null });
    mockHabitsInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useSubmitWeeklyReview("user-1"), {
      wrapper,
    });

    act(() => result.current.mutate(PAYLOAD));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockReviewSingle).toHaveBeenCalledOnce();
    expect(mockHabitsInsert).toHaveBeenCalledOnce();
  });

  it("throws when the review insert errors", async () => {
    mockReviewSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useSubmitWeeklyReview("user-1"), {
      wrapper,
    });

    act(() => result.current.mutate(PAYLOAD));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockHabitsInsert).not.toHaveBeenCalled();
  });

  it("throws when the habits insert errors", async () => {
    mockReviewSingle.mockResolvedValue({ data: REVIEW_ROW, error: null });
    mockHabitsInsert.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useSubmitWeeklyReview("user-1"), {
      wrapper,
    });

    act(() => result.current.mutate(PAYLOAD));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("submits with null prideNote when no standing up occurred", async () => {
    mockReviewSingle.mockResolvedValue({ data: REVIEW_ROW, error: null });
    mockHabitsInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useSubmitWeeklyReview("user-1"), {
      wrapper,
    });

    act(() =>
      result.current.mutate({
        ...PAYLOAD,
        prideNote: null,
        habitResponses: [],
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
