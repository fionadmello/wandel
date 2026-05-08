import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import React from "react";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useProtocolDetection } from "@/hooks/useProtocolDetection";
import type { Profile } from "@/types/database";
import type { PendingProtocol } from "@/types/protocols";

vi.mock("@/hooks/usePendingProtocol");
vi.mock("@/hooks/useBreakHabits");
vi.mock("@/hooks/useBuildHabits");
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          gte: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  },
}));

import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import { usePendingProtocol } from "@/hooks/usePendingProtocol";

const TODAY = "2026-05-08";

const PENDING: PendingProtocol = {
  id: "habit_drift",
  habitId: "habit-1",
  trackType: "build",
  trackName: "Running",
  driftDays: 3,
  currentStep: 1,
};

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    why_statement: null,
    reminder_index: 0,
    reminder_last_rotated: null,
    setup_complete: true,
    last_protocol_check: null,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(TODAY));
});

afterAll(() => vi.useRealTimers());

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useBreakHabits).mockReturnValue({
    data: [],
    isSuccess: true,
  } as unknown as ReturnType<typeof useBreakHabits>);
  vi.mocked(useBuildHabits).mockReturnValue({
    data: [],
    isSuccess: true,
  } as unknown as ReturnType<typeof useBuildHabits>);
});

describe("useProtocolDetection", () => {
  it("returns null immediately when already checked today", () => {
    const profile = makeProfile({ last_protocol_check: TODAY });
    vi.mocked(usePendingProtocol).mockReturnValue({
      data: null,
      isSuccess: true,
    } as unknown as ReturnType<typeof usePendingProtocol>);

    const { result } = renderHook(
      () => useProtocolDetection("user-1", profile),
      { wrapper },
    );

    expect(result.current.protocol).toBeNull();
    expect(result.current.isChecking).toBe(false);
  });

  it("returns the pending protocol when one exists in Supabase", () => {
    const profile = makeProfile({ last_protocol_check: null });
    vi.mocked(usePendingProtocol).mockReturnValue({
      data: PENDING,
      isSuccess: true,
    } as unknown as ReturnType<typeof usePendingProtocol>);

    const { result } = renderHook(
      () => useProtocolDetection("user-1", profile),
      { wrapper },
    );

    expect(result.current.protocol).toEqual(PENDING);
    expect(result.current.isChecking).toBe(false);
  });

  it("returns null and isChecking while pending protocol query is loading", () => {
    const profile = makeProfile({ last_protocol_check: null });
    vi.mocked(usePendingProtocol).mockReturnValue({
      data: undefined,
      isSuccess: false,
    } as unknown as ReturnType<typeof usePendingProtocol>);

    const { result } = renderHook(
      () => useProtocolDetection("user-1", profile),
      { wrapper },
    );

    expect(result.current.protocol).toBeNull();
    expect(result.current.isChecking).toBe(true);
  });
});
