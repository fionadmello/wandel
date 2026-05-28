import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AmbientLayer } from "@/features/engine/AmbientLayer";

let reminderText: string | null = null;
let whyText = "";

vi.mock("@/hooks/useReminderRotation", () => ({
  useReminderRotation: () => reminderText,
}));

vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({ data: { why_statement: whyText } }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  reminderText = null;
  whyText = "";
});

describe("AmbientLayer", () => {
  it("renders Intentions label", () => {
    render(<AmbientLayer userId="user-1" />);
    expect(screen.getByText("Intentions")).toBeTruthy();
  });

  it("does not show reminder by default", () => {
    reminderText = "Be kind to yourself.";
    render(<AmbientLayer userId="user-1" />);
    expect(screen.queryByText("Be kind to yourself.")).toBeNull();
  });

  it("tap expands to show reminder", async () => {
    reminderText = "Be kind to yourself.";
    render(<AmbientLayer userId="user-1" />);
    await userEvent.click(screen.getByText("Intentions"));
    expect(screen.getByText("Be kind to yourself.")).toBeTruthy();
  });

  it("tap again collapses to hide reminder", async () => {
    reminderText = "Be kind to yourself.";
    render(<AmbientLayer userId="user-1" />);
    await userEvent.click(screen.getByText("Intentions"));
    expect(screen.getByText("Be kind to yourself.")).toBeTruthy();
    await userEvent.click(screen.getByText("Intentions"));
    expect(screen.queryByText("Be kind to yourself.")).toBeNull();
  });

  it("tap expands to show why statement", async () => {
    whyText = "Because I want to grow.";
    render(<AmbientLayer userId="user-1" />);
    await userEvent.click(screen.getByText("Intentions"));
    expect(screen.getByText("Because I want to grow.")).toBeTruthy();
  });

  it("does not render why statement when empty", async () => {
    reminderText = "Be kind to yourself.";
    // whyText = "" from beforeEach
    const { container } = render(<AmbientLayer userId="user-1" />);
    await userEvent.click(screen.getByText("Intentions"));
    expect(screen.getByText("Be kind to yourself.")).toBeTruthy();
    // ReminderCard renders one <p>; why statement would add a second
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
