import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SelfLoveCard } from "@/features/engine/SelfLoveCard";
import type { SelfLoveEntry } from "@/types/engine";

const BASE: SelfLoveEntry = {
  id: "sl-1",
  user_id: "user-1",
  date: "2026-05-27",
  timestamp: "2026-05-27T08:42:00Z",
  practice: "Breath",
  practice_id: "p-1",
  felt: 7,
  note: null,
};

describe("SelfLoveCard", () => {
  it("renders the practice name", () => {
    render(<SelfLoveCard entry={BASE} />);
    expect(screen.getByText("Breath")).toBeTruthy();
  });

  it("renders the timestamp formatted as time", () => {
    render(<SelfLoveCard entry={BASE} />);
    const expected = new Date(BASE.timestamp).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    expect(screen.getByText(expected)).toBeTruthy();
  });

  it("renders anchor labels Adrift and Present", () => {
    render(<SelfLoveCard entry={BASE} />);
    expect(screen.getByText("Adrift")).toBeTruthy();
    expect(screen.getByText("Present")).toBeTruthy();
  });

  it("renders the felt fill bar", () => {
    const { container } = render(<SelfLoveCard entry={BASE} />);
    const fill = container.querySelector(".bg-gold");
    expect(fill).toBeTruthy();
    expect((fill as HTMLElement).style.width).toBe("70%");
  });

  it("does not show note by default when note exists", () => {
    render(<SelfLoveCard entry={{ ...BASE, note: "Felt centred." }} />);
    expect(screen.queryByText("Felt centred.")).toBeNull();
  });

  it("reveals note on card tap", async () => {
    render(<SelfLoveCard entry={{ ...BASE, note: "Felt centred." }} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Felt centred.")).toBeTruthy();
  });

  it("collapses note on second tap", async () => {
    render(<SelfLoveCard entry={{ ...BASE, note: "Felt centred." }} />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Felt centred.")).toBeNull();
  });

  it("renders as div (no button) when note is null", () => {
    render(<SelfLoveCard entry={BASE} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
