import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PracticeChips } from "@/features/engine/PracticeChips";
import type { Practice } from "@/types/engine";

const ACTIVE: Practice = {
  id: "p-1",
  user_id: "user-1",
  name: "Breath",
  description: "Four slow breaths.",
  is_default: true,
  active: true,
  created_at: "2026-05-01T00:00:00Z",
};

const INACTIVE: Practice = {
  id: "p-2",
  user_id: "user-1",
  name: "Cold water",
  description: "Brief cold water.",
  is_default: true,
  active: false,
  created_at: "2026-05-01T00:00:00Z",
};

vi.mock("@/hooks/usePractices", () => ({
  usePractices: () => ({ data: [ACTIVE, INACTIVE] }),
}));

describe("PracticeChips", () => {
  it("renders active practices", () => {
    render(<PracticeChips userId="user-1" onSelect={vi.fn()} />);
    expect(screen.getByText("Breath")).toBeTruthy();
  });

  it("does not render inactive practices", () => {
    render(<PracticeChips userId="user-1" onSelect={vi.fn()} />);
    expect(screen.queryByText("Cold water")).toBeNull();
  });

  it("calls onSelect with the practice when chip is clicked", async () => {
    const onSelect = vi.fn();
    render(<PracticeChips userId="user-1" onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Breath"));
    expect(onSelect).toHaveBeenCalledWith(ACTIVE);
  });
});
