import { createFileRoute } from "@tanstack/react-router";

import { MorningScreen } from "@/features/morning/MorningScreen";

export const Route = createFileRoute("/morning")({
  component: MorningScreen,
});
