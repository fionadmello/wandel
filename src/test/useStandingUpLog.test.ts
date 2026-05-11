import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogStandingUp } from "@/hooks/useStandingUpLog";

const { mockSingle } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      insert: () => ({ select: () => ({ single: mockSingle }) }),
    }),
  },
}));

const PAYLOAD = {
  track_type: "engine" as const,
  track_name: "Mirror",
  protocol: "slip" as const,
  habit_id: null,
  gap_days: 4,
  fall_date: "2026-05-07",
  return_date: "2026-05-11",
};

const ENTRY = {
  id: "entry-1",
  user_id: "user-1",
  ...PAYLOAD,
  created_at: "2026-05-11T00:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useLogStandingUp", () => {
  it("inserts with correct payload including user_id", async () => {
    mockSingle.mockResolvedValue({ data: ENTRY, error: null });

    const { result } = renderHook(() => useLogStandingUp("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(PAYLOAD);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(ENTRY);
  });

  it("throws when insert errors", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useLogStandingUp("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(PAYLOAD);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
