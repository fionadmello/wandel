import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HardThingCard } from "@/features/engine/HardThingCard";
import type { HardThing } from "@/types/engine";

const BASE: HardThing = {
  id: "ht-1",
  user_id: "user-1",
  date: "2026-05-27",
  timestamp: "2026-05-27T08:00:00Z",
  what: "Told my manager something wasn't working",
  before: 5,
  during: 9,
  after: 2,
  note: null,
  linked_intention: false,
};

describe("HardThingCard", () => {
  it("renders the what text", () => {
    render(<HardThingCard entry={BASE} />);
    expect(
      screen.getByText("Told my manager something wasn't working"),
    ).toBeTruthy();
  });

  it("renders BDA labels", () => {
    render(<HardThingCard entry={BASE} />);
    expect(screen.getByText("Before")).toBeTruthy();
    expect(screen.getByText("During")).toBeTruthy();
    expect(screen.getByText("After")).toBeTruthy();
  });

  it("renders the correct insight line", () => {
    render(<HardThingCard entry={BASE} />);
    // before=5, during=9, after=2 → D max, A<B, D-A=7 → peaked
    expect(
      screen.getByText("Hardest in the moment — and it passed"),
    ).toBeTruthy();
  });

  it("does not render note section when note is null", () => {
    render(<HardThingCard entry={BASE} />);
    expect(screen.queryByTestId("hard-thing-note")).toBeNull();
  });

  it("does not show note by default when note exists", () => {
    render(<HardThingCard entry={{ ...BASE, note: "I was shaking." }} />);
    expect(screen.queryByText("I was shaking.")).toBeNull();
  });

  it("reveals note on card tap", async () => {
    render(<HardThingCard entry={{ ...BASE, note: "I was shaking." }} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("I was shaking.")).toBeTruthy();
  });

  it("collapses note on second tap", async () => {
    render(<HardThingCard entry={{ ...BASE, note: "I was shaking." }} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("I was shaking.")).toBeTruthy();
    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("I was shaking.")).toBeNull();
  });

  it("renders flat insight for flat values", () => {
    render(
      <HardThingCard entry={{ ...BASE, before: 6, during: 7, after: 6 }} />,
    );
    expect(
      screen.getByText("Steady — the challenge held its ground"),
    ).toBeTruthy();
  });
});
