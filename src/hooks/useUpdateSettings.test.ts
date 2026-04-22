import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUpdateSettings } from "./useUpdateSettings";

const { mockUpdateEq, mockDeleteEq, mockInsert } = vi.hoisted(() => ({
  mockUpdateEq: vi.fn(),
  mockDeleteEq: vi.fn(),
  mockInsert: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => ({
      update: () => ({ eq: mockUpdateEq }),
      delete: () => ({
        eq: (col: string, val: string) => mockDeleteEq(table, col, val),
      }),
      insert: (rows: unknown) => mockInsert(table, rows),
    }),
  },
}));

const USER_ID = "user-123";

const SETTINGS = {
  userId: USER_ID,
  whyStatement: "I want to grow.",
  qualities: ["Resilient", "Calm"],
  reminders: ["You are enough."],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUpdateEq.mockResolvedValue({ error: null });
  mockDeleteEq.mockResolvedValue({ error: null });
  mockInsert.mockResolvedValue({ error: null });
});

describe("useUpdateSettings", () => {
  it("updates the profile why_statement", async () => {
    const { result } = renderHook(() => useUpdateSettings(), { wrapper });
    act(() => result.current.mutate(SETTINGS));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateEq).toHaveBeenCalled();
  });

  it("deletes and re-inserts qualities with correct sort_order", async () => {
    const { result } = renderHook(() => useUpdateSettings(), { wrapper });
    act(() => result.current.mutate(SETTINGS));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeleteEq).toHaveBeenCalledWith(
      "profile_qualities",
      "user_id",
      USER_ID,
    );
    expect(mockInsert).toHaveBeenCalledWith(
      "profile_qualities",
      expect.arrayContaining([
        expect.objectContaining({
          user_id: USER_ID,
          value: "Resilient",
          sort_order: 0,
        }),
        expect.objectContaining({
          user_id: USER_ID,
          value: "Calm",
          sort_order: 1,
        }),
      ]),
    );
  });

  it("deletes and re-inserts reminders with correct sort_order", async () => {
    const { result } = renderHook(() => useUpdateSettings(), { wrapper });
    act(() => result.current.mutate(SETTINGS));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockDeleteEq).toHaveBeenCalledWith(
      "profile_reminders",
      "user_id",
      USER_ID,
    );
    expect(mockInsert).toHaveBeenCalledWith(
      "profile_reminders",
      expect.arrayContaining([
        expect.objectContaining({
          user_id: USER_ID,
          value: "You are enough.",
          sort_order: 0,
        }),
      ]),
    );
  });

  it("skips qualities insert when array is empty", async () => {
    const { result } = renderHook(() => useUpdateSettings(), { wrapper });
    act(() => result.current.mutate({ ...SETTINGS, qualities: [] }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInsert).not.toHaveBeenCalledWith(
      "profile_qualities",
      expect.anything(),
    );
  });

  it("throws when profile update fails", async () => {
    mockUpdateEq.mockResolvedValue({ error: { message: "DB error" } });
    const { result } = renderHook(() => useUpdateSettings(), { wrapper });
    act(() => result.current.mutate(SETTINGS));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
