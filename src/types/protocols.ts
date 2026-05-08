import type { TrackType } from "./database";

export type ProtocolId = "engine_slip" | "engine_drift" | "habit_drift";

export interface PendingProtocol {
  id: ProtocolId;
  habitId: string | null;
  trackType: TrackType;
  trackName: string;
  driftDays: number | null;
  currentStep: number;
}
