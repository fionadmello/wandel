import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useDailyIntention,
  useUpsertDailyIntention,
} from "@/hooks/useDailyIntention";
import type { DailyIntention } from "@/types/engine";

const { mockMaybySingle, mockSingle } = vi.hoisted(() => ({
  mockMaybySingle: vi.fn(),
  mockSingle: vi.fn(),
}));

vi.mock("@/lib/supabase", () => {
  const upsertChain = { select: () => ({ single: mockSingle }) };
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.maybeSingle = mockMaybySingle;
  builder.upsert = () => upsertChain;
  return { supabase: { from: () => builder } };
});

const INTENTION: DailyIntention = {
  user_id: "user-1",
  date: "2026-05-22",
  hard_task: "Write the spec",
  updated_at: "2026-05-22T08:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useDailyIntention", () => {
  it("returns intention when row exists", async () => {
    mockMaybySingle.mockResolvedValue({ data: INTENTION, error: null });

    const { result } = renderHook(
      () => useDailyIntention("user-1", "2026-05-22"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(INTENTION);
  });

  it("returns null when no row exists", async () => {
    mockMaybySingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(
      () => useDailyIntention("user-1", "2026-05-22"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("throws on error", async () => {
    mockMaybySingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(
      () => useDailyIntention("user-1", "2026-05-22"),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useDailyIntention("", "2026-05-22"), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockMaybySingle).not.toHaveBeenCalled();
  });
});

describe("useUpsertDailyIntention", () => {
  it("mutates successfully and resolves to the upserted intention", async () => {
    mockSingle.mockResolvedValue({ data: INTENTION, error: null });

    const { result } = renderHook(() => useUpsertDailyIntention("user-1"), {
      wrapper,
    });

    let resolved: DailyIntention | undefined;
    await act(async () => {
      resolved = await result.current.mutateAsync({
        date: "2026-05-22",
        hard_task: "Write the spec",
      });
    });

    expect(resolved).toEqual(INTENTION);
  });

  it("throws when upsert errors", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useUpsertDailyIntention("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        date: "2026-05-22",
        hard_task: "Write the spec",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
