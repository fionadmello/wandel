import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useAddEvidence,
  useSelfWorthEvidence,
} from "@/hooks/useSelfWorthEvidence";
import type { Evidence } from "@/types/engine";

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

const EVIDENCE: Evidence = {
  id: "e-1",
  user_id: "user-1",
  date: "2026-05-22",
  timestamp: "2026-05-22T10:00:00Z",
  title: "Handled conflict well",
  situation: "Team meeting",
  what_i_did_well: "Stayed calm",
  tags: [],
  archived: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useSelfWorthEvidence", () => {
  it("returns entries on success", async () => {
    mockOrder.mockResolvedValue({ data: [EVIDENCE], error: null });

    const { result } = renderHook(() => useSelfWorthEvidence("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([EVIDENCE]);
  });

  it("returns empty array when no entries exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useSelfWorthEvidence("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws on error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => useSelfWorthEvidence("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => useSelfWorthEvidence(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});

describe("useAddEvidence", () => {
  it("mutates successfully and resolves to the created entry", async () => {
    mockSingle.mockResolvedValue({ data: EVIDENCE, error: null });

    const { result } = renderHook(() => useAddEvidence("user-1"), { wrapper });

    let resolved: Evidence | undefined;
    await act(async () => {
      resolved = await result.current.mutateAsync({
        date: "2026-05-22",
        title: "Handled conflict well",
        situation: "Team meeting",
        what_i_did_well: "Stayed calm",
      });
    });

    expect(resolved).toEqual(EVIDENCE);
  });

  it("throws when insert errors", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useAddEvidence("user-1"), { wrapper });

    await act(async () => {
      result.current.mutate({
        date: "2026-05-22",
        title: "Handled conflict well",
        situation: "Team meeting",
        what_i_did_well: "Stayed calm",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
