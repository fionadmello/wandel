import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAddBuildHabit, useBuildHabits } from "@/hooks/useBuildHabits";

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
            eq: () => ({ eq: () => ({ order: mockOrder }) }),
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

const HABIT = {
  id: "habit-1",
  user_id: "user-1",
  category: "build" as const,
  name: "Yoga",
  status: "active" as const,
  paused_at: null,
  sort_order: 0,
  created_at: "",
  configs: [],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useBuildHabits", () => {
  it("returns build habits for the user", async () => {
    mockOrder.mockResolvedValue({ data: [HABIT], error: null });

    const { result } = renderHook(() => useBuildHabits("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([HABIT]);
  });

  it("returns empty array when no habits exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useBuildHabits("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useBuildHabits(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });

  it("throws when the query returns an error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useBuildHabits("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useAddBuildHabit", () => {
  const CONFIGS = [
    {
      subType: "Yoga",
      anchor: "After morning coffee",
      nonNegotiable: "5 sun salutations",
      minimumVersion: "20 min flow",
      fullVersion: "60 min session",
    },
  ];

  it("inserts the habit and its config rows", async () => {
    mockHabitSingle.mockResolvedValue({ data: HABIT, error: null });
    mockConfigInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAddBuildHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ name: "My habit", configs: CONFIGS });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockConfigInsert).toHaveBeenCalledWith([
      {
        habit_id: "habit-1",
        key: "anchor",
        value: CONFIGS[0].anchor,
        sub_type: "Yoga",
        sort_order: 0,
      },
      {
        habit_id: "habit-1",
        key: "non_negotiable",
        value: CONFIGS[0].nonNegotiable,
        sub_type: "Yoga",
        sort_order: 1,
      },
      {
        habit_id: "habit-1",
        key: "minimum_version",
        value: CONFIGS[0].minimumVersion,
        sub_type: "Yoga",
        sort_order: 2,
      },
      {
        habit_id: "habit-1",
        key: "full_version",
        value: CONFIGS[0].fullVersion,
        sub_type: "Yoga",
        sort_order: 3,
      },
    ]);
  });

  it("throws when habit insert fails and does not insert configs", async () => {
    mockHabitSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useAddBuildHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ name: "My habit", configs: CONFIGS });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockConfigInsert).not.toHaveBeenCalled();
  });
});
