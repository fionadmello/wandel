import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EvidenceCard } from "@/features/engine/EvidenceCard";
import type { Evidence } from "@/types/engine";

const BASE: Evidence = {
  id: "ev-1",
  user_id: "user-1",
  date: "2026-05-28",
  timestamp: "2026-05-28T09:00:00Z",
  title: "Stayed composed",
  situation: "A difficult conversation with a colleague.",
  what_i_did_well: "I listened without interrupting and kept my voice calm.",
  tags: [],
  archived: false,
};

describe("EvidenceCard", () => {
  it("renders title when collapsed", () => {
    render(<EvidenceCard entry={BASE} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.getByText("Stayed composed")).toBeTruthy();
  });

  it("renders formatted date when collapsed", () => {
    render(<EvidenceCard entry={BASE} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.getByText("28 May 2026")).toBeTruthy();
  });

  it("renders what_i_did_well preview when collapsed", () => {
    render(<EvidenceCard entry={BASE} isOpen={false} onToggle={vi.fn()} />);
    const preview = screen.getByText(
      "I listened without interrupting and kept my voice calm.",
    );
    expect(preview).toBeTruthy();
    expect(preview).toHaveClass("line-clamp-2");
  });

  it("does not show Situation label or text when collapsed", () => {
    render(<EvidenceCard entry={BASE} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.queryByText("Situation")).toBeNull();
    expect(
      screen.queryByText("A difficult conversation with a colleague."),
    ).toBeNull();
    expect(screen.queryByText("What I did well")).toBeNull();
  });

  it("shows Situation label and text when expanded", () => {
    render(<EvidenceCard entry={BASE} isOpen onToggle={vi.fn()} />);
    expect(screen.getByText("Situation")).toBeTruthy();
    expect(
      screen.getByText("A difficult conversation with a colleague."),
    ).toBeTruthy();
  });

  it("shows What I did well label when expanded", () => {
    render(<EvidenceCard entry={BASE} isOpen onToggle={vi.fn()} />);
    expect(screen.getByText("What I did well")).toBeTruthy();
  });

  it("calls onToggle when card is tapped", async () => {
    const onToggle = vi.fn();
    render(<EvidenceCard entry={BASE} isOpen={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
