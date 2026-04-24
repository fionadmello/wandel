import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAddBreakHabit, useBreakHabits } from "@/hooks/useBreakHabits";

const { mockOrder, mockHabitSingle, mockConfigInsert } = vi.hoisted(() => ({
  mockOrder: vi.fn(),
  mockHabitSingle: vi.fn(),
  mockConfigInsert: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "habits") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({ order: mockOrder }),
            }),
          }),
          insert: () => ({ select: () => ({ single: mockHabitSingle }) }),
        };
      }
      if (table === "habit_configs") {
        return { insert: mockConfigInsert };
      }
    },
  },
}));

const HABIT: ReturnType<typeof makeHabit> = makeHabit();

function makeHabit(overrides = {}) {
  return {
    id: "habit-1",
    user_id: "user-1",
    category: "break" as const,
    name: "Smoking",
    status: "active" as const,
    paused_at: null,
    sort_order: 0,
    created_at: "",
    configs: [],
    ...overrides,
  };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useBreakHabits", () => {
  it("returns break habits for the user", async () => {
    mockOrder.mockResolvedValue({ data: [HABIT], error: null });

    const { result } = renderHook(() => useBreakHabits("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([HABIT]);
  });

  it("returns empty array when no habits exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useBreakHabits("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useBreakHabits(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });

  it("throws when the query returns an error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useBreakHabits("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useAddBreakHabit", () => {
  const JOBS = [
    { name: "Stress relief", description: "Taking the edge off." },
    { name: "Boredom", description: "Filling the space." },
  ];

  it("inserts the habit and its job configs", async () => {
    mockHabitSingle.mockResolvedValue({ data: HABIT, error: null });
    mockConfigInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAddBreakHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ name: "Smoking", jobs: JOBS });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockHabitSingle).toHaveBeenCalled();
    expect(mockConfigInsert).toHaveBeenCalledWith(
      JOBS.map((job, i) => ({
        habit_id: "habit-1",
        key: "job",
        value: job.name,
        sub_type: job.description,
        sort_order: i,
      })),
    );
  });

  it("skips config insert when no jobs provided", async () => {
    mockHabitSingle.mockResolvedValue({ data: HABIT, error: null });

    const { result } = renderHook(() => useAddBreakHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ name: "Smoking", jobs: [] });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockConfigInsert).not.toHaveBeenCalled();
  });

  it("throws when habit insert fails", async () => {
    mockHabitSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useAddBreakHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ name: "Smoking", jobs: JOBS });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
