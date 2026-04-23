export const EMOTIONS = [
  "Anxious",
  "Stressed",
  "Overwhelmed",
  "Restless",
  "Irritable",
  "Frustrated",
  "Angry",
  "Sad",
  "Lonely",
  "Bored",
  "Tired",
  "Numb",
  "Guilty",
  "Ashamed",
  "Happy",
  "Content",
  "Calm",
  "Confident",
] as const;

export type Emotion = (typeof EMOTIONS)[number];
