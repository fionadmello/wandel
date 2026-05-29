export type AccentColor = "violet" | "amber" | "teal" | "rose";

export const ACCENT_BORDER: Record<AccentColor, string> = {
  violet: "border-l-violet",
  amber: "border-l-amber",
  teal: "border-l-teal",
  rose: "border-l-rose",
};

export const ACCENT_TEXT: Record<AccentColor, string> = {
  violet: "text-violet",
  amber: "text-amber",
  teal: "text-teal",
  rose: "text-rose",
};

export const ACCENT_SLIDER: Record<AccentColor, string> = {
  violet: "panel-slider-violet",
  amber: "panel-slider-amber",
  teal: "panel-slider-teal",
  rose: "panel-slider-rose",
};
