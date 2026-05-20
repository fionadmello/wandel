interface DefaultPracticeTemplate {
  name: string;
  description: string;
  is_default: true;
  active: true;
}

export const DEFAULT_PRACTICES: DefaultPracticeTemplate[] = [
  {
    name: "Cold water",
    description:
      "Brief cold water on face or a short cold shower. A deliberate act of aliveness.",
    is_default: true,
    active: true,
  },
  {
    name: "Slow movement",
    description:
      "Moving through something with full attention. Making tea, washing face, walking to the window. The deliberateness is the practice.",
    is_default: true,
    active: true,
  },
  {
    name: "Breath",
    description:
      "Four slow breaths. In for four counts, out for six. A signal to the body that it is safe to slow down.",
    is_default: true,
    active: true,
  },
  {
    name: "Body scan",
    description:
      "Two minutes of noticing what the body feels right now — without changing anything. Just noticing.",
    is_default: true,
    active: true,
  },
  {
    name: "Sunlight or outside",
    description:
      "Standing outside or near a window for a few minutes. No phone. Just light.",
    is_default: true,
    active: true,
  },
  {
    name: "Mirror practice",
    description:
      "Standing at the mirror for 20 seconds. No script. Just looking.",
    is_default: true,
    active: true,
  },
];
