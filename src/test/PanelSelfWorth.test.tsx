import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PanelSelfWorth } from "@/features/engine/PanelSelfWorth";
import type { Evidence } from "@/types/engine";

function makeEntry(n: number): Evidence {
  return {
    id: `ev-${n}`,
    user_id: "user-1",
    date: "2026-05-28",
    timestamp: `2026-05-28T${String(n).padStart(2, "0")}:00:00Z`,
    title: `Entry ${n}`,
    situation: `Context for entry ${n}`,
    what_i_did_well: `Achievement ${n}`,
    tags: [],
    archived: false,
  };
}

let evidenceData: Evidence[] = [];

vi.mock("@/hooks/useSelfWorthEvidence", () => ({
  useSelfWorthEvidence: () => ({ data: evidenceData }),
  useAddEvidence: () => ({ mutate: vi.fn(), isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  evidenceData = [];
});

describe("PanelSelfWorth", () => {
  it("renders the panel header title", () => {
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.getByText("Self-Worth")).toBeTruthy();
  });

  it("renders all entries when 6 or fewer", () => {
    evidenceData = [1, 2, 3, 4, 5, 6].map(makeEntry);
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.getByText("Entry 1")).toBeTruthy();
    expect(screen.getByText("Entry 6")).toBeTruthy();
  });

  it("shows empty state when no entries", () => {
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.getByText("Your evidence lives here.")).toBeTruthy();
  });

  it("does not show empty state when entries exist", () => {
    evidenceData = [makeEntry(1)];
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.queryByText("Your evidence lives here.")).toBeNull();
  });

  it("shows only top 6 entries when more than 6 and showAll is false", () => {
    evidenceData = [1, 2, 3, 4, 5, 6, 7].map(makeEntry);
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.getByText("Entry 1")).toBeTruthy();
    expect(screen.getByText("Entry 6")).toBeTruthy();
    expect(screen.queryByText("Entry 7")).toBeNull();
  });

  it("shows show-all toggle when more than 6 entries", () => {
    evidenceData = [1, 2, 3, 4, 5, 6, 7].map(makeEntry);
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.getByText("Show all 7 entries")).toBeTruthy();
  });

  it("tapping show-all reveals all entries and hides the toggle", async () => {
    evidenceData = [1, 2, 3, 4, 5, 6, 7].map(makeEntry);
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    await userEvent.click(screen.getByText("Show all 7 entries"));
    expect(screen.getByText("Entry 7")).toBeTruthy();
    expect(screen.queryByText("Show all 7 entries")).toBeNull();
  });

  it("Log button opens EvidenceEditor", async () => {
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    await userEvent.click(screen.getByText("Log"));
    expect(screen.getByText("Evidence")).toBeTruthy();
  });

  it("tapping a card expands it", async () => {
    evidenceData = [makeEntry(1)];
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    expect(screen.queryByText("Context for entry 1")).toBeNull();
    await userEvent.click(screen.getByText("Entry 1"));
    expect(screen.getByText("Context for entry 1")).toBeTruthy();
  });

  it("tapping an open card collapses it", async () => {
    evidenceData = [makeEntry(1)];
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    await userEvent.click(screen.getByText("Entry 1"));
    expect(screen.getByText("Context for entry 1")).toBeTruthy();
    await userEvent.click(screen.getByText("Entry 1"));
    expect(screen.queryByText("Context for entry 1")).toBeNull();
  });

  it("tapping a second card closes the first", async () => {
    evidenceData = [makeEntry(1), makeEntry(2)];
    render(<PanelSelfWorth userId="user-1" date="2026-05-28" />);
    await userEvent.click(screen.getByText("Entry 1"));
    expect(screen.getByText("Context for entry 1")).toBeTruthy();
    await userEvent.click(screen.getByText("Entry 2"));
    expect(screen.queryByText("Context for entry 1")).toBeNull();
    expect(screen.getByText("Context for entry 2")).toBeTruthy();
  });
});
