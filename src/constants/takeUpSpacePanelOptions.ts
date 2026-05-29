import type {
  TakeUpSpaceOutcome,
  TakeUpSpacePanelTag,
} from "@/types/takeUpSpace";

export const OUTCOME_OPTIONS: { value: TakeUpSpaceOutcome; label: string }[] = [
  { value: "override", label: "I overrode myself" },
  { value: "paused", label: "I paused" },
  { value: "chose_differently", label: "I chose differently" },
  { value: "not_sure", label: "I am not sure yet" },
];

export const PANEL_TAG_OPTIONS: {
  value: TakeUpSpacePanelTag;
  label: string;
  description: string;
}[] = [
  {
    value: "self_respect",
    label: "Self-Respect",
    description:
      "I did something hard. I acted despite resistance, fear, or avoidance.",
  },
  {
    value: "self_love",
    label: "Self-Love",
    description:
      "I slowed down. I chose a practice or action that was purely for my own care.",
  },
  {
    value: "self_worth",
    label: "Self-Worth",
    description:
      "This moment contradicted the belief that I am not enough. I showed up for myself in a way worth remembering.",
  },
  {
    value: "none",
    label: "None",
    description:
      "This entry stands on its own. It does not connect to a specific panel theme.",
  },
];
