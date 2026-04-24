import { createFileRoute } from "@tanstack/react-router";

import { BuildScreen } from "@/features/build/BuildScreen";

export const Route = createFileRoute("/build/")({
  component: BuildScreen,
});
