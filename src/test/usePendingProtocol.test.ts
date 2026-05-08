import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useClearPendingProtocol,
  usePendingProtocol,
  useSetPendingProtocol,
} from "@/hooks/usePendingProtocol";
import type { PendingProtocolRow } from "@/types/database";
import type { PendingProtocol } from "@/types/protocols";

const { mockMaybeSingle, mockUpsert, mockDelete } = vi.hoisted(() => ({
  mockMaybySingle: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockUpsert: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }),
      upsert: mockUpsert,
      delete: () => ({ eq: mockDelete }),
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

describe("usePendingProtocol", () => {
  it("returns null when no row exists", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const { result } = renderHook(() => usePendingProtocol("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("maps the db row to PendingProtocol", async () => {
    mockMaybeSingle.mockResolvedValue({ data: ROW, error: null });

    const { result } = renderHook(() => usePendingProtocol("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(PROTOCOL);
  });

  it("throws when query errors", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const { result } = renderHook(() => usePendingProtocol("user-1"), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not run when userId is empty", () => {
    const { result } = renderHook(() => usePendingProtocol(""), { wrapper });
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockMaybeSingle).not.toHaveBeenCalled();
  });
});

describe("useSetPendingProtocol", () => {
  it("upserts the correct row shape", async () => {
    mockUpsert.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useSetPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(PROTOCOL);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpsert).toHaveBeenCalledWith(
      {
        user_id: "user-1",
        protocol_id: "habit_drift",
        habit_id: "habit-1",
        track_type: "build",
        track_name: "Running",
        drift_days: 3,
        current_step: 1,
      },
      { onConflict: "user_id" },
    );
  });

  it("throws when upsert errors", async () => {
    mockUpsert.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useSetPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate(PROTOCOL);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useClearPendingProtocol", () => {
  it("deletes the row for the user", async () => {
    mockDelete.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useClearPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDelete).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("throws when delete errors", async () => {
    mockDelete.mockResolvedValue({ error: { message: "DB error" } });

    const { result } = renderHook(() => useClearPendingProtocol("user-1"), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
