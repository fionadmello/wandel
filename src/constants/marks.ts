import type { MarkType } from "@/types/database";

export interface MarkDefinition {
  type: MarkType;
  label: string;
  configKey: string;
}

export const MARKS: MarkDefinition[] = [
  { type: "full", label: "Full session", configKey: "full_version" },
  { type: "half", label: "Minimum version", configKey: "minimum_version" },
  { type: "dot", label: "Non-negotiable only", configKey: "non_negotiable" },
];
