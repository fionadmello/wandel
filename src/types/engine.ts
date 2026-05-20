import type { Database } from "./database";

export type HardThing = Database["public"]["Tables"]["hard_things_log"]["Row"];
export type SelfLoveEntry =
  Database["public"]["Tables"]["self_love_log"]["Row"];
export type Evidence =
  Database["public"]["Tables"]["self_worth_evidence"]["Row"];
export type Practice =
  Database["public"]["Tables"]["practice_collection"]["Row"];
export type DailyIntention =
  Database["public"]["Tables"]["daily_intentions"]["Row"];
