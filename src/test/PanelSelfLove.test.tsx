import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PanelSelfLove } from "@/features/engine/PanelSelfLove";
import { usePractices, useSeedDefaultPractices } from "@/hooks/usePractices";
import { useSelfLoveEntries } from "@/hooks/useSelfLove";
import type { Practice, SelfLoveEntry } from "@/types/engine";

const PRACTICE: Practice = {
  id: "p-1",
  user_id: "user-1",
  name: "Breath",
  description: "Four slow breaths.",
  is_default: true,
  active: true,
  created_at: "2026-05-01T00:00:00Z",
};

function makeEntry(n: number): SelfLoveEntry {
  return {
    id: `sl-${n}`,
    user_id: "user-1",
    date: "2026-05-27",
    timestamp: `2026-05-27T0${n}:00:00Z`,
    practice: `Practice ${n}`,
    practice_id: "p-1",
    felt: 7,
    note: null,
  };
}

const mockSeedMutate = vi.fn();

vi.mock("@/hooks/useSelfLove", () => ({
  useSelfLoveEntries: vi.fn(() => ({ data: [] })),
  useLogSelfLove: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock("@/hooks/usePractices", () => ({
  usePractices: vi.fn(() => ({ data: [PRACTICE] })),
  useSeedDefaultPractices: vi.fn(() => ({
    mutate: mockSeedMutate,
    isPending: false,
    isSuccess: false,
  })),
  useSavePractice: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useDeletePractice: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

type EntriesResult = ReturnType<typeof useSelfLoveEntries>;
type PracticesResult = ReturnType<typeof usePractices>;
type SeedResult = ReturnType<typeof useSeedDefaultPractices>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useSelfLoveEntries).mockReturnValue({
    data: [],
  } as unknown as EntriesResult);
  vi.mocked(usePractices).mockReturnValue({
    data: [PRACTICE],
  } as unknown as PracticesResult);
  vi.mocked(useSeedDefaultPractices).mockReturnValue({
    mutate: mockSeedMutate,
    isPending: false,
    isSuccess: false,
  } as unknown as SeedResult);
});

describe("PanelSelfLove", () => {
  it("renders the panel header title", () => {
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    expect(screen.getByText("Self-Love")).toBeTruthy();
  });

  it("renders the Edit link", () => {
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  it("shows top 4 entries and not the 5th", () => {
    vi.mocked(useSelfLoveEntries).mockReturnValue({
      data: [1, 2, 3, 4, 5].map(makeEntry),
    } as unknown as EntriesResult);
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    expect(screen.getByText("Practice 1")).toBeTruthy();
    expect(screen.getByText("Practice 4")).toBeTruthy();
    expect(screen.queryByText("Practice 5")).toBeNull();
  });

  it("shows overflow line when more than 4 entries", () => {
    vi.mocked(useSelfLoveEntries).mockReturnValue({
      data: [1, 2, 3, 4, 5].map(makeEntry),
    } as unknown as EntriesResult);
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    expect(screen.getByText(/\+ 1 more entry/)).toBeTruthy();
  });

  it("chip tap opens logger with that practice", async () => {
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    await userEvent.click(screen.getByText("Breath"));
    expect(screen.getByText("A moment of care")).toBeTruthy();
  });

  it("Log button opens logger with no pre-selected practice", async () => {
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    await userEvent.click(screen.getByText("Log"));
    expect(screen.getByText("A moment of care")).toBeTruthy();
  });

  it("Edit link opens PracticeEditor", async () => {
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    await userEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Your practices")).toBeTruthy();
  });

  it("seeds defaults when practices list is empty on mount", () => {
    vi.mocked(usePractices).mockReturnValue({
      data: [],
    } as unknown as PracticesResult);
    render(<PanelSelfLove userId="user-1" date="2026-05-27" />);
    expect(mockSeedMutate).toHaveBeenCalledOnce();
  });
});
