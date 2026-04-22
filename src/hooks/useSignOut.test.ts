import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSignOut } from "./useSignOut";

const { mockSignOut } = vi.hoisted(() => ({
  mockSignOut: vi.fn(),
}));

const mockInvalidate = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { signOut: mockSignOut },
  },
}));

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ invalidate: mockInvalidate }),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockSignOut.mockResolvedValue({ error: null });
  mockInvalidate.mockResolvedValue(undefined);
});

describe("useSignOut", () => {
  it("calls supabase.auth.signOut", async () => {
    const { result } = renderHook(() => useSignOut(), { wrapper });
    act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it("invalidates the router on success", async () => {
    const { result } = renderHook(() => useSignOut(), { wrapper });
    act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockInvalidate).toHaveBeenCalledOnce();
  });

  it("throws when signOut returns an error", async () => {
    mockSignOut.mockResolvedValue({ error: { message: "Sign out failed" } });
    const { result } = renderHook(() => useSignOut(), { wrapper });
    act(() => result.current.mutate());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
