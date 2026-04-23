import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useReminderRotation } from "./useReminderRotation";

const mockUpdateProfile = vi.fn();

vi.mock("./useProfile", () => ({
  useProfile: vi.fn(),
  useProfileReminders: vi.fn(),
  useUpdateProfile: vi.fn(() => ({ mutate: mockUpdateProfile })),
}));

import { useProfile, useProfileReminders } from "./useProfile";

const TODAY = "2026-04-23";

const REMINDERS = [
  {
    id: "r1",
    user_id: "user-1",
    value: "Reminder A",
    sort_order: 0,
    created_at: "",
  },
  {
    id: "r2",
    user_id: "user-1",
    value: "Reminder B",
    sort_order: 1,
    created_at: "",
  },
  {
    id: "r3",
    user_id: "user-1",
    value: "Reminder C",
    sort_order: 2,
    created_at: "",
  },
];

function makeProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    why_statement: null,
    reminder_index: 0,
    reminder_last_rotated: TODAY,
    setup_complete: true,
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(TODAY));
  vi.clearAllMocks();
  vi.mocked(useProfile).mockReturnValue({
    data: makeProfile(),
    isLoading: false,
  } as ReturnType<typeof useProfile>);
  vi.mocked(useProfileReminders).mockReturnValue({
    data: REMINDERS,
    isLoading: false,
  } as ReturnType<typeof useProfileReminders>);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useReminderRotation", () => {
  it("returns null while data is loading", () => {
    vi.mocked(useProfile).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useProfile>);
    vi.mocked(useProfileReminders).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useProfileReminders>);

    const { result } = renderHook(() => useReminderRotation("user-1"));

    expect(result.current).toBeNull();
  });

  it("returns the current reminder without rotating when last rotated today", () => {
    vi.mocked(useProfile).mockReturnValue({
      data: makeProfile({ reminder_index: 1, reminder_last_rotated: TODAY }),
      isLoading: false,
    } as ReturnType<typeof useProfile>);

    const { result } = renderHook(() => useReminderRotation("user-1"));

    expect(result.current).toBe("Reminder B");
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("does not rotate when last rotated 2 days ago", () => {
    vi.mocked(useProfile).mockReturnValue({
      data: makeProfile({
        reminder_index: 0,
        reminder_last_rotated: "2026-04-21",
      }),
      isLoading: false,
    } as ReturnType<typeof useProfile>);

    const { result } = renderHook(() => useReminderRotation("user-1"));

    expect(result.current).toBe("Reminder A");
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("rotates when last rotated 3 days ago", async () => {
    vi.mocked(useProfile).mockReturnValue({
      data: makeProfile({
        reminder_index: 0,
        reminder_last_rotated: "2026-04-20",
      }),
      isLoading: false,
    } as ReturnType<typeof useProfile>);

    renderHook(() => useReminderRotation("user-1"));

    await waitFor(() =>
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        reminder_index: 1,
        reminder_last_rotated: TODAY,
      }),
    );
  });

  it("rotates when reminder_last_rotated is null", async () => {
    vi.mocked(useProfile).mockReturnValue({
      data: makeProfile({ reminder_index: 0, reminder_last_rotated: null }),
      isLoading: false,
    } as ReturnType<typeof useProfile>);

    renderHook(() => useReminderRotation("user-1"));

    await waitFor(() =>
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        reminder_index: 1,
        reminder_last_rotated: TODAY,
      }),
    );
  });

  it("wraps the index correctly when at the end of the list", async () => {
    vi.mocked(useProfile).mockReturnValue({
      data: makeProfile({
        reminder_index: 2,
        reminder_last_rotated: "2026-04-20",
      }),
      isLoading: false,
    } as ReturnType<typeof useProfile>);

    renderHook(() => useReminderRotation("user-1"));

    await waitFor(() =>
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        reminder_index: 0,
        reminder_last_rotated: TODAY,
      }),
    );
  });
});
