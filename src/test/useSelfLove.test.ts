import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogSelfLove, useSelfLoveEntries } from "@/hooks/useSelfLove";
import type { SelfLoveEntry } from "@/types/engine";

const { mockOrder, mockSingle } = vi.hoisted(() => ({
  mockOrder: vi.fn(),
  mockSingle: vi.fn(),
}));

vi.mock("@/lib/supabase", () => {
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.order = mockOrder;
  builder.insert = () => builder;
  builder.single = mockSingle;
  return { supabase: { from: () => builder } };
});

const SELF_LOVE_ENTRY: SelfLoveEntry = {
  id: "sl-1",
  user_id: "user-1",
  date: "2026-05-22",
  timestamp: "2026-05-22T09:00:00Z",
  practice: "Breath",
  practice_id: "p-uuid-1",
  felt: 7,
  note: null,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useSelfLoveEntries", () => {
  it("returns entries on success", async () => {
    mockOrder.mockResolvedValue({ data: [SELF_LOVE_ENTRY], error: null });

    const { result } = renderHook(() => useSelfLoveEntries("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([SELF_LOVE_ENTRY]);
  });

  it("returns empty array when no entries exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useSelfLoveEntries("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws on error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useSelfLoveEntries("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useSelfLoveEntries(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});

describe("useLogSelfLove", () => {
  it("mutates successfully and resolves to the created entry", async () => {
    mockSingle.mockResolvedValue({ data: SELF_LOVE_ENTRY, error: null });

    const { result } = renderHook(() => useLogSelfLove("user-1"), { wrapper });

    let resolved: SelfLoveEntry | undefined;
    await act(async () => {
      resolved = await result.current.mutateAsync({
        date: "2026-05-22",
        practice: "Breath",
        practice_id: "p-uuid-1",
        felt: 7,
        note: null,
      });
    });

    expect(resolved).toEqual(SELF_LOVE_ENTRY);
  });

  it("throws when insert errors", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useLogSelfLove("user-1"), { wrapper });

    await act(async () => {
      result.current.mutate({
        date: "2026-05-22",
        practice: "Breath",
        practice_id: "p-uuid-1",
        felt: 7,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
