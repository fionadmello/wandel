import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useClearPendingProtocol,
  usePendingProtocols,
  useSetPendingProtocols,
} from "@/hooks/usePendingProtocol";
import type { PendingProtocolRow } from "@/types/database";
import type { PendingProtocol } from "@/types/protocols";

const { mockSelect, mockUpsert, mockDeleteEq } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
  mockUpsert: vi.fn(),
  mockDeleteEq: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: mockSelect,
      upsert: mockUpsert,
      delete: () => ({ eq: () => ({ eq: mockDeleteEq }) }),
    }),
  },
}));

const ROW: PendingProtocolRow = {
  user_id: "user-1",
  protocol_id: "habit_drift",
  habit_id: "habit-1",
  track_type: "build",
  track_name: "Running",
  drift_days: 3,
  current_step: 1,
  track_key: "habit-1",
  created_at: "2026-05-08T00:00:00Z",
};

const PROTOCOL: PendingProtocol = {
  id: "habit_drift",
  habitId: "habit-1",
  trackType: "build",
  trackName: "Running",
  driftDays: 3,
  currentStep: 1,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("usePendingProtocols", () => {
  it("returns empty array when no rows exist", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    });

    const { result } = renderHook(() => usePendingProtocols("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("maps db rows to PendingProtocol array", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        order: () => Promise.resolve({ data: [ROW], error: null }),
      }),
    });

    const { result } = renderHook(() => usePendingProtocols("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([PROTOCOL]);
  });

  it("throws when query errors", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        order: () =>
          Promise.resolve({ data: null, error: { message: "DB error" } }),
      }),
    });

    const { result } = renderHook(() => usePendingProtocols("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => usePendingProtocols(""), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockSelect).not.toHaveBeenCalled();
  });
});

describe("useSetPendingProtocols", () => {
  it("upserts all protocols with correct shape", async () => {
    mockUpsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useSetPendingProtocols("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate([PROTOCOL]);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpsert).toHaveBeenCalledWith(
      [
        {
          user_id: "user-1",
          protocol_id: "habit_drift",
          habit_id: "habit-1",
          track_type: "build",
          track_name: "Running",
          drift_days: 3,
          current_step: 1,
        },
      ],
      { onConflict: "user_id,track_key" },
    );
  });

  it("skips the upsert when given an empty array", async () => {
    const { result } = renderHook(() => useSetPendingProtocols("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate([]);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("throws when upsert errors", async () => {
    mockUpsert.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useSetPendingProtocols("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate([PROTOCOL]);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useClearPendingProtocol", () => {
  it("deletes by user_id and track_key (habitId for habits)", async () => {
    mockDeleteEq.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useClearPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(PROTOCOL);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeleteEq).toHaveBeenCalledWith("track_key", "habit-1");
  });

  it("uses protocol id as track_key for engine protocols", async () => {
    mockDeleteEq.mockResolvedValue({ error: null });

    const engineProtocol: PendingProtocol = {
      id: "engine_slip",
      habitId: null,
      trackType: "engine",
      trackName: "Mirror",
      driftDays: 3,
      currentStep: 0,
    };

    const { result } = renderHook(() => useClearPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(engineProtocol);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeleteEq).toHaveBeenCalledWith("track_key", "engine_slip");
  });

  it("throws when delete errors", async () => {
    mockDeleteEq.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useClearPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(PROTOCOL);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
