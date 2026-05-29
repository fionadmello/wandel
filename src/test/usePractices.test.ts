import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useDeletePractice,
  usePractices,
  useSavePractice,
  useSeedDefaultPractices,
} from "@/hooks/usePractices";
import type { Practice } from "@/types/engine";

const { mockOrder, mockInsert, mockUpsert, mockSingle, mockDelete } =
  vi.hoisted(() => ({
    mockOrder: vi.fn(),
    mockInsert: vi.fn(),
    mockUpsert: vi.fn(),
    mockSingle: vi.fn(),
    mockDelete: vi.fn(),
  }));

vi.mock("@/lib/supabase", () => {
  const upsertResult = {
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
      mockUpsert().then(resolve, reject),
    select: () => ({ single: mockSingle }),
  };
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.order = mockOrder;
  builder.insert = () => ({
    then: (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
      mockInsert().then(resolve, reject),
  });
  builder.upsert = () => upsertResult;
  builder.delete = () => ({ eq: () => ({ eq: () => mockDelete() }) });
  return { supabase: { from: () => builder } };
});

const PRACTICE: Practice = {
  id: "p-1",
  user_id: "user-1",
  name: "Breath",
  description: "Four slow breaths.",
  is_default: true,
  active: true,
  created_at: "2026-05-01T00:00:00Z",
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("usePractices", () => {
  it("returns practices on success", async () => {
    mockOrder.mockResolvedValue({ data: [PRACTICE], error: null });

    const { result } = renderHook(() => usePractices("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([PRACTICE]);
  });

  it("returns empty array when no practices exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => usePractices("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("throws on error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const { result } = renderHook(() => usePractices("user-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => usePractices(""), { wrapper });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockOrder).not.toHaveBeenCalled();
  });
});

describe("useSeedDefaultPractices", () => {
  it("resolves without throwing on success", async () => {
    mockInsert.mockReturnValue(Promise.resolve({ error: null }));

    const { result } = renderHook(() => useSeedDefaultPractices("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("throws when insert errors", async () => {
    mockInsert.mockReturnValue(
      Promise.resolve({ error: { message: "DB error" } }),
    );

    const { result } = renderHook(() => useSeedDefaultPractices("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useSavePractice", () => {
  it("mutates successfully and resolves to the saved practice", async () => {
    mockSingle.mockResolvedValue({ data: PRACTICE, error: null });

    const { result } = renderHook(() => useSavePractice("user-1"), { wrapper });

    let resolved: Practice | undefined;
    await act(async () => {
      resolved = await result.current.mutateAsync({
        id: "p-1",
        name: "Breath",
        description: "Four slow breaths.",
        is_default: true,
        active: true,
      });
    });

    expect(resolved).toEqual(PRACTICE);
  });

  it("throws when upsert errors", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => useSavePractice("user-1"), { wrapper });

    await act(async () => {
      result.current.mutate({
        id: "p-1",
        name: "Breath",
        description: "Four slow breaths.",
        is_default: true,
        active: true,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useDeletePractice", () => {
  it("resolves without throwing on success", async () => {
    mockDelete.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useDeletePractice("user-1"), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync("p-1");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("throws when delete errors", async () => {
    mockDelete.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useDeletePractice("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate("p-1");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
