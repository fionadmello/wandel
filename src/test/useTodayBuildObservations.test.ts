import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTodayBuildObservations } from "@/hooks/useTodayBuildObservations";

const { mockSelect } = vi.hoisted(() => ({ mockSelect: vi.fn() }));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: mockSelect,
        }),
      }),
    }),
  },
}));

const OBSERVATION = {
  id: "obs-1",
  habit_id: "habit-1",
  user_id: "user-1",
  date: "2026-04-23",
  sub_type: null,
  mark_type: "full" as const,
  mark_label: "Full session",
  note: null,
  logged_at: "2026-04-23T08:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTodayBuildObservations", () => {
  it("returns observations for today", async () => {
    mockSelect.mockResolvedValue({ data: [OBSERVATION], error: null });

    const { result } = renderHook(() => useTodayBuildObservations("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([OBSERVATION]);
  });

  it("returns an empty array when no observations exist today", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useTodayBuildObservations("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useTodayBuildObservations(""), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockSelect).not.toHaveBeenCalled();
  });

  it("throws when the query returns an error", async () => {
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useTodayBuildObservations("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
