export type AccentColor = "violet" | "amber" | "teal";

export const ACCENT_BORDER: Record<AccentColor, string> = {
  violet: "border-l-violet",
  amber: "border-l-amber",
  teal: "border-l-teal",
};

export const ACCENT_TEXT: Record<AccentColor, string> = {
  violet: "text-violet",
  amber: "text-amber",
  teal: "text-teal",
};

export const ACCENT_SLIDER: Record<AccentColor, string> = {
  violet: "panel-slider-violet",
  amber: "panel-slider-amber",
  teal: "panel-slider-teal",
};
