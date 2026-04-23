import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUpdateHabitJobs } from "./useUpdateHabitJobs";

const { mockDelete, mockInsert } = vi.hoisted(() => ({
  mockDelete: vi.fn(),
  mockInsert: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      delete: () => ({ eq: () => ({ eq: mockDelete }) }),
      insert: mockInsert,
    }),
  },
}));

const JOBS = [
  { name: "Stress relief", description: "Taking the edge off." },
  { name: "Boredom", description: "Filling the space." },
];

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useUpdateHabitJobs", () => {
  it("deletes existing configs then inserts new jobs", async () => {
    mockDelete.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useUpdateHabitJobs("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", jobs: JOBS });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDelete).toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalledWith(
      JOBS.map((job, i) => ({
        habit_id: "habit-1",
        key: "job",
        value: job.name,
        sub_type: job.description,
        sort_order: i,
      })),
    );
  });

  it("skips insert when jobs list is empty", async () => {
    mockDelete.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useUpdateHabitJobs("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", jobs: [] });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("throws when delete fails", async () => {
    mockDelete.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useUpdateHabitJobs("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", jobs: JOBS });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("throws when insert fails", async () => {
    mockDelete.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useUpdateHabitJobs("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ habitId: "habit-1", jobs: JOBS });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
