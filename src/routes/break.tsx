import { createFileRoute } from "@tanstack/react-router";

import { BreakScreen } from "@/features/break/BreakScreen";

export const Route = createFileRoute("/break")({
  component: BreakScreen,
});
