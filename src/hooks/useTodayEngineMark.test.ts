import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTodayEngineMark } from "./useTodayEngineMark";

const { mockMaybySingle } = vi.hoisted(() => ({
  mockMaybySingle: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: mockMaybySingle,
          }),
        }),
      }),
    }),
  },
}));

const MARK = {
  id: "mark-1",
  user_id: "user-123",
  date: "2026-04-22",
  timer_completed: false,
  confirmed_at: "2026-04-22T08:00:00Z",
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

describe("useTodayEngineMark", () => {
  it("returns the engine mark when one exists today", async () => {
    mockMaybySingle.mockResolvedValue({ data: MARK, error: null });
    const { result } = renderHook(() => useTodayEngineMark("user-123"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(MARK);
  });

  it("returns null when no mark exists today", async () => {
    mockMaybySingle.mockResolvedValue({ data: null, error: null });
    const { result } = renderHook(() => useTodayEngineMark("user-123"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("does not run the query when userId is empty", async () => {
    const { result } = renderHook(() => useTodayEngineMark(""), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockMaybySingle).not.toHaveBeenCalled();
  });

  it("throws when the query returns an error", async () => {
    mockMaybySingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });
    const { result } = renderHook(() => useTodayEngineMark("user-123"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
