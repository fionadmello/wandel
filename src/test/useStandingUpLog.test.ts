import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useAllStandingUpEntries,
  useStandingUpEntries,
} from "@/hooks/useStandingUpLog";
import type { StandingUpEntry } from "@/types/database";

const { mockOrder } = vi.hoisted(() => ({ mockOrder: vi.fn() }));

vi.mock("@/lib/supabase", () => {
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.order = mockOrder;
  return { supabase: { from: () => builder } };
});

const ENGINE_ENTRY: StandingUpEntry = {
  id: "entry-1",
  user_id: "user-1",
  habit_id: null,
  track_type: "engine",
  track_name: "Mirror",
  fall_date: "2026-05-08",
  return_date: "2026-05-11",
  gap_days: 3,
  protocol: "slip",
  created_at: "2026-05-11T00:00:00Z",
};

const HABIT_ENTRY: StandingUpEntry = {
  id: "entry-2",
  user_id: "user-1",
  habit_id: "habit-1",
  track_type: "break",
  track_name: "Smoking",
  fall_date: "2026-05-10",
  return_date: "2026-05-11",
  gap_days: 1,
  protocol: "drift",
  created_at: "2026-05-11T00:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useStandingUpEntries", () => {
  it("returns empty array when no entries exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(
      () => useStandingUpEntries("user-1", "engine"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("returns entries for engine track without habitId filter", async () => {
    mockOrder.mockResolvedValue({ data: [ENGINE_ENTRY], error: null });

    const { result } = renderHook(
      () => useStandingUpEntries("user-1", "engine"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([ENGINE_ENTRY]);
  });

  it("returns entries filtered by habitId for break track", async () => {
    mockOrder.mockResolvedValue({ data: [HABIT_ENTRY], error: null });

    const { result } = renderHook(
      () => useStandingUpEntries("user-1", "break", "habit-1"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([HABIT_ENTRY]);
  });

  it("throws when query errors", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(
      () => useStandingUpEntries("user-1", "engine"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useStandingUpEntries("", "engine"), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});

describe("useAllStandingUpEntries", () => {
  it("returns all entries across tracks", async () => {
    mockOrder.mockResolvedValue({
      data: [ENGINE_ENTRY, HABIT_ENTRY],
      error: null,
    });

    const { result } = renderHook(() => useAllStandingUpEntries("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([ENGINE_ENTRY, HABIT_ENTRY]);
  });

  it("returns empty array when no entries exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useAllStandingUpEntries("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws when query errors", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useAllStandingUpEntries("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useAllStandingUpEntries(""), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});
