import type { TakeUpSpaceOutcome } from "@/types/takeUpSpace";

export const OUTCOME_COLORS: Record<
  TakeUpSpaceOutcome | "in_progress",
  string
> = {
  override: "#E8735A",
  paused: "#E6B93D",
  chose_differently: "#4DB896",
  not_sure: "#8899D4",
  in_progress: "#C4637A", // UI-only state — maps to the rose panel accent, not a DB value
};
