import { createFileRoute } from "@tanstack/react-router";

import { SetupScreen } from "@/features/setup/SetupScreen";

export const Route = createFileRoute("/setup")({
  component: SetupScreen,
});
