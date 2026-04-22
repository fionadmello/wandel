import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCompleteSetup } from "./useCompleteSetup";

const { mockUpdate, mockInsert, mockGetUser } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
  mockInsert: vi.fn(),
  mockGetUser: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { getUser: mockGetUser },
    from: (table: string) => ({
      update: () => ({ eq: mockUpdate }),
      insert: (rows: unknown) => mockInsert(table, rows),
    }),
  },
}));

const USER_ID = "user-123";

const DRAFT = {
  whyStatement: "I want to be better.",
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
  mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
  mockUpdate.mockResolvedValue({ error: null });
  mockInsert.mockResolvedValue({ error: null });
});

describe("useCompleteSetup", () => {
  it("updates the profile with why statement and setup_complete", async () => {
    const { result } = renderHook(() => useCompleteSetup(), { wrapper });
    act(() => result.current.mutate(DRAFT));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdate).toHaveBeenCalled();
  });

  it("inserts qualities with correct user_id and sort_order", async () => {
    const { result } = renderHook(() => useCompleteSetup(), { wrapper });
    act(() => result.current.mutate(DRAFT));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
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

  it("inserts reminders with correct user_id and sort_order", async () => {
    const { result } = renderHook(() => useCompleteSetup(), { wrapper });
    act(() => result.current.mutate(DRAFT));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
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

  it("throws when not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { result } = renderHook(() => useCompleteSetup(), { wrapper });
    act(() => result.current.mutate(DRAFT));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Not authenticated"));
  });

  it("throws when profile update fails", async () => {
    mockUpdate.mockResolvedValue({ error: { message: "DB error" } });
    const { result } = renderHook(() => useCompleteSetup(), { wrapper });
    act(() => result.current.mutate(DRAFT));
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
