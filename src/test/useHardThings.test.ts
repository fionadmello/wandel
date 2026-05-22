import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHardThings, useLogHardThing } from "@/hooks/useHardThings";
import type { HardThing } from "@/types/engine";

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

const HARD_THING: HardThing = {
  id: "ht-1",
  user_id: "user-1",
  date: "2026-05-22",
  timestamp: "2026-05-22T08:00:00Z",
  what: "Cold shower",
  before: 3,
  during: 5,
  after: 8,
  note: null,
  linked_intention: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useHardThings", () => {
  it("returns entries on success", async () => {
    mockOrder.mockResolvedValue({ data: [HARD_THING], error: null });

    const { result } = renderHook(() => useHardThings("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([HARD_THING]);
  });

  it("returns empty array when no entries exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useHardThings("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws on error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useHardThings("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useHardThings(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});

describe("useLogHardThing", () => {
  it("mutates successfully and resolves to the created entry", async () => {
    mockSingle.mockResolvedValue({ data: HARD_THING, error: null });

    const { result } = renderHook(() => useLogHardThing("user-1"), { wrapper });

    let resolved: HardThing | undefined;
    await act(async () => {
      resolved = await result.current.mutateAsync({
        date: "2026-05-22",
        what: "Cold shower",
        before: 3,
        during: 5,
        after: 8,
        note: null,
        linked_intention: false,
      });
    });

    expect(resolved).toEqual(HARD_THING);
  });

  it("throws when insert errors", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useLogHardThing("user-1"), { wrapper });

    await act(async () => {
      result.current.mutate({
        date: "2026-05-22",
        what: "Cold shower",
        before: 3,
        during: 5,
        after: 8,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
