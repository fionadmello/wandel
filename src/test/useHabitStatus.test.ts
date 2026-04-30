import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useResetBreakHabit,
  useUpdateHabitStatus,
} from "@/hooks/useHabitStatus";

const { mockHabitUpdate, mockObsDelete } = vi.hoisted(() => ({
  mockHabitUpdate: vi.fn(),
  mockObsDelete: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "habits") {
        return {
          update: () => ({
            eq: () => ({ select: () => ({ single: mockHabitUpdate }) }),
          }),
        };
      }
      if (table === "break_observations") {
        return { delete: () => ({ eq: mockObsDelete }) };
      }
    },
  },
}));

const HABIT = {
  id: "habit-1",
  user_id: "user-1",
  category: "break" as const,
  name: "My habit",
  status: "active" as const,
  paused_at: null,
  sort_order: 0,
  created_at: "",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useUpdateHabitStatus", () => {
  it("sets paused_at when pausing", async () => {
    mockHabitUpdate.mockResolvedValue({
      data: { ...HABIT, status: "paused" },
      error: null,
    });

    const { result } = renderHook(() => useUpdateHabitStatus("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", status: "paused" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("clears paused_at when deactivating", async () => {
    mockHabitUpdate.mockResolvedValue({
      data: { ...HABIT, status: "deactivated" },
      error: null,
    });

    const { result } = renderHook(() => useUpdateHabitStatus("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", status: "deactivated" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("throws when the update fails", async () => {
    mockHabitUpdate.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useUpdateHabitStatus("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", status: "paused" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useResetBreakHabit", () => {
  it("deletes all observations then resets status to active", async () => {
    mockObsDelete.mockResolvedValue({ error: null });
    mockHabitUpdate.mockResolvedValue({ data: HABIT, error: null });

    const { result } = renderHook(() => useResetBreakHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate("habit-1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockObsDelete).toHaveBeenCalled();
    expect(mockHabitUpdate).toHaveBeenCalled();
  });

  it("throws when observation delete fails", async () => {
    mockObsDelete.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useResetBreakHabit("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate("habit-1");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockHabitUpdate).not.toHaveBeenCalled();
  });
});
